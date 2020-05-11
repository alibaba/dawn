import { OutputOptions, rollup, RollupOptions, watch } from "rollup";
import { Context } from "@dawnjs/types";
import { getRollupConfig } from "./getRollupConfig";
import { IOpts, IRollupOpts } from "./types";
import { mergeCustomRollupConfig } from "./mergeCustomRollupConfig";

export const start = async (entry: string, opts: IRollupOpts, rollupConfig: RollupOptions, ctx: Context<IOpts>) => {
  const config = await mergeCustomRollupConfig(rollupConfig, { ...opts, entry }, ctx);
  if (ctx.emit) {
    ctx.emit("rollup.config", config, { ...opts, entry });
    await ctx.utils.sleep(100); // Waiting for synchronously modification for config
  }

  if (opts.watch) {
    ctx.console.info("Start watching...");
    const watcher = watch([
      {
        ...config,
        watch: {},
      },
    ]);
    watcher.on("event", event => {
      if (event.code === "ERROR" && event.error) {
        if (process.env.DN_DEBUG) {
          ctx.console.error(event.error);
        } else {
          ctx.console.error(event.error.message);
        }
      } else if (event.code === "START") {
        ctx.console.log(`[${opts.type}] Rebuild since file changed.`);
      }
    });
    process.once("SIGINT", () => {
      watcher.close();
      ctx.console.info("End watching...");
      process.exit(0);
    });
  } else {
    ctx.console.info(`Bundle to ${opts.type} for ${entry}...`);

    const { output, ...input } = config;
    const bundle = await rollup(input);
    await bundle.write(output as OutputOptions);

    ctx.console.info(`Bundle to ${opts.type} for ${entry} finished.`);
  }
};

export const build = async (entry: string, opts: IRollupOpts, ctx: Context<IOpts>) => {
  const { cwd, type, bundleOpts } = opts;
  const rollupConfigs = await getRollupConfig(
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

export const run = async (opts: IRollupOpts, ctx: Context<IOpts>) => {
  if (Array.isArray(opts.entry)) {
    const { entry: entries } = opts;
    await Promise.all(entries.map(entry => build(entry, opts, ctx)));
  } else {
    await build(opts.entry, opts, ctx);
  }
};
