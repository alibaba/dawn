const path = require('path');
const md5 = require('md5');
const fs = require('fs');

/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = (opts) => {

  opts = Object.assign({
    output: { js: './build/js', css: './build/css' },
    libName: 'vendors'
  }, opts);

  //构建 Library
  const buildLibrary = async (ctx, vendors, cacheDir) => {
    //配置针对 lib 的 webpack 
    ctx.on('webpack.config', (webpackConf, webpack, webpackOpts) => {
      if (webpackOpts.__libName !== opts.libName) return;
      webpackConf.plugins.push(new webpack.DllPlugin({
        path: path.normalize(`${cacheDir}/manifest.json`),
        name: opts.libName,
        context: ctx.cwd,
      }));
      webpackConf.context = ctx.cwd;
      webpackConf.output = {
        path: cacheDir,
        filename: '[name].js',
        library: opts.libName
      };
      webpackConf.entry = { bundle: vendors };
    });
    //执行 Lib 构建
    await ctx.exec({
      name: 'webpack',
      env: 'production',
      sourceMap: false,
      ...opts.webpack,
      common: { disabled: true },
      folders: { js: '.', css: '.', html: '.' },
      entry: require.resolve('./noop.js'),
      __libName: opts.libName,
    });
  };

  //引用 lib
  const referenceLibrary = (ctx, webpackConf, webpack, cacheDir) => {
    const manifestFile = path.normalize(`${cacheDir}/manifest.json`);
    if (!fs.existsSync(manifestFile)) {
      throw new Error(`不能找到 library '${opts.libName}'`);
    };
    webpackConf.plugins.push(new webpack.DllReferencePlugin({
      context: ctx.cwd,
      manifest: require(manifestFile),
    }));
  };

  //复制 lib
  const copyLibrary = async (ctx, opts, cacheDir) => {
    const jsDir = path.resolve(ctx.cwd, opts.output.js);
    const cssDir = path.resolve(ctx.cwd, opts.output.css);
    await ctx.exec({
      name: 'copy',
      files: {
        [`${jsDir}/${opts.libName}.js`]: `${cacheDir}/bundle.js`,
        [`${cssDir}/${opts.libName}.css`]: `${cacheDir}/bundle.css`
      }
    });
  };

  //生成 hash
  const createHash = async (ctx, vendors) => {
    const { dependencies, devDependencies } = ctx.project || {};
    const deps = Object.assign({}, devDependencies, dependencies);
    const text = vendors.map(name => {
      return `${name}@${deps[name] || Date.now()}`;
    }).join(',');
    console.log('text', text);
    return md5(text);
  }

  return async (next, ctx) => {

    //计算 lib 资源
    const vendors = opts.vendors || opts.entry ||
      Object.keys(ctx.project.dependencies || {});

    //计算项目缓存目录
    const cacheKey = await createHash(ctx, vendors);
    const cacheDir = path.normalize(`${ctx.cwd}/.dll`);

    // 生成新 lib 或使用缓存
    ctx.console.log('检查 Library 的 hash');
    const hashFile = path.normalize(`${cacheDir}/.hash`);
    const hash = fs.existsSync(hashFile) ?
      (await ctx.utils.readFile(hashFile)).toString() : '';
    if (vendors && vendors.length > 0 && hash !== cacheKey) {
      ctx.console.log('开始生成 Library');
      await buildLibrary(ctx, vendors, cacheDir);
      await copyLibrary(ctx, opts, cacheDir);
      ctx.console.info('记录 Library 的 hash');
      await ctx.utils.writeFile(hashFile, cacheKey);
      ctx.console.log('生成 Library 完成');
    } else {
      await copyLibrary(ctx, opts, cacheDir);
      ctx.console.log('使用 Library 缓存');
    }
    ctx.console.info('Done');

    //在项目的 webpack 中引用 lib
    ctx.once('webpack.config', (webpackConf, webpack, webpackOpts) => {
      if (webpackOpts.__libName) return;
      referenceLibrary(ctx, webpackConf, webpack, cacheDir);
    });

    next();

  };

};