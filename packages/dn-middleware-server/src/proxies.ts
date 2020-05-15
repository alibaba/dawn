import Koa from "koa";
import * as Dawn from "@dawnjs/types";
import httpProxy from "http-proxy";
import chalk from "chalk";

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

export function proxies(proxies?: IProxy, dnCtx?: Dawn.Context) {
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
    const oldUrl = ctx.url;
    const proxyItem = rules.find(r => r.regexp.test(ctx.url));
    if (!proxyItem) return next();
    const urlParts = proxyItem.regexp.exec(ctx.url);
    ctx.req.url = (urlParts.length > 1 ? urlParts[1] : ctx.url) || "/";
    ctx.respond = false;
    try {
      dnCtx.console.log(`${chalk.magenta(oldUrl)} => ${chalk.magenta(ctx.req.url)} ${chalk.gray(proxyItem.target)}`);
      return proxy.web(ctx.req, ctx.res, { target: proxyItem.target });
    } catch (e) {
      throw e;
    } finally {
      return next();
    }
  };
}
