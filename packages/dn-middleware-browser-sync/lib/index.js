const browserSync = require('browser-sync');
const connectBrowserSync = require('connect-browser-sync');
const c2k = require('koa-connect');

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
      logSnippet: true,
      open: false,
      files: opts.files,
      // files: [
      //   {
      //     match: opts.files,
      //     fn: (event, file) => {
      //       this.console.log('Reloading browsers...');
      //       this.console.log(event, file);
      //     }
      //   }
      // ],
      logLevel: 'silent',
      logFileChanges: true,
      reloadThrottle: 1000,
      callbacks: {
        ready: (err) => {
          if (err) throw err;
          this.console.info(`Browser-sync start watching ${opts.files.join(',')} at port ${opts.port}`);
        }
      },
      ui: {
        port: opts.port,
        weinre: {
          port: opts.port + 1
        }
      }
    }, next);

    this.server.use(c2k(connectBrowserSync(bsInstance)));

    // this.server.use('^/(?!(-rc-|browser-sync))@browser-sync',
    //   connectBrowserSync(bsInstance));

  };

};