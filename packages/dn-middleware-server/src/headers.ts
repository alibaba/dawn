import Koa from "koa";

export function headers(headers?: Record<string, string>) {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    await next();
    ctx.response.set({
      ...headers,
      // "X-Dev-Server": "dawn-koa-dev-server",
    });
  };
}
