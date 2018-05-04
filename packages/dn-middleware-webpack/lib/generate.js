const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const globby = require('globby');
const utils = require('ntils');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const confman = require('confman');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

webpack.HtmlWebpackPlugin = HtmlWebpackPlugin;
webpack.ExtractTextPlugin = ExtractTextPlugin;
webpack.OptimizeCSSAssetsPlugin = OptimizeCSSAssetsPlugin;
webpack.MiniCssExtractPlugin = MiniCssExtractPlugin;

//生成排除配置
function makeExternal(commonjs, root, amd) {
  amd = amd || commonjs;
  const commonjs2 = commonjs;
  return { commonjs, commonjs2, root, amd };
}

//库默认排除设定
const LIB_DEFAULT_EXTERNALS = {
  'jquery': makeExternal('jquery', 'jQuery'),
  'zepto': makeExternal('zepto', 'Zepto'),
  'react': makeExternal('react', 'React'),
  'react-dom': makeExternal('react-dom', 'ReactDOM')
};

//普通项目默认排除设定
const PRO_DEFAULT_EXTERNALS = {
  'jquery': 'jQuery',
  'zepto': 'Zepto',
  'react': 'React',
  'react-dom': 'ReactDOM'
};

//处理默认 Opts
async function handleOpts(opts) {
  opts = opts || {};
  opts.entry = opts.entry || ['./src/*.{js,jsx,ts,tsx}'];
  if (utils.isString(opts.entry)) opts.entry = [opts.entry];
  opts.template = opts.template || ['./src/assets/*.html'];
  if (utils.isString(opts.template)) opts.template = [opts.template];
  opts.output = opts.output || './build/';
  opts.chunkFilename = opts.chunkFilename || 'chunks/[name]-[chunkhash].js';
  opts.folders = opts.folders || {};
  opts.folders.js = opts.folders.js || 'js';
  opts.folders.css = opts.folders.css || 'css';
  opts.folders.img = opts.folders.img || 'img';
  opts.folders.font = opts.folders.font || 'font';
  opts.folders.html = opts.folders.html || '';
  opts.config = opts.config || {};
  opts.config.name = opts.config.name || '$config';
  opts.config.path = opts.config.path || './config';
  opts.mode || opts.env || (opts.watch ? 'development' : 'production');
  if (opts.external === false || (opts.watch && opts.external !== true)) {
    opts.externals = {};
  } else {
    opts.externals = opts.externals ||
      (opts.library ? LIB_DEFAULT_EXTERNALS : PRO_DEFAULT_EXTERNALS);
  }
  return opts;
}

function createBabelOptions(opts) {
  const babel = opts.babel;
  babel.presets = babel.presets || [];
  babel.presets.push([require.resolve('babel-preset-env'), {
    targets: babel.targets || {
      browsers: babel.browsers || [
        'last 2 versions',
        'IE >= 9'
      ],
      uglify: utils.isNull(babel.uglify) ? true : babel.uglify
    },
    include: babel.include || [],
    exclude: babel.exclude || [],
    loose: babel.loose !== false,
    modules: utils.isNull(babel.modules) ? 'commonjs' : babel.modules,
    useBuiltIns: utils.isNull(babel.useBuiltIns) ?
      'usage' : babel.useBuiltIns,
    spec: babel.spec || false,
    debug: babel.debug
  }]);
  if (babel.react !== false) {
    babel.presets.push(require.resolve('babel-preset-react'));
  }
  babel.plugins = babel.plugins || [];
  if (babel.transform !== false) {
    const transform = babel.transform || {};
    babel.plugins.push([
      require.resolve('babel-plugin-transform-runtime'), {
        'helpers': utils.isNull(transform.helpers) ? true : transform.helpers, // defaults to true 
        'polyfill': utils.isNull(transform.polyfill) ? true : transform.polyfill, // defaults to true 
        'regenerator': utils.isNull(transform.regenerator) ? true : transform.regenerator, // defaults to true 
        'moduleName': transform.moduleName || 'babel-runtime', // defaults to 'babel-runtime' 
        'useBuiltIns': transform.useBuiltIns || false
      }
    ]);
  }
  if ((utils.isNull(babel.modules) ||
    babel.modules == 'commonjs' ||
    babel.addExports) && babel.addExports !== false) {
    babel.plugins.push(require.resolve('babel-plugin-add-module-exports'))
  }
  const babelOptions = {
    babelrc: true,
    cacheDirectory: true,
    presets: [
      ...babel.presets,
      require.resolve('babel-preset-stage-0')
    ],
    plugins: [
      require.resolve('babel-plugin-typecheck'),
      require.resolve('babel-plugin-transform-decorators-legacy'),
      ...babel.plugins
    ]
  };
  if (babel.strict !== true) {
    babelOptions.plugins.push(
      require.resolve('babel-plugin-transform-remove-strict-mode')
    );
  }
  return babelOptions;
}

//处理常规 rules
async function handleRules(webpackConf, opts) {
  webpackConf.module.rules.push(
    {
      test: /\.(js|jsx|mjs)\?*.*$/,
      loader: 'babel-loader',
      options: createBabelOptions(opts),
      exclude: [/node_modules/, /\.test\.js\?*.*$/]
    }, {
      test: /\.vue\?*.*$/,
      loader: 'vue-loader'
    },
    {
      test: /\.json\?*.*$/,
      loader: 'json-loader',
      type: 'javascript/auto'
    },
    {
      test: /\?raw\?*.*$/,
      loader: 'raw-loader'
    }, {
      test: /\.ejs\?*.*$/,
      loader: 'ejs-loader'
    }, {
      test: /\.html\?*.*$/,
      loader: 'raw-loader'
    }, {
      test: /\.(png|jpg|gif)\?*.*$/,
      loader: `url-loader?limit=8192&name=${opts.folders.img}/[hash].[ext]`
    }, {
      test: /\.(eot|woff|woff2|webfont|ttf|svg)\?*.*$/,
      loader: `url-loader?limit=8192&name=${opts.folders.font}/[hash].[ext]`
    }
  );
  opts.rules = opts.rules || [];
  webpackConf.module.rules.push(...opts.rules);
}

//处理插件
async function handlerStyles(webpackConf, opts) {
  const cssExtractPlugin = new MiniCssExtractPlugin({
    filename: `${opts.folders.css}/[name].css`,
  });
  webpackConf.plugins.push(cssExtractPlugin);
  const cssLoaderOptions = {
    modules: opts.cssModules,
    camelCase: opts.cssModules //只要启用就采用「小驼峰」
  };
  webpackConf.module.rules.push(
    {
      test: /\.less$/,
      use: [MiniCssExtractPlugin.loader, {
        loader: 'css-loader', options: cssLoaderOptions
      }, 'less-loader']
    }, {
      test: /\.(scss|sass)$/,
      use: [MiniCssExtractPlugin.loader, {
        loader: 'css-loader', options: cssLoaderOptions
      }, 'fast-sass-loader']
    }, {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader,
      { loader: 'css-loader', options: cssLoaderOptions }]
    }
  );
}

async function handleOptimization(webpackConf, opts) {
  if (opts.mode !== 'production') return;
  // 如果 watch 为 false 时 compress 才有效
  // 默认压缩只有明确设置为 false 时才不压缩
  webpackConf.optimization.minimizer = [
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: opts.sourceMap // set to true if you want JS source maps
    }),
    new OptimizeCSSAssetsPlugin({})
  ];
}

//获取所有模板
async function getTemplates(opts) {
  let templates;
  if (utils.isObject(opts.template) && !utils.isArray(opts.template)) {
    templates = [];
    utils.each(opts.template, (nameExpr, fileExpr) => {
      const files = globby.sync(fileExpr);
      files.forEach(file => {
        const paths = file.split('/').reverse()
          .map(item => (path.basename(item).split('.')[0]));
        const name = nameExpr.replace(/\((\d+)\)/g, (str, index) => {
          return paths[index];
        });
        templates.push({ name, file });
      });
    });
  } else {
    const files = await globby(opts.template);
    templates = files.map(file => ({
      name: path.basename(file).split('.')[0],
      file: file
    }));
  }
  return templates;
}

//获取所有入口文件
async function getEntries(opts) {
  let entries;
  if (utils.isObject(opts.entry) && !utils.isArray(opts.entry)) {
    entries = [];
    utils.each(opts.entry, (nameExpr, fileExpr) => {
      const files = globby.sync(fileExpr);
      files.forEach(file => {
        const paths = file.split('/').reverse()
          .map(item => (path.basename(item).split('.')[0]));
        const name = nameExpr.replace(/\((\d+)\)/g, (str, index) => {
          return paths[index];
        });
        entries.push({ name, file });
      });
    });
  } else {
    const files = await globby(opts.entry);
    entries = files.map(file => ({
      name: path.basename(file).split('.')[0],
      file: file
    }));
  }
  return entries;
}

//处理入口文件
async function handleEntry(webpackConf, opts) {
  const entries = await getEntries(opts);
  if (entries.length < 1) throw new Error(`没有发现有效的构建入口文件`);
  const templates = await getTemplates(opts);
  entries.forEach(entry => {
    webpackConf.entry[entry.name] = [...opts.inject, entry.file];
    const template = templates.find(item => item.name == entry.name) ||
      templates[0];
    if (!template) return;
    webpackConf.plugins.push(new HtmlWebpackPlugin({
      filename: `./${opts.folders.html}/${entry.name}.html`,
      template: template.file,
      chunks: [entry.name]
    }));
  });
}

//处理配置
async function handleConfig(webpackConf, opts, ctx) {
  const configPath = path.resolve(ctx.cwd, opts.config.path);
  const configEnv = opts.config.env || ctx.env || ctx.command;
  confman.env = configEnv;
  ctx.$config = confman.load(configPath);
  webpackConf.plugins.push(confman.webpackPlugin({
    env: opts.config.env || ctx.env || ctx.command,
    name: opts.config.name,
    path: configPath
  }));
}

//处理 UMD
async function handleUMD(webpackConf, opts) {
  if (!opts.umd) return;
  Object.assign(webpackConf.output, opts.umd);
}

//配置生成函数
async function generate(ctx, opts) {
  opts = await handleOpts(opts);
  const webpackConf = {
    context: ctx.cwd,
    entry: {},
    resolve: {
      extensions: ['.js', '.mjs', '.json', '.jsx', '.css', '.less', '.scss', '.sass']
    },
    output: {
      publicPath: opts.publicPath,
      path: path.resolve(ctx.cwd, opts.output),
      filename: `${opts.folders.js}/[name].js`,
      chunkFilename: opts.chunkFilename
    },
    mode: opts.mode,
    optimization: {},
    devtool: opts.sourceMap !== false ? 'source-map' : false,
    module: { rules: [] },
    plugins: [],
    externals: opts.externals
  };
  await handleUMD(webpackConf, opts);
  await handleRules(webpackConf, opts);
  await handleEntry(webpackConf, opts);
  await handlerStyles(webpackConf, opts);
  await handleConfig(webpackConf, opts, ctx);
  await handleOptimization(webpackConf, opts);
  return webpackConf;
}

module.exports = generate;