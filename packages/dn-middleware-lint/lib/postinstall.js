const path = require('path');
const { rmRcFiles, readAndForceWriteRc, execLint, eslintignore, editorconfig, getProjectInfo } = require('./core');
const pkg = require('../package.json');

module.exports = () => {
  const options = {
    realtime: false,
    autoFix: true,
    staged: false,
  };
  return async (next, ctx) => {
    // TODO: a little strange
    options.cwd = ctx.cwd.replace(new RegExp(`node_modules\\/${pkg.name || 'dn-middleware-lint'}$`), '');
    options.project = require(path.join(options.cwd, './package.json'));
    // eslint-disable-next-line require-atomic-updates
    options.info = await getProjectInfo(options, ctx);
    // Sync add .editorconfig and .eslintignore
    // Sync rm ununsed rc files
    // Sync add .eslintrc.yml and .prettierrc.js file
    await Promise.all([
      eslintignore(options, ctx),
      editorconfig(options, ctx),
      rmRcFiles(options, ctx),
      readAndForceWriteRc(options, ctx),
    ]);
    await next();
    // Execute lint
    await execLint(options, ctx);
  };
};
