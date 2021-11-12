import type { Context, IOpts } from "./types";

export const validateOpts = (opts: Partial<IOpts>, ctx: Context) => {
  if (opts.env || opts.global) {
    ctx.console.warn('`env` & `gloabl` config is deprecated. Please set in ".eslintrc.yml" file.');
  }
  if (opts.ignore) {
    ctx.console.warn('`ignore` config is deprecated. Please set in ".eslintignore" file.');
  }
  if (opts.source || opts.ext) {
    ctx.console.warn("`source` & `ext` config is deprecated.");
  }
  if (typeof opts.realtime !== "undefined") {
    ctx.console.warn("`realtime` mode is deprecated. Please use features in webpack/rollup/vite middlewares instead");
  }
  if (opts.staged && opts.realtime) {
    throw new Error("`staged` & `realtime` can not work at the same time.");
  }
};
