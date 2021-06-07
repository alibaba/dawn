import path from "path";
import os from "os";
import assert from "assert";
import Config from "webpack-chain";
import { debug } from "../utils";
import type { Configuration, Entry } from "webpack";
import type { Context } from "../types";

const getInjectFile = async (filename: string, ctx: Context) => {
  const scriptSrcPrefix = path.dirname(filename);
  debug("scriptSrcPrefix", scriptSrcPrefix);
  const template = await ctx.utils.readFile(path.resolve(__dirname, "../../template/dynamicPublicPath.tpl"));
  const content = ctx.utils.stp(template.toString(), { scriptSrcPrefix });
  const injectFile = path.join(os.tmpdir(), `${Date.now()}_${Math.floor(Math.random() * 100000)}.js`);
  await ctx.utils.writeFile(injectFile, content);
  debug("injectFile", injectFile);
  return injectFile;
};

const processWithConfig = async (config: Config, ctx: Context) => {
  if (typeof config.output.get("publicPath") !== "undefined" || typeof config.output.get("filename") !== "string") {
    return config;
  }
  const injectFile = await getInjectFile(config.output.get("filename"), ctx);
  config.entryPoints.values().forEach(entry => {
    entry.prepend(injectFile);
  });
  return config;
};

const processWithRaw = async (config: Configuration, ctx: Context) => {
  if (typeof config.output.publicPath !== "undefined" || typeof config.output.filename !== "string") {
    return config;
  }
  const injectFile = await getInjectFile(config.output.filename, ctx);

  const patchEntry = async (entry: Entry) => {
    if (typeof entry === "string") {
      return [injectFile, entry];
    } else if (Array.isArray(entry)) {
      return [injectFile, ...entry];
    } else if (typeof entry === "object") {
      await Promise.all(
        Object.keys(entry).map(async entryName => {
          const curEntry = entry[entryName];
          if (typeof curEntry === "string") {
            entry[entryName] = [injectFile, curEntry];
          } else if (Array.isArray(curEntry)) {
            entry[entryName] = [injectFile, ...curEntry];
          } else {
            // For entry descriptor, see https://webpack.js.org/configuration/entry-context/#entry-descriptor
            let entryInjectFile = injectFile;
            if (curEntry.filename) {
              assert(
                typeof curEntry.filename === "string",
                "[webpack5] `filename` must be string in dynamic publicPath mode",
              );
              entryInjectFile = await getInjectFile(curEntry.filename, ctx);
            }
            if (typeof curEntry.import === "string") {
              curEntry.import = [entryInjectFile, curEntry.import];
            } else if (Array.isArray(curEntry.import)) {
              curEntry.import = [entryInjectFile, ...curEntry.import];
            }
          }
        }),
      );
      return entry;
    } else if (typeof entry === "function") {
      // For dynamic entry, see https://webpack.js.org/configuration/entry-context/#dynamic-entry
      const origEntryFactory = entry;
      return async () => {
        const dynamicEntry = await origEntryFactory();
        return await patchEntry(dynamicEntry);
      };
    }
  };

  // @ts-ignore
  config.entry = await patchEntry(config.entry);

  return config;
};

export default async (config: Configuration | Config, ctx: Context) => {
  if (config instanceof Config) {
    return processWithConfig(config, ctx);
  } else {
    return processWithRaw(config, ctx);
  }
};
