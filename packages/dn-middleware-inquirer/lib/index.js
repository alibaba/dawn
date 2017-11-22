
module.exports = function (opts) {
  return async function (next) {
    if (opts.questions) {
      this.answers = await this.inquirer.prompt(opts.questions);
    } else {
      this.console.warn('Question configuration not found');
    }
    next();
  };
};