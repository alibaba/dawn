import { OutputOptions, rollup, RollupError, RollupOptions, RollupWarning, watch } from "rollup";
import { getRollupConfig } from "./getRollupConfig";
import { IDawnContext, IRollupOpts } from "./types";
import { mergeCustomRollupConfig } from "./mergeCustomRollupConfig";
import async from "async";

const logError = (error: RollupError, ctx: IDawnContext) => {
  if (error.loc) {
    ctx.console.error(`${error.loc.file}(${error.loc.line},${error.loc.column}): ${error.message}`);
  } else {
    ctx.console.error(error.message);
  }
  if (error.frame) {
    ctx.console.error(error.frame);
  }
};

const logWarn = (warning: RollupWarning, ctx: IDawnContext) => {
  if (!process.env.DN_DEBUG) {
    if (warning.code === "CIRCULAR_DEPENDENCY") {
      return;
    }
    if (warning.code === "THIS_IS_UNDEFINED") {
      return;
    }
  }
  if (warning.loc) {
    ctx.console.warn(`${warning.loc.file}(${warning.loc.line}:${warning.loc.column}): ${warning.message}`);
  } else {
    ctx.console.warn(warning.message);
  }
  if (warning.frame) {
    ctx.console.warn(warning.frame);
  }
};

export const start = async (entry: string, opts: IRollupOpts, config: RollupOptions, ctx: IDawnContext) => {
  if (ctx.emit) {
    ctx.emit("rollup.config", config, { ...opts, entry });
    await ctx.utils.sleep(100); // Waiting for synchronously modification for config
  }

  if (opts.watch) {
    ctx.console.info("Start watching...");
    const watcher = watch([
      {
        onwarn(warning) {
          logWarn(warning, ctx);
        },
        ...config,
        watch: {
          exclude: ["node_modules/**"],
        },
      },
    ]);
    watcher.on("event", event => {
      if (event.code === "ERROR" && event.error) {
        logError(event.error, ctx);
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
    try {
      const bundle = await rollup({
        onwarn(warning) {
          logWarn(warning, ctx);
        },
        ...input,
      });
      await bundle.write(output as OutputOptions);
    } catch (e) {
      logError(e, ctx);
      throw new Error("[rollup] bundle failed.");
    }

    ctx.console.info(`Bundle to ${opts.type} for ${entry} finished.`);
  }
};

export const buildDts = async (opts: IRollupOpts, ctx: IDawnContext) => {
  const { cwd, entry, type, bundleOpts, analysis, parallel } = opts;
  const rollupConfigs = await getRollupConfig(
    {
      cwd,
      entry,
      type,
      bundleOpts,
      analysis,
      parallel,
    },
    ctx,
  );
  const config = rollupConfigs[0] as RollupOptions;
  if (opts.watch) {
    ctx.console.info("Start watching...");
    const watcher = watch([
      {
        onwarn(warning) {
          logWarn(warning, ctx);
        },
        ...config,
        watch: {
          exclude: ["node_modules/**"],
        },
      },
    ]);
    watcher.on("event", event => {
      if (event.code === "ERROR" && event.error) {
        logError(event.error, ctx);
      } else if (event.code === "START") {
        ctx.console.log(`Rebuild dts for ${entry} since file changed.`);
      }
    });
    process.once("SIGINT", () => {
      watcher.close();
      ctx.console.info("End watching...");
      process.exit(0);
    });
  } else {
    ctx.console.info(`Bundle dts for ${entry}...`);

    const { output, ...input } = config;
    try {
      const bundle = await rollup({
        onwarn(warning) {
          logWarn(warning, ctx);
        },
        ...input,
      });
      await bundle.write(output as OutputOptions);
    } catch (e) {
      logError(e, ctx);
      throw new Error(`[rollup] bundle dts for ${entry} failed.`);
    }

    ctx.console.info(`Bundle dts for ${entry} finished.`);
  }
};

export const build = async (opts: IRollupOpts, ctx: IDawnContext) => {
  const { cwd, entry, type, bundleOpts, analysis, parallel } = opts;
  const rollupConfigs = await getRollupConfig(
    {
      cwd,
      entry,
      type,
      bundleOpts,
      analysis,
      parallel,
    },
    ctx,
  );

  const subTasks = rollupConfigs
    .filter(rollupConfig => !!rollupConfig)
    .map((rollupConfig: RollupOptions) => {
      return cb => {
        mergeCustomRollupConfig(rollupConfig, { ...opts, entry }, ctx)
          .then(config => {
            return start(entry, opts, config, ctx);
          })
          .then(() => {
            cb();
          });
      };
    });

  if (parallel) {
    await async.parallel(subTasks);
  } else {
    await async.series(subTasks);
  }
};
