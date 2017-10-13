const os = require('os');

module.exports = function (opts) {
  let script = opts.script || []
  return async function (next) {
    this.console.info('Execute script...');
    try {
      await this.utils.exec(script.join(os.EOL));
      this.console.info('Done');
      next();
    } catch (err) {
      throw err;
    }
  };
};