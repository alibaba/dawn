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
    const options = formatAndValidateOpts(opts, ctx);

    const webpackConfig = await getWebpackConfig(options as IGetWebpackConfigOpts, ctx);

    ctx.console.log("webpackConfig", webpackConfig);

    const compiler = createCompiler({
      config: webpackConfig as any,
      useTypeScript: ctx.useTypeScript,
      tscCompileOnError: options.tscCompileOnError
    }, ctx)

    // TODO: emit event
    if (options.watch) {
      compiler.watch(opts.watchOpts, (err, stats) => {
        // Fatal webpack errors (wrong configuration, etc)
        if (err) {
          ctx.console.error(err.stack || err);
          process.exit;
          return;
        }
        if (ctx.emit) ctx.emit('webpack.stats', stats);
        ctx.console.log('[Webpack5]Start Watching:', Date.now());
      });
    } else {
      compiler.run((err, stats) => {
        if (err) {
          ctx.console.error(err.stack || err);
          // TODO: check the structure of err
          // if (err.details) {
            // ctx.console.error(err.details);
          // }
          return;
        }
      });
    }
    next();
  };
};

export default handler;
