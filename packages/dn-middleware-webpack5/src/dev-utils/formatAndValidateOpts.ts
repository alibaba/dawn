import * as fs from "fs";
import * as path from "path";
import * as Dawn from "@dawnjs/types";
import * as assert from "assert";
import { camelCase } from "lodash";
import { Env, IGetWebpackConfigOpts, IOpts } from "../types";
import { formatNullStringToList, formatReglikeObject, getExistFile } from "./utils";

// 生成排除配置
function makeExternal(commonjs: string, root: string, amd?: string) {
  amd = amd || commonjs;
  const commonjs2 = commonjs;
  return { commonjs, commonjs2, root, amd };
}

// 库默认排除设定
const LIB_DEFAULT_EXTERNALS = {
  jquery: makeExternal("jquery", "jQuery"),
  zepto: makeExternal("zepto", "Zepto"),
  react: makeExternal("react", "React"),
  "react-dom": makeExternal("react-dom", "ReactDOM"),
};

// 普通项目默认排除设定
const PRO_DEFAULT_EXTERNALS = {
  jquery: "jQuery",
  zepto: "Zepto",
  react: "React",
  "react-dom": "ReactDOM",
};

// Validate and format input opts
const formatAndValidateOpts = (opts: Partial<IOpts>, ctx: Dawn.Context) => {
  const options = Object.assign({}, opts) as IGetWebpackConfigOpts;

  // cwd
  options.cwd = options.cwd || ctx.cwd;

  // env
  const isLegalEnv = (e?: Env) => ["development", "production"].includes(e);
  if (!isLegalEnv(options.env)) {
    let envMessage = "[webpack5] `env` should be one of development/production";
    if (isLegalEnv(process.env?.DN_ENV as Env)) {
      options.env = process.env.DN_ENV as Env;
      envMessage += `, set to "${options.env}" automatically by DN_ENV`;
    } else if (isLegalEnv(process.env?.NODE_ENV as Env)) {
      options.env = process.env.NODE_ENV as Env;
      envMessage += `, set to "${options.env}" automatically by NODE_ENV`;
    } else {
      // ctx.command == current pipe full-name: init/dev/build/publish/..
      options.env = ctx.command.includes("dev") || ctx.command.includes("daily") ? "development" : "production";
      envMessage += `, set to "${options.env}" automatically by DN_CMD`;
    }
    ctx.console.warn(envMessage);
  }

  // entry
  if (
    !opts.entry ||
    (Array.isArray(opts.entry) && !opts.entry?.length) ||
    (typeof opts.entry === "object" && !Object.keys(opts.entry)?.length)
  ) {
    opts.entry = getExistFile({
      cwd: options.cwd,
      files: ["src/index.tsx", "src/index.ts", "src/index.jsx", "src/index.js"],
      returnRelative: true,
    });
  }
  assert.ok(opts.entry, "[webpack5] No `entry` found, checkout guide for usage details.");
  options.entry = formatReglikeObject(opts.entry as any);

  // template
  if (opts.template === true || opts.template === undefined) {
    // auto find templates
    opts.template = getExistFile({
      cwd: options.cwd,
      // `src/assets/index.html` is not recommanded and will be removed soon
      files: ["public/index.html", "src/assets/index.html"],
      returnRelative: true,
    });
    options.template = formatReglikeObject(opts.template);
  } else if (
    !opts.template ||
    (Array.isArray(opts.template) && !opts.template?.length) ||
    (typeof opts.template === "object" && !Object.keys(opts.template)?.length)
  ) {
    options.template = [];
  } else {
    options.template = formatReglikeObject(opts.template);
  }

  // watch
  // default true when in development
  options.watch = options.watch ?? false /*options.env === "development"*/;

  // watchOpts
  options.watchOpts = options.watchOpts ?? {
    // aggregateTimeout: 200,
    poll: true,
    ignored: /node_modules/,
  };

  // injectCss
  // default: only inject when dev, not inject when build
  ctx.injectCSS = options.injectCSS === undefined ? options.env === "development" : !!options.injectCSS;

  // publicPath
  ctx.publicPath = options.publicPath ?? "";

  // devtool/sourceMap
  options.devtool = options.devtool ?? options.sourceMap;

  // inject & append
  options.inject = formatNullStringToList(options.inject);
  options.append = formatNullStringToList(options.append);

  // output
  const defaultOutputPath = "./build";
  if (typeof options.output === "string") {
    options.output = { path: options.output };
  } else if (!options.output || !options.output?.path) {
    options.output = { ...options?.output, path: defaultOutputPath };
  }

  if (options.output?.libraryTarget === "umd") {
    options.output.library = options.output.library || (camelCase(path.basename(ctx.project.name)) as any);
  }

  // folders
  options.folders = {
    script: options?.folders?.js ?? ".",
    style: options?.folders?.css ?? ".",
    media: options?.folders?.img ?? "assets",
    html: options?.folders?.html ?? "",
    ...options.folders,
  };

  // chunkFilename for v3
  if (options.chunkFilename) {
    options.output.chunkFilename = options.chunkFilename;
    ctx.console.warn(
      "[webpack5] `chunkFilename` is not recommanded in dn-middleware-webpack5, please use `output.chunkFilename` instead",
    );
  }

  options.hot = options.hot ?? (options.env === "development" && options.watch);
  assert.ok(
    !(options.hot && options.env === "production"),
    "[webpack5] react-refresh must be disabled in production mode",
  );

  // externals
  if (typeof options.external !== "boolean") {
    // auto disable external when dev mode
    options.external = options.env === "development" ? false : true;
  }
  if (options.external === false) {
    options.externals = {};
  } else {
    if (options.hot && options.externals) {
      options.externals = {};
      ctx.console.warn(
        "[webpack5] Auto set `externals` to {} by using react-refresh in development mode. You can set `hot` to false to disabled it in development mode",
      );
    }
    options.externals = options.externals || (options.output?.library ? LIB_DEFAULT_EXTERNALS : PRO_DEFAULT_EXTERNALS);
  }

  // performance
  // default is false
  // true means warning
  options.performance = options.performance === true ? "warning" : options.performance ?? false;
  options.performanceConfig = { hints: options.performance };

  // compress
  // default is true when in production
  // Make sure to turn off this when you need dn-middleware-compress
  options.compress = options.compress ?? options.env === "production";

  // target
  // browser means web
  // default is web
  options.target = options.target === "browser" ? "web" : options.target ?? "web";

  // alias
  if (ctx.useTypeScript && options.alias) {
    ctx.console.warn("[webpack5] `alias` is not recommanded in ts project, please use paths in tsconfig.json");
  }

  // common chunk
  options.common = {
    disabled: true, // break change: default disabled common
    name: "common",
    ...options.common,
  };

  // analysis
  options.analysis = options.analysis ?? false;
  if (options.analysis === true) {
    // set default analysisConfig
    options.analysis = {
      analyzerMode: "server",
      openAnalyzer: false,
    };
  }

  // profiling
  // TODO: change default to true?
  options.profiling = options.profiling ?? false;

  // cache default filesystem
  options.cache = options.cache ?? {
    type: "memory",
  };

  // cssLoader
  // style.module.(css|less|scss|sass)$
  options.cssLoader = options.cssLoader ?? {};
  if (options.cssModules) {
    options.cssLoader = {
      modules: opts.cssModules,
      // CamelCase is not supported anymore. It's recommended for local selectors.
      // camelCase: opts.cssModules, // 只要启用就采用「小驼峰」
    };
  }
  // tscCompileOnError
  // default is true
  // If `true`, errors in TypeScript type checking will not prevent start script from running app,
  // and will not cause build script to exit unsuccessfully.
  // Also downgrades all TypeScript type checking error messages to warning messages.
  options.tscCompileOnError = options.tscCompileOnError !== false;

  options.disabledTypeCheck = options.disabledTypeCheck !== false;
  // other judges

  // useTypeScript judge by entry file ext
  ctx.useTypeScript = options.entry?.some?.(({ file }) => file.endsWith(".ts") || file.endsWith(".tsx"));
  assert.ok(
    // if entry is dot ts(x), but not found tsconfig.json, exist
    !(ctx.useTypeScript && !fs.existsSync(path.join(ctx.cwd, "tsconfig.json"))),
    "[webpack5] Your entry is typescript but missing tsconfig.json file.",
  );

  // $config
  options.config = {
    name: options.config?.name ?? "$config",
    path: options.config?.name ?? "./src/config",
    env: options.config?.env || opts.env || ctx.command,
  };
  return options as IOpts;
};

export default formatAndValidateOpts;
