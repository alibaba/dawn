import Config from "webpack-chain";
import { INormalizedOpts } from "../types";

export default async (config: Config, options: INormalizedOpts) => {
  options.entry.forEach(({ name, file }) => {
    config.entry(name).merge(options.inject).add(file).merge(options.append);
  });
};
