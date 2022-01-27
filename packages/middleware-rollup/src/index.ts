import async from "async";
import merge from "deepmerge";
import { getOpts, validateOpts } from "./opts";
import { build, buildDts } from "./rollup";
import type { Handler } from "@dawnjs/types";
import type { BundleType, IBundleOptions, IOpts } from "./types";

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

    const getTasks = (entry: string, mergedBundleOpts: IBundleOptions) => {
      return ["esm", "cjs", "umd", "system", "iife"]
        .filter(type => {
          return !!mergedBundleOpts[type];
        })
        .map((type: BundleType) => {
          return cb => {
            build(
              {
                cwd,
                type,
                entry,
                watch,
                bundleOpts: mergedBundleOpts,
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
    };

    const totalTasks = [];
    let entries = bundleOpts.entry;
    if (typeof entries === "string") {
      entries = { [entries]: {} };
    } else if (Array.isArray(entries)) {
      entries = entries.reduce((acc, entry) => {
        return { ...acc, [entry]: {} };
      }, {});
    }
    Object.keys(entries).forEach(entry => {
      // 合并按入口的个性化配置
      const customBundleOpts = entries[entry] as Omit<IBundleOptions, "entry">;
      const mergedBundleOpts = merge(bundleOpts, customBundleOpts) as IBundleOptions;
      // 生成单入口单格式构建任务
      totalTasks.push(...getTasks(entry, mergedBundleOpts));
      if (!opts.watch && mergedBundleOpts.generateDts) {
        totalTasks.push(cb => {
          buildDts(
            {
              cwd,
              type: "dts",
              entry,
              watch,
              bundleOpts: mergedBundleOpts,
              analysis,
              parallel,
            },
            ctx,
          ).then(() => {
            cb();
          });
        });
      }
    });

    if (parallel) {
      await async.parallel(totalTasks);
    } else {
      await async.series(totalTasks);
    }

    await next();
  };
};

export default handler;
