module.exports = function (opts) {

  opts = opts || {};
  return async function (next) {
    this.opts = opts;
    if (opts.error) {
      throw new Error(opts.error);
    }
    next();
  };

};