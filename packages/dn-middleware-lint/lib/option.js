// deprecated
const validateOpts = (opts, ctx) => {
  if (opts.env || opts.global) {
    ctx.console.warn('`opts.env` & `opts.gloabl` config is deprecated. Please set in ".eslintrc.yml" file.');
  }
  if (opts.ignore) {
    ctx.console.warn('`opts.ignore` config is deprecated. Please set in ".eslintignore" file.');
  }
  if (opts.source || opts.ext) {
    ctx.console.warn('`opts.source` & `opts.ext` config is deprecated.');
  }
};

module.exports = validateOpts;
