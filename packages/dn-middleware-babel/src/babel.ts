import { extname, join, relative, resolve } from "path";
import { existsSync, statSync } from "fs";
import vfs from "vinyl-fs";
import * as chokidar from "chokidar";
import { debounce } from "lodash";
import gulpIf from "gulp-if";
import gulpTS from "gulp-typescript";
import through from "through2";
import * as babel from "@babel/core";
import { getTSConfigCompilerOptions, isTransform } from "./utils";
import { IDawnContext, IOpts } from "./types";
import { getBabelConfig } from "./getBabelConfig";

export const run = async (opts: IOpts, ctx: IDawnContext) => {
  const {
    cwd,
    watch,
    type = "cjs",
    srcDir = "src",
    output,
    target = "node",
    include = ["**/*"],
    exclude = ["**/__test__{,/**}", "**/*.+(test|e2e|spec).+(js|jsx|ts|tsx)"],
    runtimeHelpers,
    extraPresets = [],
    extraPlugins = [],
    nodeVersion,
    disableTypeCheck,
    lazy,
  } = opts;

  const srcPath = resolve(cwd, srcDir);
  const outputDir = output || type === "cjs" ? "lib" : "es";
  const outputPath = resolve(cwd, outputDir);
  const patterns = include.map(p => join(srcPath, p)).concat(exclude.map(p => `!${join(srcPath, p)}`));

  const getTSConfig = (): Record<string, any> => {
    const tsConfigPath = join(cwd, "tsconfig.json");
    const templateTSConfigPath = join(__dirname, "../template/tsconfig.json");

    if (existsSync(tsConfigPath)) {
      return getTSConfigCompilerOptions(tsConfigPath) || {};
    }
    return getTSConfigCompilerOptions(templateTSConfigPath) || {};
  };

  const transform = (file: { contents: string; path: string }): string => {
    const babelOpts = getBabelConfig({
      target,
      type,
      typescript: /\.tsx?$/.test(file.path),
      runtimeHelpers,
      nodeVersion,
      lazy,
    });
    babelOpts.presets.push(...extraPresets);
    babelOpts.plugins.push(...extraPlugins);

    ctx.console.log(`Transform to ${type} for ${relative(cwd, file.path)}`);

    return babel.transform(file.contents, { ...babelOpts, filename: file.path }).code;
  };

  const createStream = (src: string | string[]): NodeJS.ReadWriteStream => {
    const tsConfig = getTSConfig();
    const tsFileRegexp = /\.tsx?$/;
    const babelTransformRegexp = disableTypeCheck ? /\.(t|j)sx?$/ : /\.jsx?$/;

    return vfs
      .src(src, { allowEmpty: true, base: srcPath })
      .pipe(gulpIf(f => !disableTypeCheck && isTransform(f.path, tsFileRegexp), gulpTS(tsConfig)))
      .pipe(
        gulpIf(
          f => isTransform(f.path, babelTransformRegexp),
          through.obj((file, env, cb) => {
            try {
              file.contents = Buffer.from(transform(file)); // eslint-disable-line no-param-reassign
              file.path = file.path.replace(extname(file.path), ".js"); // eslint-disable-line no-param-reassign
              cb(null, file);
            } catch (e) {
              ctx.console.error(`Compiled failed: ${file.path}`);
              ctx.console.error(e);
              cb(null);
            }
          }),
        ),
      )
      .pipe(vfs.dest(outputPath));
  };

  return new Promise(resolvePromise => {
    createStream(patterns).on("end", () => {
      if (watch) {
        ctx.console.log(`Start watching ${relative(cwd, srcPath)} directory...`);
        const watcher = chokidar.watch(patterns, { ignoreInitial: true });
        const files = [];
        const compileFiles = debounce(() => {
          while (files.length) {
            createStream(files.pop());
          }
        }, 1000);
        watcher.on("all", (event, fullPath) => {
          ctx.console.log(`[${event}] ${relative(cwd, fullPath)}`);
          if (!existsSync(fullPath)) {
            return;
          }
          if (statSync(fullPath).isFile()) {
            if (!files.includes(fullPath)) {
              files.push(fullPath);
            }
            compileFiles();
          }
        });
        process.once("SIGINT", () => {
          watcher.close();
          process.exit(0);
        });
      }
      resolvePromise();
    });
  });
};
