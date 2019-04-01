const os = require('os');
const { Safeify } = require("safeify");

const modules = {
  js: require.resolve('./js'),
  css: require.resolve('./css'),
};

async function compress(ctx, pool, type, files, opts) {
  const { console } = ctx;
  opts = opts || {};
  return Promise.all(files.map(async file => {
    console.log('[start]:', file);
    try {
      await pool.run(`return require('${type}')(file, opts)`, { file, opts });
      console.log('[finish]:', file);
    } catch (err) {
      console.error('[error]:', file, err.message);
      process.exit(2);
    }
  }));
}

module.exports = function (opts) {

  opts = Object.assign({
    js: './build/**/*.js',
    css: './build/**/*.css',
    options: {},
  }, opts);

  return async function (next, ctx) {
    const { utils, console } = ctx;
    console.info('[compress]:', '已启用');
    const pool = new Safeify({
      timeout: 1000 * 60 * 3,
      unsafe: { modules },
      greedy: false,
      workers: os.cpus().length,
      unrestricted: true,
    });
    await pool.init();
    console.info('[compress]:', pool.workerTotal);

    const { css, js, options } = opts;

    console.info('[compress]:', '开始压缩 CSS');
    await compress(ctx, pool, 'css', await utils.files(css), options.css);

    console.info('[compress]:', '开始压缩 JS');
    await compress(ctx, pool, 'js', await utils.files(js), options.js);

    await pool.destroy();
    console.info('[compress]:', 'done');
    next();
  };

};