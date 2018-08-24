const path = require('path');
const fs = require('fs');

module.exports = function (opts) {
  return async function (next) {
    this.console.info('Create typescript API docs...');
    const tsconfigFile = path.resolve(this.cwd, './tsconfig.json');
    if (!fs.existsSync(tsconfigFile)) {
      this.console.warn('Not Found: tsconfig.json');
      return next();
    }
    const typedoc = await this.utils.findCommand(__dirname, 'typedoc');
    const optionsFile = path.resolve(__dirname, './typedoc.json');
    await this.exec({
      name: 'copy', override: false, log: false,
      files: { './typedoc.json': optionsFile },
    });
    await this.utils.exec(`${typedoc} --options ./typedoc.json`);
    next();
  };
};