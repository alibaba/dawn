
module.exports = function (opts) {
  opts.key = opts.key || opts.scope || 'answers';
  return async function (next) {
    if (opts.questions) {
      this[opts.key] = await this.inquirer.prompt(opts.questions);
    } else {
      this.console.warn('Question configuration not found');
    }
    next();
  };
};