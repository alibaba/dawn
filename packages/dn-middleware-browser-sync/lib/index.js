const browserSync = require('browser-sync');
const connectBrowserSync = require('connect-browser-sync');
const c2k = require('koa-connect');
const streamToString = require('stream-to-string');

/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {

  opts = Object.assign({}, opts);
  opts.files = opts.files || ['./build/**/*.*'];
  opts.port = opts.port || 5001;

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {

    if (!this.server) {
      throw new Error('browser-sync must be after server');
    }

    const bsInstance = browserSync.create().init({
      logSnippet: false,
      open: false,
      files: opts.files,
      ui: {
        port: opts.port,
        weinre: {
          port: opts.port + 1
        }
      }
    }, next);

    // this.server.use(async (ctx, n) => {
    //   await n();
    //   if (ctx.response.is('html')) {
    //     const bodyHtml = await streamToString(ctx.body);
    //     console.log(bodyHtml);
    //     /* eslint-disable max-len */
    //     ctx.body = bodyHtml.replace('</body>', '<script async src=\'//localhost:3000/browser-sync/browser-sync-client.js?v=2.26.7\'></script></body>');
    //     console.log(ctx.body);
    //   }
    // });

    this.server.use(c2k(connectBrowserSync(bsInstance)));

    // this.server.use('^/(?!(-rc-|browser-sync))@browser-sync',
    //   connectBrowserSync(bsInstance));

  };

};