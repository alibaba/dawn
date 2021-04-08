import { Handler } from "@dawnjs/types";
import { getOpts, validateOpts } from "./opts";
import { run } from "./rollup";
import { IOpts } from "./types";

const handler: Handler<IOpts> = options => {
  return async (next, ctx) => {
    const opts = getOpts(options, ctx);

    if (ctx.emit) {
      ctx.emit("rollup.opts", opts);
      await ctx.utils.sleep(100); // Waiting for synchronously modification for opts
    }

    await validateOpts(opts, ctx);

    await ctx.exec({
      name: "babel",
      noEmit: true,
      runtimeHelpers: opts.runtimeHelpers,
      corejs: opts.corejs,
    }); // Trigger install babel middleware synchronously and install deps

    ctx.console.info("Rollup starting...");

    const { cwd, watch, configFile, analysis, fullCustom, ...bundleOpts } = opts;

    // Bundle different type parallelly
    const tasks = [];
    if (bundleOpts.umd) {
      tasks.push(
        run(
          {
            cwd,
            type: "umd",
            entry: bundleOpts.entry,
            watch,
            bundleOpts,
            configFile,
            analysis,
          },
          ctx,
        ),
      );
    }
    if (bundleOpts.cjs) {
      tasks.push(
        run(
          {
            cwd,
            type: "cjs",
            entry: bundleOpts.entry,
            watch,
            bundleOpts,
            configFile,
            analysis,
          },
          ctx,
        ),
      );
    }
    if (bundleOpts.esm) {
      tasks.push(
        run(
          {
            cwd,
            type: "esm",
            entry: bundleOpts.entry,
            watch,
            bundleOpts,
            configFile,
            analysis,
          },
          ctx,
        ),
      );
    }
    if (bundleOpts.system) {
      tasks.push(
        run(
          {
            cwd,
            type: "system",
            entry: bundleOpts.entry,
            watch,
            bundleOpts,
            configFile,
            analysis,
          },
          ctx,
        ),
      );
    }
    if (bundleOpts.iife) {
      tasks.push(
        run(
          {
            cwd,
            type: "iife",
            entry: bundleOpts.entry,
            watch,
            bundleOpts,
            configFile,
            analysis,
          },
          ctx,
        ),
      );
    }
    await Promise.all(tasks);

    await next();
  };
};

export default handler;
