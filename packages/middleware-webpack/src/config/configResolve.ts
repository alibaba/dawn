import path from "path";
import fs from "fs";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import type Config from "webpack-chain";
import type { INormalizedOpts } from "../types";

const mainFields = ["module", "browser", "main"];

const extensions = [
  ".web.tsx",
  ".tsx",
  ".web.ts",
  ".ts",
  ".web.jsx",
  ".jsx",
  ".web.js",
  ".js",
  ".mjs",
  ".wasm",
  ".json",
];

export default async (config: Config, options: INormalizedOpts) => {
  config.resolve
    // enable symlinks for tnpm or npm link
    .symlinks(true)
    .modules.add("node_modules")
    .add(path.resolve(options.cwd, "node_modules"))
    .add(path.resolve(__dirname, "../../node_modules"))
    .add(options.cwd)
    .end() // end of modules
    // because issue of our internal component template using rollup, we need adjust default mainFields resolve order
    .mainFields.merge(mainFields)
    .end() // end of mainFields
    .extensions.merge(extensions)
    .end() // end of extensions
    .alias.merge({ ...options.alias })
    .end() // end of alias
    .when(fs.existsSync(path.resolve(options.cwd, "tsconfig.json")), resolveConfig => {
      resolveConfig
        .plugin("tsconfig-paths")
        .use(TsconfigPathsPlugin, [{ extensions, mainFields, ...options.tsconfigPathsPlugin }]);
    });
};
