const os = require('os');
const path = require('path');

const isWin = os.platform() == 'win32';

module.exports = function (opts) {
  let script = isWin && opts.wscript ? opt.wscript : opts.script;
  script = script || [];
  return async function (next) {
    this.console.info('Execute script...');
    try {
      const env = Object.assign({}, process.env);
      const bin = path.normalize(`${this.cwd}/node_modules/.bin`);
      env.PATH = `${bin}${isWin ? ';' : ':'}${env.PATH}`;
      const pending = this.utils.exec(script.join(os.EOL), { env });
      if (!opts.async) await pending;
      this.console.info('Done');
      next();
    } catch (err) {
      throw err;
    }
  };
};
