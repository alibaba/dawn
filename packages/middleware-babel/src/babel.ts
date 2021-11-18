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

export const run = async (
  opts: IOpts,
  ctx: IDawnContext,
): Promise<Pick<babel.TransformOptions, "presets" | "plugins">> => {
  const {
    env,
    cwd,
    watch,
    type = "cjs",
    srcDir = "src",
    output,
    target = "node",
    include = ["**/*"],
    exclude = ["**/__test__{,/**}", "**/*.+(test|e2e|spec).+(js|jsx|ts|tsx)"],
    runtimeHelpers,
    corejs,
    jsxRuntime,
    pragma,
    pragmaFrag,
    disableAutoReactRequire,
    extraPresets = [],
    extraPlugins = [],
    nodeVersion,
    disableTypeCheck,
    noEmit,
  } = opts;

  const srcPath = resolve(cwd, srcDir);
  const outputDir = output || (type === "cjs" ? "lib" : "es"); // lib for type=cjs and es for type=esm if not set output option
  const outputPath = resolve(cwd, outputDir);
  const patterns = include.map(p => join(srcPath, p)).concat(exclude.map(p => `!${join(srcPath, p)}`));

  const babelOpts = getBabelConfig({
    env,
    target,
    type,
    typescript: true,
    runtimeHelpers,
    corejs,
    jsxRuntime,
    pragma,
    pragmaFrag,
    disableAutoReactRequire,
    nodeVersion,
  });
  babelOpts.presets.push(...extraPresets);
  babelOpts.plugins.push(...extraPlugins);

  if (ctx.emit) {
    ctx.emit("babel.config", babelOpts);
    await ctx.utils.sleep(100);
  }

  // In noEmit mode, do not transform code and return babelOpts immediately
  if (noEmit) {
    return babelOpts;
  }

  // Transform file with babel
  const transform = (file: { contents: string; path: string }): string => {
    ctx.console.log(`Transform to ${type} for ${relative(cwd, file.path)}`);

    return babel.transformSync(file.contents, { ...babelOpts, filename: file.path }).code;
  };

  // Get compilerOptions from project's tsconfig.json or default template
  const getTSConfig = (): Record<string, any> => {
    const tsConfigPath = join(cwd, "tsconfig.json");
    const templateTSConfigPath = join(__dirname, "../template/tsconfig.json");

    if (existsSync(tsConfigPath)) {
      return getTSConfigCompilerOptions(tsConfigPath) || {};
    }
    return getTSConfigCompilerOptions(templateTSConfigPath) || {};
  };

  // Stream src via vinyl-fs
  const createStream = (src: string | string[]): NodeJS.ReadWriteStream => {
    const tsConfig = getTSConfig();
    const tsFileRegexp = /\.tsx?$/;
    const babelTransformRegexp = disableTypeCheck ? /\.(t|j)sx?$/ : /\.jsx?$/; // Transform ts file with babel if not need type check

    return vfs
      .src(src, { allowEmpty: true, base: srcPath })
      .pipe(gulpIf(f => !disableTypeCheck && isTransform(f.path, tsFileRegexp), gulpTS(tsConfig))) // Transform ts file with tsc if need type check
      .pipe(
        gulpIf(
          f => isTransform(f.path, babelTransformRegexp),
          through.obj((file, enc, cb) => {
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
      .pipe(vfs.dest(outputPath)); // Included files that not transformed by babel will output unchanged (same as copy)
  };

  ctx.console.info("Babel transform starting...");

  return new Promise(resolvePromise => {
    createStream(patterns).on("end", () => {
      if (watch) {
        ctx.console.info(`Start watching ${relative(cwd, srcPath)} directory...`);
        const watcher = chokidar.watch(patterns, { ignoreInitial: true });
        const files = [];
        // Debounce file change event
        const compileFiles = debounce(() => {
          createStream([...files]);
          files.length = 0;
        }, 1000);

        watcher.on("all", (event, fullPath) => {
          ctx.console.info(`[${event}] ${relative(cwd, fullPath)}`);
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
          ctx.console.info("End watching...");
          process.exit(0);
        });
      } else {
        ctx.console.info("Babel transform finished.");
      }
      resolvePromise(babelOpts);
    });
  });
};
