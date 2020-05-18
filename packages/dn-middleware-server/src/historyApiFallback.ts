import Koa from "koa";

import connectHistoryApiFallback from "connect-history-api-fallback";
import streamToString from "stream-to-string";

const c2k = require("koa-connect");

export default async function historyApiFallback(ctx: Koa.Context, next: Koa.Next) {
  await c2k(connectHistoryApiFallback({ verbose: process.env.DN_DEBUG ? true : undefined }))(ctx, next);
  if (ctx.response.is("html")) {
    const bodyHtml = await streamToString(ctx.body);
    ctx.body = bodyHtml.replace("<head>", '<head><base href="/" />');
  }
}
