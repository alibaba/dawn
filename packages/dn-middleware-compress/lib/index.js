const UglifyJS = require("uglify-js");
const CleanCSS = require('clean-css');

async function compressJs(ctx, files) {
  const { utils, console } = ctx;
  const { readFile, writeFile } = utils;
  return Promise.all(files.map(async file => {
    console.log('[start]:', file);
    const source = (await readFile(file)).toString();
    const { error, code } = UglifyJS.minify(source);
    if (error) {
      console.error(error);
      process.exit(2);
    };
    await writeFile(file, code);
    console.log('[finish]:', file);
  }));
}

async function compressCss(ctx, files) {
  const { utils, console } = ctx;
  const { readFile, writeFile } = utils;
  const cleanCss = new CleanCSS();
  return Promise.all(files.map(async file => {
    console.log('[start]:', file);
    const source = (await readFile(file)).toString();
    const { styles, errors } = cleanCss.minify(source);
    if (errors && errors.length > 0) {
      errors.forEach(error => console.error(error));
      process.exit(2);
    };
    await writeFile(file, styles);
    console.log('[finish]:', file);
  }));
}

module.exports = function (opts) {

  opts = Object.assign({
    js: './build/**/*.js',
    css: './build/**/*.css'
  }, opts);

  return async function (next, ctx) {
    const { utils, console } = ctx;
    console.info('开始压缩 CSS');
    const cssFiles = await utils.files(opts.css);
    await compressCss(ctx, cssFiles);
    console.info('开始压缩 JS');
    const jsFiles = await utils.files(opts.js);
    await compressJs(ctx, jsFiles);
    console.info('done')
    next();
  };

};