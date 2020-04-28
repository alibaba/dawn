import { rollup, RollupOptions, watch } from "rollup";
import { getRollupConfig } from "./getRollupConfig";
import { IDawnContext, IRollupOpts } from "./types";
import { mergeCustomRollupConfig } from "./mergeCustomRollupConfig";

export const start = async (entry: string, opts: IRollupOpts, rollupConfig: RollupOptions, ctx: IDawnContext) => {
  const config = await mergeCustomRollupConfig(rollupConfig, { ...opts, entry }, ctx);
  if (ctx.emit) {
    ctx.emit("rollup.config", config, { ...opts, entry });
  }
  await ctx.utils.sleep(100); // waiting for config mutation by other middlewares

  ctx.console.info("Start bundle...");

  const { output, ...input } = config;
  const bundle = await rollup(input);
  await bundle.write(output);

  ctx.console.info("End bundle...");

  if (opts.watch) {
    ctx.console.info("Start watching...");
    const watcher = watch([
      {
        ...config,
        watch: {},
      },
    ]);
    watcher.on("event", event => {
      if (event.error) {
        ctx.console.error(event.error);
      } else if (event.code === "START") {
        ctx.console.log(`[${opts.type}] Rebuild since file changed`);
      }
    });
    process.once("SIGINT", () => {
      watcher.close();
      ctx.console.info("End watching...");
      process.exit(0);
    });
  }
};

export const build = async (entry: string, opts: IRollupOpts, ctx: IDawnContext) => {
  const { cwd, type, bundleOpts } = opts;
  const rollupConfigs = getRollupConfig(
    {
      cwd,
      entry,
      type,
      bundleOpts,
      analysis: opts.analysis,
    },
    ctx,
  );

  await Promise.all(rollupConfigs.map(rollupConfig => start(entry, opts, rollupConfig, ctx)));
};

export const run = async (opts: IRollupOpts, ctx: IDawnContext) => {
  if (Array.isArray(opts.entry)) {
    const { entry: entries } = opts;
    await Promise.all(entries.map(entry => build(entry, opts, ctx)));
  } else {
    await build(opts.entry, opts, ctx);
  }
};
