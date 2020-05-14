"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.historyApiFallback = historyApiFallback;

var _connectHistoryApiFallback = _interopRequireDefault(require("connect-history-api-fallback"));

var _streamToString = _interopRequireDefault(require("stream-to-string"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const c2k = require("koa-connect");

async function historyApiFallback(ctx, next) {
  await c2k((0, _connectHistoryApiFallback.default)({
    verbose: process.env.DN_DEBUG ? true : undefined
  }))(ctx, next);

  if (ctx.response.is("html")) {
    const bodyHtml = await (0, _streamToString.default)(ctx.body);
    ctx.body = bodyHtml.replace("<head>", '<head><base href="/" />');
  }
}