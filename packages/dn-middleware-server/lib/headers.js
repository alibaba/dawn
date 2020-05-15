"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.headers = headers;

function headers(headers) {
  return async (ctx, next) => {
    await next();
    ctx.response.set({ ...headers
    });
  };
}