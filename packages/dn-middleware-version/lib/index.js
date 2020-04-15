const { existsSync } = require('fs');
const { normalize } = require('path');

module.exports = () => {

  async function readJson(ctx, file) {
    if (!existsSync(file)) return {};
    const text = await ctx.utils.readFile(file);
    return JSON.parse(text);
  }

  async function readPackage(ctx) {
    const pkgFile = normalize(`${ctx.cwd}/package.json`);
    return readJson(ctx, pkgFile);
  }

  async function changeVersion(ctx) {
    const pkg = await readPackage(ctx);
    const version = process.env.__version__ || (await ctx.inquirer.prompt([{
      name: 'version', type: 'list',
      message: '请确认将要发布的版本',
      choices: [
        { name: `使用当前版本(${pkg.version})`, value: pkg.version },
        { name: '新的修订版本(patch)', value: 'patch' },
        { name: '新的次要版本(minor)', value: 'minor' },
        { name: '新的主要版本(major)', value: 'major' },
      ]
    }])).version;
    await ctx.utils.exec([`npm version ${version}`,
      '--allow-same-version',
      '--no-git-tag-version',
      '--no-commit-hooks'].join(' '));
    return (await readPackage(ctx)).version;
  }

  return async (next, ctx) => {
    ctx.version = await changeVersion(ctx);
    ctx.console.warn('版本已更新为:', ctx.version);
    next();
  };

};