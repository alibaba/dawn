import path from "path";
import assert from "assert";
import camelCase from "camelcase";
import merge from "deepmerge";
import { debug, formatNullStringToList, formatReglikeObject, getExistFile } from "./utils";
import type { Context, Env, INormalizedOpts, IOpts } from "./types";

// 生成排除配置
function makeExternal(commonjs: string, root: string, amd?: string) {
  amd = amd || commonjs;
  const commonjs2 = commonjs;
  return { commonjs, commonjs2, root, amd };
}

// 库默认排除设定
const LIB_DEFAULT_EXTERNALS = {
  react: makeExternal("react", "React"),
  "react-dom": makeExternal("react-dom", "ReactDOM"),
};

// 普通项目默认排除设定
const PRO_DEFAULT_EXTERNALS = {
  react: "React",
  "react-dom": "ReactDOM",
};

const isLegalEnv = (e?: string) => ["development", "production"].includes(e);

// Validate and format input opts
export const normalizeOpts = (opts: Partial<IOpts>, ctx: Context): INormalizedOpts => {
  let { env, entry, template } = opts;

  // env
  if (!isLegalEnv(env)) {
    let envMessage = "[webpack5] `env` should be one of development/production";
    if (isLegalEnv(process.env?.DN_ENV)) {
      env = process.env.DN_ENV as Env;
      envMessage += `, set to "${env}" automatically by DN_ENV`;
    } else if (isLegalEnv(process.env?.NODE_ENV)) {
      env = process.env.NODE_ENV as Env;
      envMessage += `, set to "${env}" automatically by NODE_ENV`;
    } else {
      // ctx.command == current pipe full-name: init/dev/build/publish/..
      env = ctx.command.includes("dev") || ctx.command.includes("daily") ? "development" : "production";
      envMessage += `, set to "${env}" automatically by DN_CMD`;
    }
    ctx.console.log(envMessage);
  }

  // @ts-ignore
  const options: INormalizedOpts = {
    cwd: ctx.cwd,
    configFile: "./webpack.config.js",
    injectCSS: env === "development",
    compress: env === "production",
    profile: !!process.env.WEBPACK_PROFILE,
    disabledTypeCheck: false,
    server: env === "development",
    ignoreMomentLocale: true,
    typeCheckInclude: ["**/*"],
    statsOpts: "verbose",
    ...opts,
    env,
    serverOpts: {
      host: "localhost",
      historyApiFallback: true,
      open: true,
      hot: true,
      ...opts.serverOpts,
      client:
        typeof opts.serverOpts?.client === "boolean"
          ? opts.serverOpts?.client
          : { overlay: { errors: true, warnings: false }, ...opts.serverOpts?.client },
    },
    watchOpts: { ignored: /node_modules/, ...opts.watchOpts },
    devtool: opts.devtool ?? opts.sourceMap,
    inject: formatNullStringToList(opts.inject),
    append: formatNullStringToList(opts.append),
    folders: {
      script: opts.folders?.js ?? "js",
      style: opts.folders?.css ?? "css",
      media: opts.folders?.img ?? "assets",
      html: opts.folders?.html ?? "",
      ...opts.folders,
    },
    babel: {
      jsxRuntime: opts.jsxRuntime ?? true,
      runtimeHelpers: true,
      corejs: 3,
      ...opts.babel,
    },
    cssLoader: {
      modules: opts.cssModules,
      ...opts.cssLoader,
    },
    postcssPresetEnv: {
      autoprefixer: opts.autoprefixer,
      ...opts.postcssPresetEnv,
    },
    config: {
      name: "$config",
      path: "./src/config",
      env: ctx.env || ctx.command,
      ...opts.config,
    },
    common: {
      name: "common",
      ...opts.common,
    },
  };

  // entry
  if (!entry || (Array.isArray(entry) && !entry.length) || (typeof entry === "object" && !Object.keys(entry).length)) {
    entry = getExistFile({
      cwd: options.cwd,
      files: ["src/index.tsx", "src/index.ts", "src/index.jsx", "src/index.js"],
      returnRelative: true,
    });
  }
  assert.ok(entry, "[webpack5] No `entry` found, checkout guide for usage details.");
  options.entry = formatReglikeObject(entry);

  // template
  if (template === true || template === undefined) {
    // auto find templates
    template = getExistFile({
      cwd: options.cwd,
      // `src/assets/index.html` is not recommanded and will be removed soon
      files: ["public/index.html", "src/assets/index.html"],
      returnRelative: true,
    });
    options.template = formatReglikeObject(template);
  } else if (
    !template ||
    (Array.isArray(template) && !template.length) ||
    (typeof template === "object" && !Object.keys(template).length)
  ) {
    options.template = [];
  } else {
    options.template = formatReglikeObject(template);
  }

  // output
  if (typeof options.output === "string") {
    options.output = { path: options.output };
  } else if (!options.output || !options.output?.path) {
    options.output = { ...options?.output, path: "./build" };
  }

  if (options.output?.libraryTarget === "umd") {
    // Use output.library.type instead as webpack might drop support for output.libraryTarget in the future
    delete options.output.libraryTarget;
    if (typeof options.output.library === "string" || Array.isArray(options.output.library)) {
      options.output.library = {
        name: options.output.library,
        type: "umd",
      };
    } else {
      options.output.library = {
        name: camelCase(path.basename(ctx.project.name)),
        type: "umd",
        ...options.output.library,
      };
    }
  }

  // chunkFilename for v3
  if (options.chunkFilename && !options.output.chunkFilename) {
    options.output.chunkFilename = options.chunkFilename;
    delete options.chunkFilename;
    ctx.console.warn(
      "[webpack5] `chunkFilename` is not recommanded in dn-middleware-webpack5, please use `output.chunkFilename` instead",
    );
  }

  // Merge custom server config
  const customServerConfig = ctx.utils.confman.load(path.resolve(options.cwd, "server"));
  if (customServerConfig && Object.keys(customServerConfig).length) {
    ctx.console.info("[webpack5] Merge custom server config");
    debug("customServerConfig", customServerConfig);
    options.serverOpts = merge(options.serverOpts, customServerConfig);
  }

  assert.ok(
    !(options.server && options.serverOpts.hot && options.env === "production"),
    "[webpack5] react-refresh must be disabled in production mode",
  );

  // externals
  if (typeof options.external !== "boolean") {
    // auto disable external when dev mode
    options.external = options.env !== "development";
  }
  if (options.external === false) {
    options.externals = {};
  } else {
    options.externals = options.externals || (options.output?.library ? LIB_DEFAULT_EXTERNALS : PRO_DEFAULT_EXTERNALS);
  }
  if (options.server && options.serverOpts?.hot && Object.keys(options.externals).length > 0) {
    options.serverOpts.hot = false;
    ctx.console.warn("[webpack5] Disable hot mode while using externals");
  }

  // target
  // browser means web
  // default is web
  options.target = options.target === "browser" ? "web" : options.target;

  if (options.devtool === true || typeof options.devtool === "undefined") {
    // @ts-ignore
    options.devtool = env === "development" ? "eval-cheap-module-source-map" : "source-map";
  }

  // analysis
  options.analysis = options.analysis ?? options.profile;
  if (options.analysis === true) {
    // set default analysisConfig
    options.analysis = {
      analyzerMode: "server",
      openAnalyzer: true,
    };
  }

  return options;
};
