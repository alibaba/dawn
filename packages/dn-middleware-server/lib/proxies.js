"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.proxies = proxies;

var _httpProxy = _interopRequireDefault(require("http-proxy"));

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function proxies(proxies, dnCtx) {
  if (!(proxies === null || proxies === void 0 ? void 0 : proxies.rules) || !Object.keys(proxies === null || proxies === void 0 ? void 0 : proxies.rules).length) return;
  const rules = Object.entries(proxies === null || proxies === void 0 ? void 0 : proxies.rules).map(([exp, target]) => {
    return {
      regexp: new RegExp(exp),
      target
    };
  });
  const options = {
    changeOrigin: true,
    xfwd: true,
    ...(proxies === null || proxies === void 0 ? void 0 : proxies.options),
    headers: proxies === null || proxies === void 0 ? void 0 : proxies.headers
  };

  const proxy = _httpProxy.default.createProxyServer(options);

  return async (ctx, next) => {
    const oldUrl = ctx.url;
    const proxyItem = rules.find(r => r.regexp.test(ctx.url));
    if (!proxyItem) return next();
    const urlParts = proxyItem.regexp.exec(ctx.url);
    ctx.req.url = (urlParts.length > 1 ? urlParts[1] : ctx.url) || "/";
    ctx.respond = false;

    try {
      dnCtx.console.log(`${_chalk.default.magenta(oldUrl)} => ${_chalk.default.magenta(ctx.req.url)} ${_chalk.default.gray(proxyItem.target)}`);
      return proxy.web(ctx.req, ctx.res, {
        target: proxyItem.target
      });
    } catch (e) {
      throw e;
    } finally {
      return next();
    }
  };
}