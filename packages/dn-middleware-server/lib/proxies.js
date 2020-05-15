"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.proxies = proxies;

var _httpProxy = _interopRequireDefault(require("http-proxy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function proxies(proxies) {
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
    const proxyItem = rules.find(r => r.regexp.test(ctx.url));
    if (!proxyItem) return next();
    const urlParts = proxyItem.regexp.exec(ctx.url);
    ctx.req.url = (urlParts.length > 1 ? urlParts[1] : ctx.url) || "/";
    ctx.respond = false;

    try {
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