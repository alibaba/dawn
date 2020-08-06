import * as Dawn from "@dawnjs/types";
import webpack from "webpack";
// import resolve from "resolve";

import { getWebpackConfig } from "./config";
import { formatAndValidateOpts } from "./utils";
import { IGetWebpackConfigOpts, IOpts } from "./types";

// Migrate from v4 to v5: https://webpack.js.org/migrate/5/
const handler: Dawn.Handler<Partial<IOpts>> = opts => {
  return async (next, ctx) => {
    // register namespace for webpack5
    ctx.webpack5 = {};
    ctx.webpack = webpack;
    const options = formatAndValidateOpts(opts, ctx);
    const webpackConfig = await getWebpackConfig(options as IGetWebpackConfigOpts, ctx);

    console.log(options);
    console.log(webpackConfig);
    await next();
  };
};

export default handler;
