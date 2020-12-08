import * as Dawn from "@dawnjs/types";
import webpack from "webpack";
import fs from "fs";
import path from "path";
// import SpeedMeasurePlugin from "speed-measure-webpack-plugin";

import { getWebpackConfig } from "./config";
import formatAndValidateOpts from "./dev-utils/formatAndValidateOpts";
import { IGetWebpackConfigOpts, IOpts } from "./types";
import { createCompiler } from "./dev-utils/DevServerUtils";

// Migrate from v4 to v5: https://webpack.js.org/migrate/5/
const handler: Dawn.Handler<Partial<IOpts>> = opts => {
  return async (next, ctx) => {
    // register namespace for webpack5
    ctx.webpack5 = {};
    ctx.webpack = webpack;

    const options = formatAndValidateOpts(opts, ctx);

    let webpackConfig = await getWebpackConfig(options as IGetWebpackConfigOpts, ctx);

    // merge custom config.js
    opts.configFile = opts.configFile || "./webpack.config.js";
    const customConfigFile = path.resolve(ctx.cwd, opts.configFile);
    if (fs.existsSync(customConfigFile)) {
      const customConfigsGenerate = require(customConfigFile);
      if (typeof customConfigsGenerate === "function") {
        await customConfigsGenerate(webpackConfig, webpack, this);
        ctx.console.info(`[webpack5] Merged custom webpack config from '${opts.configFile}'.`);
      } else if (customConfigsGenerate) {
        webpackConfig = customConfigsGenerate;
        ctx.console.info(`[webpack5] Use custom webpack config from '${opts.configFile}'.`);
      }
    }

    if (ctx.emit) ctx.emit("webpack.config", webpackConfig, webpack, opts);

    // console.log("webpackConfig", webpackConfig);

    // It doesn't work on webpack5
    // if (options.analysis) {
    //   const smp = new SpeedMeasurePlugin();
    //   webpackConfig = smp.wrap(webpackConfig);
    // }
    const compiler = createCompiler(
      {
        config: webpackConfig as any,
        useTypeScript: ctx.useTypeScript,
        tscCompileOnError: options.tscCompileOnError,
      },
      ctx,
    );

    // mount compiler to dn ctx
    ctx.webpackCompiler = compiler;

    if (ctx.emit) ctx.emit("webpack.compiler", compiler, webpack, webpackConfig);

    if (options.watch) {
      compiler.watch(opts.watchOpts, (err, stats) => {
        // Fatal webpack errors (wrong configuration, etc)
        if (err) {
          ctx.console.error(err.stack || err);
          return;
        }
        if (ctx.emit) ctx.emit("webpack.stats", stats);
        next();
      });
    } else {
      // console.log('startrun');
      compiler.run(err => {
        // console.log('done');
        if (err) {
          ctx.console.error("[webpack5] Fatal webpack errors.\n");
          ctx.console.error(err.stack || err);
          // if (err.details) {
          //   ctx.console.error(err.details);
          // }
          return;
        }
        next();
      });
    }
  };
};

export default handler;
