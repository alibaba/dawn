import { Handler } from "@dawnjs/types";
import { getOpts, validateOpts } from "./opts";
import { run } from "./rollup";
import { BundleType, IOpts } from "./types";
import async from "async";

const handler: Handler<IOpts> = options => {
  return async (next, ctx) => {
    const opts = getOpts(options, ctx);

    if (ctx.emit) {
      ctx.emit("rollup.opts", opts);
      await ctx.utils.sleep(100); // Waiting for synchronously modification for opts
    }

    await validateOpts(opts, ctx);

    ctx.console.info("Rollup starting...");

    const { cwd, watch, configFile, analysis, fullCustom, parallel, ...bundleOpts } = opts;

    const tasks = ["esm", "cjs", "umd", "system", "iife"]
      .filter(type => !!bundleOpts[type])
      .map((type: BundleType) => {
        return cb => {
          run(
            {
              cwd,
              type,
              entry: bundleOpts.entry,
              watch,
              bundleOpts,
              configFile,
              analysis,
              parallel,
            },
            ctx,
          ).then(() => {
            cb();
          });
        };
      });
    if (parallel) {
      await async.parallel(tasks);
    } else {
      await async.series(tasks);
    }

    await next();
  };
};

export default handler;
