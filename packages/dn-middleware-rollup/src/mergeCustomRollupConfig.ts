import { resolve } from "path";
import { existsSync } from "fs";
import { RollupOptions } from "rollup";
import { isFunction, isNil } from "lodash";
import { Context } from "@dawnjs/types";
import { IOpts, IRollupOpts } from "./types";

export const mergeCustomRollupConfig = async (
  rollupConfig: RollupOptions,
  opts: Omit<IRollupOpts, "entry"> & { entry: string },
  ctx: Context<IOpts>,
): Promise<RollupOptions> => {
  let config = rollupConfig;
  const { cwd, configFile = "./rollup.config.js" } = opts;
  const customConfigFile = resolve(cwd, configFile);
  if (existsSync(customConfigFile)) {
    let customConfigGenerate = await import(customConfigFile);
    customConfigGenerate = customConfigGenerate.default || customConfigGenerate;
    if (isFunction(customConfigGenerate)) {
      config = (await customConfigGenerate(config, opts, ctx)) || config;
      ctx.console.info("Custom rollup config merged.");
    } else if (!isNil(customConfigGenerate)) {
      config = customConfigGenerate;
      ctx.console.warn("Custom rollup config replaced.");
    }
  }

  return config;
};
