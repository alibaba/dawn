const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const globby = require('globby');
const utils = require('ntils');
const fs = require('fs');
const inquirer = require('inquirer');
const speedMeasurePlugin = require("speed-measure-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const confman = require('confman');
const Visualizer = require('webpack-visualizer-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const configNpm = require('./configNpm.js');

webpack.HtmlWebpackPlugin = HtmlWebpackPlugin;
webpack.ExtractTextPlugin = ExtractTextPlugin;
webpack.OptimizeCssAssetsPlugin = OptimizeCssAssetsPlugin;

const url_transform = (name) => {
  return path.join(process.cwd(), './node_modules/', name)
}
const seen = new Set();
// chunk随机id的位数
const nameLength = 4;

//生成排除配置
function makeExternal(commonjs, root, amd) {
  amd = amd || commonjs;
  let commonjs2 = commonjs;
  return {commonjs, commonjs2, root, amd};
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
  opts.chunkFilename = opts.chunkFilename || 'chunks/[name].js';
  opts.common = opts.common || {};
  opts.common.name = opts.common.name || 'common';
  opts.folders = opts.folders || {};
  opts.folders.js = opts.folders.js || 'js';
  opts.folders.css = opts.folders.css || 'css';
  opts.folders.img = opts.folders.img || 'img';
  opts.folders.font = opts.folders.font || 'font';
  opts.folders.html = opts.folders.html || '';
  opts.config = opts.config || {};
  opts.config.name = opts.config.name || '$config';
  opts.config.path = opts.config.path || './src/config';
  if (opts.external === false || (opts.watch && opts.external !== true)) {
    opts.externals = {};
  } else {
    opts.externals = opts.externals ||
      (opts.library ? LIB_DEFAULT_EXTERNALS : PRO_DEFAULT_EXTERNALS);
  }
  return opts;
}

async function checkDependency(deps) {
  const flag = { 'save-dev': true };
  const isInstalled = (name) => {
    return fs.existsSync(path.normalize(`${this.cwd}/node_modules/${name}`));
  };
  
  for (let dep of deps) {
    if (!isInstalled(dep)) await this.mod.install(dep, { flag });
  }
}

const createBabelOptions = (opts) => {
  let babel = opts.babel;
  babel.presets = babel.presets || [];
  const babelModules = opts.treeShakingLevel === 1 ? false : utils.isNull(babel.modules) ? 'commonjs' : babel.modules;
  babel.presets.push([url_transform('babel-preset-env'), {
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
    modules: babelModules,
    useBuiltIns: utils.isNull(babel.useBuiltIns) ?
      'usage' : babel.useBuiltIns,
    spec: babel.spec || false,
    debug: babel.debug
  }]);
  if (babel.react !== false) {
    babel.presets.push(url_transform('babel-preset-react'));
  }
  babel.plugins = babel.plugins || [];
  if (babel.transform !== false) {
    let transform = babel.transform || {};
    if (opts.hot) {
      babel.plugins.push(url_transform("react-hot-loader/babel"));
    }
    babel.plugins.push([
      url_transform('babel-plugin-transform-runtime'), {
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
    babel.addExports) && babel.addExports !== false && opts.treeShakingLevel !== 1) {
    babel.plugins.push(url_transform('babel-plugin-add-module-exports'))
  }
  // treeShakingLevel为2时，默认增加对于antd和fusion的tree-shaking
  if (opts.treeShakingLevel === 2) {
    babel.plugins.push([url_transform('babel-plugin-import'), {
      libraryName: '@alifd/next',
      style: true
    }]);
    babel.plugins.push([url_transform('babel-plugin-import'), {
      libraryName: '@alife/next',
      style: true
    }]);
    babel.plugins.push([url_transform('babel-plugin-import'), {
      libraryName: 'antd',
      style: true
    }])
  }
  let babelOptions = {
    babelrc: true,
    cacheDirectory: true,
    presets: [
      ...babel.presets,
      url_transform('babel-preset-stage-0')
    ],
    plugins: [
      url_transform('babel-plugin-typecheck'),
      url_transform('babel-plugin-transform-decorators-legacy'),
      ...babel.plugins
    ]
  };
  if (babel.strict !== true) {
    babelOptions.plugins.push(
      url_transform('babel-plugin-transform-remove-strict-mode')
    );
  }
  return babelOptions;
}

//处理常规 loaders
async function handleLoaders(wpConfig, opts) {
  wpConfig.module.rules.push(
    {
      test: /\.(js|jsx|mjs)$/,
      loader: {
        loader: 'babel-loader',
        options: createBabelOptions(opts)
      },
      exclude: opts.babel.exclude || [/node_modules/, /\.test\.js$/]
    }, {
      test: /\.vue$/,
      loader: 'vue-loader'
    }, {
      test: /\?raw$/,
      loader: 'raw-loader'
    }, {
      test: /\.ejs$/,
      loader: 'ejs-loader'
    }, {
      test: /\.html$/,
      loader: 'raw-loader'
    }, {
      test: /\.(png|jpg|gif)\?*.*$/,
      loader: `url-loader?limit=8192&name=${opts.folders.img}/[hash].[ext]`
    }, {
      test: /\.(eot|woff|woff2|webfont|ttf|svg)\?*.*$/,
      loader: `url-loader?limit=8192&name=${opts.folders.font}/[hash].[ext]`
    }
  );
  opts.loaders = opts.loaders || opts.rules || [];
  if (opts.supportTS) {
    wpConfig.module.rules.push({
      test: /\.tsx?$/,
      use: url_transform('ts-loader'),
    });
  }
  wpConfig.module.rules.push(...opts.loaders);
}

//处理插件
async function handlerPlugins(wpConfig, opts, ctx) {
  let cssExtractPlugin;
  // 生产环境推入css提取的配置
  cssExtractPlugin = new MiniCssExtractPlugin({
    filename: `${opts.folders.css}/[name].css`,
  });
  wpConfig.plugins.push(cssExtractPlugin);
  let cssLoaderOptions = {
    modules: opts.cssModules,
    camelCase: opts.cssModules //只要启用就采用「小驼峰」
  };
  
  const isDev = opts.env === 'development';
  
  wpConfig.module.rules.push(
    {
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    },
    {
      test: /\.less$/,
      loader: [
        isDev && opts.useStyleLoader ? 'style-loader' :
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              ident: 'MiniCss',
              publicPath: '/'
            }
          },
        {
          loader: 'css-loader', options: cssLoaderOptions
        },
        {
          loader: 'less-loader', options: {javascriptEnabled: true}
        }
      ]
    }, {
      test: /\.css$/,
      loader: [
        isDev && opts.useStyleLoader ? 'style-loader' :
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              ident: 'MiniCss',
              publicPath: '/'
            }
          },
        {loader: 'css-loader', options: cssLoaderOptions}
      ]
    }
  );
  if (opts.useEslint) {
    wpConfig.module.rules.push({
      test: /\.(js|jsx)$/,
      loader: 'eslint-loader',
      options: {
        emitError: true,
        fix: true,
        quiet: true
      },
      include: /src/,
      exclude: /node_modules/,
      enforce: 'pre'
    });
  }
  
  if (!(opts.useSass === false)) {
    wpConfig.module.rules.push({
      test: /\.(scss|sass)$/,
      loader: [
        isDev && opts.useStyleLoader ? 'style-loader' :
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              ident: 'MiniCss',
              publicPath: '/'
            }
          },
        {
          loader: 'css-loader', options: cssLoaderOptions
        },
        'fast-sass-loader'
      ]
    })
  }
  // 分析bundle插件部分
  if (opts.analysis) {
    let analysisOpts = {};
    wpConfig.plugins.push(new speedMeasurePlugin())
    if (opts.analysis === 'static') {
      analysisOpts = {analyzerMode: 'static'}
    }
    wpConfig.plugins.push(new BundleAnalyzerPlugin(analysisOpts));
  }
  if (opts.longtermcache && opts.longtermcache.open) {
    wpConfig.plugins.push(new webpack.NamedChunksPlugin(chunk => {
      if (chunk.name) {
        return chunk.name;
      }
      const modules = Array.from(chunk.modulesIterable);
      if (modules.length > 1) {
        const hash = require('hash-sum');
        const joinedHash = hash(modules.map(m => m.id).join('_'));
        let len = nameLength;
        while (seen.has(joinedHash.substr(0, len))) len++;
        seen.add(joinedHash.substr(0, len));
        return `${opts.longtermcache.name || 'chunk'}-${joinedHash.substr(0, len)}`;
      } else {
        return modules[0].id;
      }
    }));
  }
  wpConfig.optimization = wpConfig.optimization || {};
  wpConfig.plugins.push(new ProgressBarPlugin());
  wpConfig.optimization.minimize = false;
  if (!opts.common.disabled) {
    wpConfig.optimization.splitChunks = {
      cacheGroups: {
        //打包公共模块
        [opts.common.name]: {
          test(module, chunks) {
            //...
            return (module.type !== 'css/mini-extract' &&
              module.resource &&
              module.resource.indexOf('node_modules') !== -1)
          },
          name: opts.common.name,
          chunks: "all"
        },
        default: false // 取消默认default打包
      }
    }
    /*if (opts.common.dependencies) {
      const dependencies = utils.isArray(opts.common.dependencies) ?
        opts.common.dependencies : Object.keys(
          require(path.normalize(`${ctx.cwd}/package.json`)).dependencies
        );
      wpConfig.entry[opts.common.name] = dependencies;
      //console.log('自动收集 dependencies', opts.common.name, dependencies);
    }*/
  } else {
    wpConfig.optimization.splitChunks = {
      minChunks: 100000
    };
  }
  if (opts.stats) {
    wpConfig.plugins.push(new Visualizer({
      filename: './report/stats.html'
    }));
  }
  if (opts.optimization) {
    wpConfig.plugins.push(new webpack.optimize.ModuleConcatenationPlugin({
      optimizationBailout: true
    }));
  }
  if (opts.env) {
    wpConfig.plugins.push(new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(opts.env)//production
      }
    }));
  }
  // css压缩逻辑，js压缩逻辑
  if (opts.env === 'production' && opts.compress) {
    wpConfig.plugins.push(
      new UglifyJsPlugin(
        {
          sourceMap: false,
          exclude: [/\.min\.js$/, /node_modules/],
          uglifyOptions: {
            compress: {
              warnings: false,
              drop_debugger: true,
              drop_console: true
            },
            output: {comments: false},
            drop_console: true
          },
          parallel: true,
        }
      ),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: cssnano({
          safe: true
        }),
        cssProcessorOptions: {
          discardComments: {
            removeAll: true
          }
        },
        canPrint: false
      })
    );
  } else {
    wpConfig.optimization.minimize = false;
  }
}

//获取所有模板
async function getTemplates(opts) {
  let templates;
  if (utils.isObject(opts.template) && !utils.isArray(opts.template)) {
    templates = [];
    utils.each(opts.template, (nameExpr, fileExpr) => {
      let files = globby.sync(fileExpr);
      files.forEach(file => {
        let paths = file.split('/').reverse()
          .map(item => (path.basename(item).split('.')[0]));
        let name = nameExpr.replace(/\((\d+)\)/g, (str, index) => {
          return paths[index];
        });
        templates.push({name, file});
      });
    });
  } else {
    let files = await globby(opts.template);
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
  if ((utils.isObject(opts.entry) && !utils.isArray(opts.entry))) {
    entries = [];
    utils.each(opts.entry, (nameExpr, fileExpr) => {
      let files = globby.sync(fileExpr);
      files.forEach(file => {
        let paths = file.split('/').reverse()
          .map(item => (path.basename(item).split('.')[0]));
        let name = nameExpr.replace(/\((\d+)\)/g, (str, index) => {
          return paths[index];
        });
        entries.push({name, file});
      });
    });
  } else {
    let files = await globby(opts.entry);
    if (opts.env === 'development' && files.length > 1 && !opts.disableMulti) {
      let chooseFileConfig = [{
        type: 'checkbox',
        name: 'entryChoose',
        message: '请选择需要编译的页面',
        choices: files.map(item => ({name: item, value: item}))
      }]
      let finalFiles = await inquirer.prompt(chooseFileConfig);
      entries = finalFiles.entryChoose.map(file => ({
        name: path.basename(file).split('.')[0],
        file: file
      }));
    } else {
      entries = files.map(file => ({
        name: path.basename(file).split('.')[0],
        file: file
      }));
    }
  }
  return entries;
}

//处理入口文件
async function handleEntry(wpConfig, opts) {
  let entries = await getEntries(opts);
  if (entries.length < 1) throw new Error(`没有发现有效的构建入口文件`);
  let templates = await getTemplates(opts);
  entries.forEach(entry => {
    wpConfig.entry[entry.name] = [...opts.inject, entry.file, ...opts.append];
    if (opts.hot) {
      wpConfig.entry[entry.name].unshift('react-hot-loader/patch'); // 热更新添加对应patch
    }
    let template = templates.find(item => item.name == entry.name) ||
      templates[0];
    if (!template) return;
    wpConfig.plugins.push(new HtmlWebpackPlugin({
      filename: `./${opts.folders.html}/${entry.name}.html`,
      template: template.file,
      chunks: !opts.common.disabled ? [opts.common.name, entry.name] : [entry.name]
    }));
  });
}

//处理配置
async function handleConfig(wpConfig, opts, ctx) {
  let configPath = path.resolve(ctx.cwd, opts.config.path);
  let configEnv = opts.config.env || ctx.env || ctx.command;
  confman.env = configEnv;
  ctx.$config = confman.load(configPath);
  wpConfig.plugins.push(confman.webpackPlugin({
    env: opts.config.env || ctx.env || ctx.command,
    name: opts.config.name,
    path: configPath
  }));
}

//处理 UMD
async function handleUMD(wpConfig, opts) {
  if (!opts.umd) return;
  Object.assign(wpConfig.output, opts.umd);
}

async function addNpmrc(ctx) {
  const sass_binary_site = 'sass_binary_site=https://npm.taobao.org/mirrors/node-sass/';
  const npmrcPath = path.resolve(ctx.cwd, path.normalize('./.npmrc'));
  if (fs.existsSync(npmrcPath)) {
    const npmrc = (await ctx.utils.readFile(npmrcPath)).toString();
    if (npmrc.indexOf('sass_binary_site') < 0) {
      fs.writeFileSync((npmrcPath), npmrc + '\n' + sass_binary_site);
    }
  } else {
    fs.openSync(npmrcPath, 'a');
    fs.writeFileSync((npmrcPath), sass_binary_site);
  }
}

//配置生成函数
async function generate(ctx, opts) {
  if (opts.useSass !== false) {
    await addNpmrc(ctx);
  }
  const dependencies = configNpm.getDependcies(opts);
  if (dependencies.length > 0) {
    await checkDependency.call(ctx, dependencies); // npm懒加载检查
  }
  opts = await handleOpts(opts);
  let wpConfig = {
    context: ctx.cwd,
    entry: {},
    resolve: {
      extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.css', '.less', '.scss', '.sass']
    },
    output: {
      publicPath: opts.publicPath || '/',
      path: path.resolve(ctx.cwd, opts.output),
      filename: `${opts.folders.js}/[name].js`,
      chunkFilename: opts.chunkFilename
    },
    mode: opts.env,
    devtool: opts.sourceMap === true ? 'source-map' : opts.sourceMap,
    module: {
      rules: []
    },
    plugins: [],
    externals: opts.externals
  };
  await handleUMD(wpConfig, opts);
  await handleLoaders(wpConfig, opts);
  await handleEntry(wpConfig, opts);
  await handlerPlugins(wpConfig, opts, ctx);
  await handleConfig(wpConfig, opts, ctx);
  return wpConfig;
}

module.exports = generate;
