"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handlers = handlers;

var path = _interopRequireWildcard(require("path"));

var _router = _interopRequireDefault(require("@koa/router"));

var _koaBody = _interopRequireDefault(require("koa-body"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const router = new _router.default();

function handlers(handlerConfig, dnCtx) {
  if (!handlerConfig) return;
  const routers = Object.entries(handlerConfig).map(([key, hpath]) => {
    let [method, route] = key.split(" ");

    if (!route) {
      route = method;
      method = "all";
    }

    return {
      method: method.toLowerCase(),
      route,
      handler: require(path.join(dnCtx.cwd, hpath))
    };
  });
  routers.forEach(routeItem => {
    // @ts-ignore
    router[routeItem.method](routeItem.route, (0, _koaBody.default)(), async ctx => {
      const responseBody = await routeItem.handler.call(null, ctx);
      if (responseBody) ctx.body = responseBody;
    });
  });
  return router.routes();
}