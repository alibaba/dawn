import path from "path";
import type Config from "webpack-chain";
import type { INormalizedOpts } from "../types";

export default async (config: Config, options: INormalizedOpts) => {
  config.output
    .filename(path.join(options.folders.script, "[name].js"))
    .chunkFilename(path.join(options.folders.script, "[name].[chunkhash:8].chunk.js"))
    .set("assetModuleFilename", path.join(options.folders.media, "[name].[contenthash:8][ext]")) // TODO: replace after webpack-chain support webpack5
    .publicPath(options.publicPath ?? (options.env === "development" ? "/" : undefined))
    .merge(options.output)
    .path(path.resolve(options.cwd, options.output.path));
};
