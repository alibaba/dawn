import * as path from "path";
import * as Dawn from "@dawnjs/types";
import type { Configuration } from "webpack/types.d";

import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

import { FileInfo, IGetWebpackConfigOpts, Output } from "./types";
import getModule from "./dev-utils/getModule";
import getPlugins from "./dev-utils/getPlugins";
import { getPublicPath } from "./dev-utils/utils";
import getOptimization from "./dev-utils/getOptimization";

const moduleFileExtensions = [".js", ".mjs", ".json", ".jsx", ".css", ".less", ".scss", ".sass"];

// Generate webpack entries
const getEntry = (options: IGetWebpackConfigOpts) => {
  const webpackEntry: any = {};
  (options.entry as FileInfo[]).forEach(({ name, file }) => {
    webpackEntry[name] = [...options.inject, file, ...options.append];
  });
  return webpackEntry;
};

// Generate devtool/sourcemap
const getDevtool = (devtool: boolean | string, ctx: Dawn.Context) => {
  let formatDevtool: string | false;
  switch (devtool) {
    case false:
      formatDevtool = false;
      break;
    case true:
    case undefined:
    default:
      if (typeof devtool === "string") {
        formatDevtool = devtool;
      } else {
        formatDevtool = ctx.isEnvDevelopment ? "source-map" : false;
      }
      break;
  }
  return formatDevtool;
};

// Generate webpack config
export const getWebpackConfig = async (options: IGetWebpackConfigOpts, ctx: Dawn.Context) => {
  // util symbol
  ctx.isEnvDevelopment = options.env === "development";
  ctx.isEnvProduction = options.env === "production";

  const webpackModule = await getModule(options, ctx);

  const config: Configuration = {
    // Learn more about the mode configuration and what optimizations take place on each value.
    // https://webpack.js.org/configuration/mode/
    mode: options.env,
    // stop compilation early in production
    bail: ctx.isEnvProduction,
    // https://webpack.js.org/configuration/devtool/#devtool
    devtool: getDevtool(options.devtool, ctx),
    // webpack can compile for multiple environments or targets.
    // to understand what a target is in detail: https://webpack.js.org/concepts/targets/
    target: options.target,
    // web script entry(ies)
    entry: getEntry(options),
    output: {
      // User output option
      ...(options.output as any),
      // The build folder.
      path: path.resolve(options.cwd, (options.output as any)?.path),
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: ctx.isEnvDevelopment,
      // There will be one main bundle, and one file per asynchronous chunk.
      // In development, it does not produce real files.
      filename: path.join(options?.folders?.script ?? "", "[name].js"),
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: path.join(options?.folders?.script ?? "", "[name].[chunkhash:8].chunk.js"),
      // webpack uses `publicPath` to determine where the app is being served from.
      // It requires a trailing slash, or the file assets will get an incorrect path.
      // We inferred the "public path" (such as / or /my-project) from homepage.
      publicPath: getPublicPath(ctx),
      // this defaults to 'window', but by setting it to 'this' then
      // module chunks which are built will work in web workers as well.
      globalObject: "this",
    },
    module: webpackModule,
    plugins: getPlugins(options, ctx).filter(Boolean),
    resolve: {
      alias: {
        // Allows for better profiling with ReactDevTools
        ...(options.profiling && {
          "react-dom$": "react-dom/profiling",
          // This is a package for cooperative scheduling in a browser environment.
          // It is currently used internally by React, but we plan to make it more generic.
          // https://www.npmjs.com/package/scheduler
          "scheduler/tracing": "scheduler/tracing-profiling",
        }),
        ...options.alias,
      },
      // Enable resolving symlinks to the original location.
      symlinks: true,
      modules: [
        "node_modules",
        path.resolve(ctx.cwd, "./node_modules/"),
        path.resolve(__dirname, "../node_modules/"),
        ctx.cwd,
        path.resolve(__dirname, "../"),
      ],
      extensions: moduleFileExtensions.concat(ctx.useTypeScript ? [".ts", ".tsx"] : []),
      // Use tsconfig.paths as webpack alias
      plugins: [ctx.useTypeScript && new TsconfigPathsPlugin()].filter(Boolean),
    },
    externals: options.externals as any,
    // Some libraries import Node modules but don't use them in the browser.
    // Tell webpack to provide empty mocks for them so importing them works.
    // webpack@v5 make some changes, see: https://webpack.js.org/migrate/5/#test-webpack-5-compatibility
    node: {
      // TODO: node
    },
    watch: options.watch,
    // Cache the generated webpack modules and chunks to improve build speed.
    // https://webpack.js.org/configuration/other-options/#cache
    cache: options.cache as any,
    // These options allows you to control how webpack notifies you
    // of assets and entry points that exceed a specific file limit.
    performance: options.performanceConfig,
    optimization: getOptimization(options, ctx) as any,
  };
  return config;
};
