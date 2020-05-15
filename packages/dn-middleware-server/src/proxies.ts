import Koa from "koa";
import httpProxy from "http-proxy";

export interface IProxy {
  headers?: Record<string, string>;
  rules?: Record<string, string>;
  options?: {
    /** @default true */
    changeOrigin?: boolean;
    /** @default true */
    xfwd?: boolean;
    timeout?: number;
  };
}

export function proxies(proxies?: IProxy) {
  if (!proxies?.rules || !Object.keys(proxies?.rules).length) return;
  const rules = Object.entries(proxies?.rules).map(([exp, target]) => {
    return { regexp: new RegExp(exp), target };
  });
  const options = {
    changeOrigin: true,
    xfwd: true,
    ...proxies?.options,
    headers: proxies?.headers,
  };
  const proxy = httpProxy.createProxyServer(options);
  return async (ctx: Koa.Context, next: Koa.Next) => {
    const proxyItem = rules.find(r => r.regexp.test(ctx.url));
    if (!proxyItem) return next();
    const urlParts = proxyItem.regexp.exec(ctx.url);
    ctx.req.url = (urlParts.length > 1 ? urlParts[1] : ctx.url) || "/";
    ctx.respond = false;
    try {
      return proxy.web(ctx.req, ctx.res, { target: proxyItem.target });
    } catch (e) {
      throw e;
    } finally {
      return next();
    }
  };
}
