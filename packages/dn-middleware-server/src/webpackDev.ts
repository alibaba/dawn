// import Koa from "koa";
import * as Dawn from "@dawnjs/types";

const c2k = require("koa-connect");

export default async function webpackDev(dnCtx: Dawn.Context, opts?: any) {
  if (!dnCtx.webpackCompiler) return () => {};
  // const logLevel = process.env.DN_DEBUG ? "info" : "error";
  // return koaWebpack({
  //   config: dnCtx.webpackConfig,
  //   devMiddleware: {
  //     publicPath: dnCtx?.webpackConfig?.output?.publicPath ?? "/",
  //     logLevel,
  //   },
  //   hotClient: {
  //     // https: opts?.enabledHttps,
  //     // host: opts?.options?.host,
  //     logLevel,
  //   },
  // });
  return c2k(
    require("webpack-hot-middleware")(dnCtx.webpackCompiler, {
      log: false,
    }),
  );
}
