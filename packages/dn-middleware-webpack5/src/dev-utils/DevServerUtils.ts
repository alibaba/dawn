import webpack from "webpack";
import chalk from "react-dev-utils/chalk";
import forkTsCheckerWebpackPlugin from "react-dev-utils/ForkTsCheckerWebpackPlugin";
import typescriptFormatter from "react-dev-utils/typescriptFormatter";
import os from "os";
import { formatSize, formatWebpackMessages, makeRow } from "./utils";
import * as Dawn from "@dawnjs/types";

import { CompilerCreaterOpts } from "../types";

export function createCompiler({ config, useTypeScript, tscCompileOnError }: CompilerCreaterOpts, ctx: Dawn.Context) {
  // "Compiler" is a low-level interface to webpack.
  // It lets us listen to some events and provide our own custom messages.
  const compiler = webpack(config);

  // "invalid" event fires when you have changed a file, and webpack is
  // recompiling a bundle. WebpackDevServer takes care to pause serving the
  // bundle, so if you refresh, it'll wait instead of serving the old one.
  // "invalid" is short for "bundle invalidated", it doesn't imply any errors.
  // compiler.hooks.invalid.tap("invalid", () => {
  //   ctx.console.info("[webpack5] Compiling...");
  // });

  // let isFirstCompile = true;
  let tsMessagesPromise: Promise<any>;
  let tsMessagesResolver: Function;

  if (useTypeScript) {
    compiler.hooks.beforeCompile.tap("beforeCompile", () => {
      tsMessagesPromise = new Promise(resolve => {
        tsMessagesResolver = (msgs: any) => resolve(msgs);
      });
    });

    forkTsCheckerWebpackPlugin
      .getCompilerHooks(compiler)
      .receive.tap("afterTypeScriptCheck", (diagnostics: any[], lints: any[]) => {
        const allMsgs = [...diagnostics, ...lints];
        const format = (message: any) => `${message.file}\n${typescriptFormatter(message, true)}`;

        tsMessagesResolver({
          errors: allMsgs.filter(msg => msg.severity === "error").map(format),
          warnings: allMsgs.filter(msg => msg.severity === "warning").map(format),
        });
      });
  }

  // "done" event fires when webpack has finished recompiling the bundle.
  // Whether or not you have warnings or errors, you will get this event.
  compiler.hooks.done.tap("done", async stats => {
    // We have switched off the default webpack output in WebpackDevServer
    // options so we are going to "massage" the warnings and errors and present
    // them in a readable focused way.
    // We only construct the warnings and errors for speed:
    // https://github.com/facebook/create-react-app/issues/4492#issuecomment-421959548
    const statsData = stats.toJson({
      all: false,
      warnings: true,
      errors: true,
      assets: true,
      timings: true,
    });

    // print assets in production mode
    if (statsData.assets && ctx.isEnvProduction) {
      let assetsLog = `\n\n${makeRow(chalk.cyan.bold(`File`), chalk.cyan.bold(`Size`))}\n\n`;
      assetsLog += statsData.assets
        ?.map((asset: any) => {
          const { name, size } = asset;
          return makeRow(/js$/.test(name) ? chalk.green(name) : chalk.yellow(name), formatSize(size));
        })
        .join(os.EOL);
      console.log(assetsLog, os.EOL);
    }

    if (useTypeScript && statsData.errors.length === 0) {
      const delayedMsg = setTimeout(() => {
        ctx.console.warn("[webpack5] Files successfully emitted, waiting for typecheck results...");
      }, 100);

      const messages = await tsMessagesPromise;
      clearTimeout(delayedMsg);
      if (tscCompileOnError) {
        statsData.warnings.push(...messages.errors);
      } else {
        statsData.errors.push(...messages.errors);
      }
      statsData.warnings.push(...messages.warnings);

      // Push errors and warnings into compilation result
      // to show them after page refresh triggered by user.
      if (tscCompileOnError) {
        stats.compilation.warnings.push(...messages.errors);
      } else {
        stats.compilation.errors.push(...messages.errors);
      }
      stats.compilation.warnings.push(...messages.warnings);
    }

    const messages = formatWebpackMessages(statsData);

    // webpackBar shows the itme
    // const isSuccessful = !messages.errors.length && !messages.warnings.length;
    // if (isSuccessful) {
      // console.log("\n");
      // ctx.console.info(`[webpack5] Compiled successfully in ${statsData.time}ms`);
    // }

    // If errors exist, only show errors.
    if (messages.errors.length) {
      // Only keep the first error. Others are often indicative of the same problem, but confuse the reader with noise.
      if (messages.errors.length > 1) {
        messages.errors.length = 1;
      }
      console.log("\n\n");
      ctx.console.error("[webpack5] Failed to compile." + os.EOL);
      ctx.console.error(messages.errors.join(os.EOL + os.EOL));
      return;
    } else if (messages.warnings.length) {
      // Show warnings if no errors were found.
      console.log("\n\n");
      ctx.console.warn("[webpack5] Compiled with warnings." + os.EOL);
      ctx.console.log(messages.warnings.join(os.EOL + os.EOL));
    }
  });
  return compiler;
}
