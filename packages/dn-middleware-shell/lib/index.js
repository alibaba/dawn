const os = require('os');
const path = require('path');

module.exports = function (opts) {
  let script = opts.script || []
  return async function (next) {
    this.console.info('Execute script...');
    try {
      const env = Object.assign({}, process.env);
      const bin = path.normalize(`${this.cwd}/node_modules/.bin`);
      env.PATH = `${env.PATH}:${bin}`;
      await this.utils.exec(script.join(os.EOL), { env });
      this.console.info('Done');
      next();
    } catch (err) {
      throw err;
    }
  };
};