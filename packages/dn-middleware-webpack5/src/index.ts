import * as Dawn from "@dawnjs/types";
import webpack from "webpack";

import { getWebpackConfig } from "./config";
import formatAndValidateOpts from "./dev-utils/formatAndValidateOpts";
import { IGetWebpackConfigOpts, IOpts } from "./types";
import { createCompiler } from "./dev-utils/DevServerUtils";

process.env.NODE_OPTIONS = "--trace-deprecation";

// Migrate from v4 to v5: https://webpack.js.org/migrate/5/
const handler: Dawn.Handler<Partial<IOpts>> = opts => {
  return async (next, ctx) => {
    // register namespace for webpack5
    ctx.webpack5 = {};
    ctx.webpack = webpack;
    console.log("opts", opts);
    const options = formatAndValidateOpts(opts, ctx);

    const webpackConfig = await getWebpackConfig(options as IGetWebpackConfigOpts, ctx);

    console.log("options", options);
    console.log("webpackConfig", webpackConfig);

    const compiler = createCompiler({
      config: webpackConfig as any,
      useTypeScript: ctx.useTypeScript,
      tscCompileOnError: options.tscCompileOnError
    }, ctx)

    // TODO: emit event
    compiler.run((err, stats) => {
      if (err) {
        console.error(err.stack || err);
        // TODO: check the structure of err
        // if (err.details) {
          // console.error(err.details);
        // }
        return;
      }
    
      const info = stats.toJson();
    
      if (stats.hasErrors()) {
        console.error(info.errors);
      }
    
      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }
    });
    next();
  };
};

export default handler;
