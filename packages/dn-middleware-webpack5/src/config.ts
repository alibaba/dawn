import * as Dawn from "@dawnjs/types";
import type { Configuration } from "webpack";
// import HtmlWebpackPlugin from "html-webpack-plugin";

import { IGetWebpackConfigOpts } from "./types";

// TODO:
// const webpackDevClientEntry = require.resolve("react-dev-utils/webpackHotDevClient");

const getEntry = (options: IGetWebpackConfigOpts) => {
  const webpackEntry: any = {};
  options.entry.forEach(({ name, file }) => {
    webpackEntry[name] = [...options.inject, file, ...options.append];
  });
  return webpackEntry;
};

// Generate devtool
const getDevtool = (devtool: boolean | string, isEnvDevelopment: boolean) => {
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
        formatDevtool = isEnvDevelopment ? "cheap-module-eval-source-map" : "cheap-module-source-map";
      }
      break;
  }
  return formatDevtool;
};

// const getPlugins = (options: IGetWebpackConfigOpts, ctx: Dawn.Context) => {
//   return [new HtmlWebpackPlugin()];
// };

// Generate webpack config
export const getWebpackConfig = (options: IGetWebpackConfigOpts, ctx: Dawn.Context) => {
  // util symbol
  const isEnvDevelopment = options.env === "development";
  const isEnvProduction = options.env === "production";

  const config: Configuration = {
    // Learn more about the mode configuration and what optimizations take place on each value.
    // https://webpack.js.org/configuration/mode/
    mode: options.env,
    // Stop compilation early in production
    bail: isEnvProduction,
    // https://webpack.js.org/configuration/devtool/#devtool
    devtool: getDevtool(options.devtool, isEnvDevelopment),
    // web script entry(ies)
    entry: getEntry(options),
    // plugins: getPlugins(options, ctx).filter(Boolean),
  };
  return config;
};
