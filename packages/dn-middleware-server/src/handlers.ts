import * as path from "path";
import * as Dawn from "@dawnjs/types";
import Koa from "koa";
import Router from "@koa/router";
import koaBody from "koa-body";

const router = new Router();

export default function handlers(handlerConfig?: Record<string, string>, dnCtx?: Dawn.Context) {
  if (!handlerConfig) return (_: Koa.Context, next: Koa.Next) => next();
  const routers = Object.entries(handlerConfig).map(([key, hpath]) => {
    let [method, route] = key.split(" ");
    if (!route) {
      route = method;
      method = "all";
    }
    return { method: method.toLowerCase(), route, handler: require(path.join(dnCtx.cwd, hpath)) };
  });
  routers.forEach(routeItem => {
    // @ts-ignore
    router[routeItem.method](routeItem.route, koaBody(), async (ctx: Koa.Context) => {
      const responseBody = await routeItem.handler.call(null, ctx);
      if (responseBody) ctx.body = responseBody;
    });
  });
  return router.routes();
}
