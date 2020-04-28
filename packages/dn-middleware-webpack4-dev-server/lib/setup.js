const path = require('path');

module.exports = function (extendOpts) {
  const self = this;
  return Object.assign({
    disableHostCheck: true,
    // Enable gzip compression of generated files.
    compress: true,
    clientLogLevel: 'none',
    // Silence WebpackDevServer's own logs since they're generally not useful.
    contentBase: path.resolve(this.cwd, 'build'),
    // By default files from `contentBase` will not trigger a page reload.
    watchContentBase: true,
    // Enable hot reloading server.
    // Note that only changes to CSS are currently hot reloaded.
    // JS changes will refresh the browser.
    hot: true,
    noInfo: true,
    stats: 'errors-only',
    open: true,
    // inline: true,
    // It is important to tell WebpackDevServer to use the same "root" path
    // as we specified in the config. In development, we always serve from /.
    publicPath: '/',
    // WebpackDevServer is noisy by default so we emit custom message instead
    // by listening to the compiler events with `compiler.hooks[...].tap` calls above.
    quiet: false,
    watchOptions: { ignored: /node_modules/ },
    // Enable HTTPS if the HTTPS environment variable is set to 'true'
    https: false,
    host: '0.0.0.0',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    overlay: false,
    historyApiFallback: { disableDotRule: true },
    proxy: ''
  }, extendOpts);
};