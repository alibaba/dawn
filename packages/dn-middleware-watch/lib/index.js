const chokidar = require('chokidar');

module.exports = function (opts) {

  opts = Object.assign({}, opts);
  if (opts.ignoreInitial !== false) opts.ignoreInitial = true;
  opts.match = opts.match || './src/**/*.*';
  opts.event = opts.event || 'all';

  return async function (next) {

    chokidar.watch(opts.match, {
      ignoreInitial: opts.ignoreInitial
    }).on(opts.event, async (event, path) => {
      this.changeInfo = { event, path };
      if (opts.script) {
        this.exec({ name: 'shell', script: opts.script });
      }
      if (opts.onChange) {
        opts.onChange(this.changeInfo);
      }
    });

    this.console.info('Watching...');

    next();
  };
};
