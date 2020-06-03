// import Koa from "koa";
import * as Dawn from "@dawnjs/types";
import koaWebpack from "koa-webpack";

export default async function webpackDev(dnCtx: Dawn.Context, opts?: any) {
  if (dnCtx.webpackVersion !== 4 || !dnCtx.webpackConfig) return () => {};
  const logLevel = process.env.DN_DEBUG ? "info" : "error";
  return koaWebpack({
    config: dnCtx.webpackConfig,
    devMiddleware: {
      publicPath: dnCtx?.webpackConfig?.output?.publicPath ?? "/",
      logLevel,
    },
    hotClient: {
      // https: opts?.enabledHttps,
      // host: opts?.options?.host,
      logLevel,
    },
  });
}
