import { getBundleOpts, validateBundleOpts } from "./getBundleOpts";
import { run } from "./rollup";
import { IDawnContext, IOpts } from "./types";

export default (userOpts: IOpts) => {
  return async (next: Function, ctx: IDawnContext) => {
    const opts = {
      ...userOpts,
      cwd: userOpts.cwd || ctx.cwd,
    };
    ctx.console.info("Rollup starting...");

    if (ctx.emit) {
      ctx.emit("rollup.opts", opts);
    }

    await ctx.utils.sleep(100);

    const bundleOpts = opts.fullCustom ? opts.bundleOpts : getBundleOpts(opts);

    if (ctx.emit) {
      ctx.emit("rollup.bundleOpts", bundleOpts, opts);
    }

    await ctx.utils.sleep(100);

    validateBundleOpts(bundleOpts, opts, ctx);

    if (bundleOpts.umd) {
      ctx.console.info("Building umd...");
      await run(
        {
          cwd: opts.cwd,
          type: "umd",
          entry: bundleOpts.entry,
          watch: opts.watch,
          bundleOpts,
          configFile: opts.configFile,
          analysis: opts.analysis,
        },
        ctx,
      );
    }

    if (bundleOpts.cjs) {
      ctx.console.info("Building cjs...");
      await run(
        {
          cwd: opts.cwd,
          type: "cjs",
          entry: bundleOpts.entry,
          watch: opts.watch,
          bundleOpts,
          configFile: opts.configFile,
          analysis: opts.analysis,
        },
        ctx,
      );
    }

    if (bundleOpts.esm) {
      ctx.console.info("Building esm...");
      await run(
        {
          cwd: opts.cwd,
          type: "esm",
          entry: bundleOpts.entry,
          watch: opts.watch,
          bundleOpts,
          configFile: opts.configFile,
          analysis: opts.analysis,
        },
        ctx,
      );
    }

    await next();
  };
};
