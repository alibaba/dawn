// deprecated
const validateOpts = (opts, ctx) => {
  if (opts.env || opts.global) {
    ctx.console.warn('`env` & `gloabl` config is deprecated. Please set in ".eslintrc.yml" file.');
  }
  if (opts.ignore) {
    ctx.console.warn('`ignore` config is deprecated. Please set in ".eslintignore" file.');
  }
  if (opts.source || opts.ext) {
    ctx.console.warn('`source` & `ext` config is deprecated.');
  }
  if (opts.staged && opts.realtime) {
    throw new Error('`staged` & `realtime` can not work at the same time.');
  }
};

module.exports = validateOpts;
