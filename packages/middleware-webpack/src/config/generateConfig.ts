import Config from "webpack-chain";
import configEntry from "./configEntry";
import configOutput from "./configOutput";
import configResolve from "./configResolve";
import configModule from "./configModule";
import configPlugins from "./configPlugins";
import configOptimization from "./configOptimization";
import type { Context, INormalizedOpts } from "../types";

// Generate webpack config
export default async (options: INormalizedOpts, ctx: Context) => {
  const config = new Config();

  config
    .mode(options.env)
    .bail(options.env === "production")
    .devtool(options.devtool)
    // @ts-ignore
    .target(options.target)
    .externals(options.externals);

  if (options.env === "production") {
    config.performance.hints(false);
  }

  if (options.profile) {
    config.profile(true);
  }

  await configEntry(config, options);
  await configOutput(config, options);
  await configResolve(config, options);
  await configModule(config, options, ctx);
  await configPlugins(config, options, ctx);
  await configOptimization(config, options);

  return config;
};
