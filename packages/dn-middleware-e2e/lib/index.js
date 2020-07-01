const path = require('path');
const { isArray } = require('util');

module.exports = (opts) => {

  opts = Object.assign({
    files: './test/**/*.e2e.{ts,js}',
    timeout: 30000,
    puppeteer: {
      download: 'https://npm.taobao.org/mirrors'
    },
  }, opts);

  const checkInstall = async (ctx, pkgs, flag) => {
    if (!pkgs) return;
    pkgs = isArray(pkgs) ? pkgs : [pkgs]
    if (!flag) flag = { 'save-dev': true };
    for (let pkg of pkgs) {
      try {
        require.resolve(`${pkg}/package.json`);
      } catch (err) {
        await ctx.mod.install(pkg, { flag });
      }
    }
  }

  return async (next, ctx) => {

    ctx.console.info('检测及安装 E2E 依赖...');
    await checkInstall(ctx, ['@types/mocha', 'tslib']);
    if (opts.puppeteer) {
      await ctx.mod.exec(`config set puppeteer_download_host=${opts.puppeteer.download}`);
      await checkInstall(ctx, '@types/puppeteer');
      await checkInstall(ctx, 'puppeteer', { 'no-save': true });
    }
    ctx.console.info('完成');

    const mocha = ctx.utils.findCommand(__dirname, 'mocha');
    const setup = path.resolve(__dirname, './setup.js');

    ctx.console.info('开始执行 E2E 测试...');
    await ctx.utils.exec(`
      ${mocha} -r ${setup} -t ${opts.timeout} --exit --parallel -u bdd ${opts.files} 
    `);
    ctx.console.info('完成');

    next();
  };

};