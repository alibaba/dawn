import fs from "fs";
import path from "path";
import webpack from "webpack";
import Config from "webpack-chain";
import { dynamicPublicPath, generateConfig } from "./config";
import { normalizeOpts } from "./opts";
import { debug } from "./utils";
import WebpackDevServer from "webpack-dev-server";
import type { Handler } from "./types";

// Migrate from v4 to v5: https://webpack.js.org/migrate/5/
const handler: Handler = (opts = {}) => {
  return async (next, ctx) => {
    // register namespace for webpack5
    ctx.webpack5 = {};
    ctx.webpack = webpack;

    if (ctx.emit) {
      ctx.emit("webpack.options", opts);
      await ctx.utils.sleep(100); // waiting for async listener if any, will be removed while EventEmitter was refactored to async mode
    }

    const options = normalizeOpts(opts, ctx);

    const config = await generateConfig(options, ctx);

    let webpackConfig = options.chainable ? config : config.toConfig();

    if (ctx.emit) {
      ctx.emit(options.chainable ? "webpack.chain-config" : "webpack.config", webpackConfig, webpack, opts);
      await ctx.utils.sleep(100); // waiting for async listener if any, will be removed while EventEmitter was refactored to async mode
    }

    // merge custom webpack.config.js
    const customConfigFile = path.resolve(options.cwd, options.configFile);
    if (fs.existsSync(customConfigFile)) {
      const customConfigsGenerate = require(customConfigFile);
      if (typeof customConfigsGenerate === "function") {
        webpackConfig = (await customConfigsGenerate(webpackConfig, webpack, ctx)) || webpackConfig;
        ctx.console.info(`[webpack5] Merged custom webpack config from '${options.configFile}'.`);
      } else if (customConfigsGenerate && !options.chainable) {
        webpackConfig = customConfigsGenerate;
        ctx.console.error(`[webpack5] Use custom webpack config from '${opts.configFile}'.`);
      }
    }

    if (!options.disableDynamicPublicPath) {
      webpackConfig = await dynamicPublicPath(webpackConfig, ctx);
    }

    if (webpackConfig instanceof Config) {
      debug("config", webpackConfig.toString());
    }
    const finalWebpackConfig = webpackConfig instanceof Config ? webpackConfig.toConfig() : webpackConfig;
    debug("webpackConfig", finalWebpackConfig);

    const compiler = webpack(finalWebpackConfig);

    if (ctx.emit) {
      ctx.emit("webpack.compiler", compiler, webpack, finalWebpackConfig);
    }

    if (options.server) {
      // @ts-ignore
      const server = new WebpackDevServer(options.serverOpts, compiler);
      await server.start();
      next();
    } else if (options.watch) {
      compiler.watch(opts.watchOpts, (err, stats) => {
        // Fatal webpack errors (wrong configuration, etc)
        if (err) {
          ctx.console.error(err.stack || err);
          return;
        }
        if (ctx.emit) {
          ctx.emit("webpack.stats", stats);
        }
      });
      next();
    } else {
      await new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
          if (err) {
            ctx.console.error("[webpack5] Fatal webpack errors.\n");
            ctx.console.error(err.stack || err);
            reject(new Error("[webpack5] Fatal webpack errors."));
            return;
          }
          if (process.env.DN_DEBUG) {
            stats.compilation.warnings.forEach(warning => {
              ctx.console.warn(warning.message);
            });
          }
          stats.compilation.errors.forEach(error => {
            ctx.console.error(error.message);
          });
          if (stats.hasErrors()) {
            reject(new Error("[webpack5] Compiled with errors."));
            return;
          }
          resolve(stats);
        });
      });
      next();
    }
  };
};

export default handler;
