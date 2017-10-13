'use strict';
var babelQuery = {
  cacheDirectory: true,
  presets: [
    require.resolve('babel-preset-es2015'),
    require.resolve('babel-preset-react'),
    require.resolve('babel-preset-stage-0')
  ],
  plugins: [
    require.resolve('babel-plugin-transform-runtime'),
    require.resolve('babel-plugin-add-module-exports'),
    require.resolve('babel-plugin-typecheck'),
    require.resolve('babel-plugin-transform-decorators-legacy')
  ]
};

var BowerWebpackPlugin = require("bower-webpack-plugin");

var path = require('path');
var fs = require('fs');

var webpack = require('webpack');
var _ = require('lodash');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

var excludeFromStats = [
  /node_modules[\\\/]/
];

function makeConf(options) {
  options = options || {};

  if (!options['middlewareDir'])
    options['middlewareDir'] = process.middlewareDir();

  var srcDir = options.currentRepoDir + '/src';
  var assets = options.currentRepoDir + '/build';
  var sourceMap = {};
  try {
    sourceMap = require(options.currentRepoDir + '/aliasMap.json');
  } catch (e) {}


  var debug = !!options.debug;
  var entries = genEntries(srcDir);
  var chunks = Object.keys(entries);
  var externals = {
    'jQuery': 'window.jQuery',
    '$': 'window.Zepto',
    "react": 'React',
    "react-dom": "ReactDOM",
    'redux': 'Redux',
    'react-redux': 'ReactRedux'
  };
  var config = {
    context: options.middlewareDir,
    entry: entries,
    output: {
      // 在debug模式下，__build目录是虚拟的，webpack的dev server存储在内存里
      path: path.resolve(debug ? '__build' : assets),
      filename: debug ? '[name].js' : 'scripts/[name].js',
      chunkFilename: debug ? 'chunk.[name].js' : 'scripts/chunk.[name].min.js',
      hotUpdateChunkFilename: debug ? 'assetsCommon.js' : 'scripts/[id].[chunkhash:8].min.js',
      publicPath: debug ? '/__build/' : '../'
    },
    externals: debug ? {} : externals,

    resolve: {
      root: [
        options.currentRepoDir + '/node_modules/',
        options.middlewareDir + '/node_modules/',
        srcDir
      ],
      alias: sourceMap,
      extensions: ['', '.js', '.jsx', '.css', '.scss', '.less', '.tpl', '.png', '.jpg']
    },

    resolveLoader: {
      root: [
        options.currentRepoDir + "/node_modules/",
        options.middlewareDir + "/node_modules/",
        srcDir
      ]
    },

    module: {
      noParse: ['zepto'],
      loaders: [{
          test: /\.(jpe?g|png|gif|svg)$/i,
          //注意后面的name=xx，这里很重要否则打包后会出现找不到资源的
          loader: 'url-loader?limit=2&minetype=image/jpg&name=images/[name]_[hash].[ext]'
        }, {
          test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?/i,
          loader: 'url-loader?limit=10000&name=fonts/[name].[ext]'
        }, {
          test: /\.(tpl|ejs)$/,
          loader: 'ejs'
        },
        // {
        //   test: /\.html$/,
        //   loader: 'html'
        // }, 
        {
          test: /\.html$/,
          loader: 'raw-loader'
        },
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          query: babelQuery
        }, {
          test: /\.jsx$/,
          loader: 'babel-loader',
          exclude: /(node_modules|bower_components)/,
          query: babelQuery
        }
      ]
    },

    plugins: [
      new CommonsChunkPlugin({
        name: 'common',
        chunks: chunks,
        // Modules must be shared between all entries
        minChunks: chunks.length // 提取所有chunks共同依赖的模块
      }),
      new BowerWebpackPlugin()
    ],

    /*
    debug: 是否为debug模式,
    currentRepoDir: 当前工作目录
    middlewareDir: 插件目录
    dbl_path: dbl插件目录
     */
    options: options,

    /*
    添加Plugin
    */
    addPlugin: function(plugin) {
      if (plugin) this.plugins.push(plugin);
    },

    /*
    添加Loader
    */
    addLoader: function(loader) {
      if (loader) this.module.loaders.push(loader);
    },

    /*
    添加noparse
     */
    addNoParse: function(regex) {
      if (regex) this.module.noParse.push(regex);
    },

    devServer: {
      stats: {
        cached: false,
        exclude: excludeFromStats,
        colors: true
      }
    }
  };

  if (debug) {
    // 开发阶段，css直接内嵌
    var cssLoader = {
      test: /\.css$/,
      loader: "style-loader!css-loader"
    };
  
    var sassLoader = {
      test: /\.scss$/,
      loader: 'style-loader!css-loader!sass-loader'
    };
    var lessLoader = {
      test: /\.less/,
      loader: 'style-loader!css-loader!less-loader'
    };
    config.module.loaders.push(cssLoader);
    config.module.loaders.push(sassLoader);
    config.module.loaders.push(lessLoader);
    config.plugins = config.plugins.concat([
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ]);
    config.devtool = "source-map";

  } else {

    // 编译阶段，css分离出来单独引入
    var cssLoader = {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style', 'css?minimize') // enable minimize
    };
    /****
    注意啊，这里一定要用！写第二个参数ExtractTextPlugin.extract('style', 'css!less')，网上很多教程都是错误的
    ****/
    var lessLoader = {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract('style', 'css?-convertValues!less')
    };
    var sassLoader = {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style', 'css?-convertValues!sass')
    };

    config.module.loaders.push(cssLoader);
    config.module.loaders.push(lessLoader);
    config.module.loaders.push(sassLoader);

    config.plugins.push(
      new webpack.optimize.UglifyJsPlugin({ //压缩代码
        compress: {
          warnings: false
        },
        except: ['$super', '$', 'exports', 'require'] //排除关键字
      }),
      new ExtractTextPlugin('css/[name].css', {
        // 当allChunks指定为false时，css loader必须指定怎么处理
        // additional chunk所依赖的css，即指定`ExtractTextPlugin.extract()`
        // 第一个参数`notExtractLoader`，一般是使用style-loader
        // @see https://github.com/webpack/extract-text-webpack-plugin
        allChunks: false
      })
    );
    // 自动生成入口文件，入口js名必须和入口文件名相同
    // 例如，a页的入口文件是a.html，那么在js目录下必须有一个a.js作为入口文件
    var pages = fs.readdirSync(srcDir);



    pages.forEach(function(filename) {
      var m = filename.match(/(.+)\.html$/);

      if (m) {
        // @see https://github.com/kangax/html-minifier

        var conf = {
          template: path.resolve(srcDir, filename),
          // @see https://github.com/kangax/html-minifier
          // minify: {
          //     collapseWhitespace: true,
          //     removeComments: true
          // },
          filename: filename
        };

        if (m[1] in config.entry) {
          conf.inject = 'body';
          conf.chunks = ['common', m[1]];
        }
        config.plugins.push(new HtmlWebpackPlugin(conf));

      }
    });

  }
  return config;
}

function genEntries(srcDir) {
  var jsDir = path.resolve(srcDir, 'scripts');
  var names = fs.readdirSync(jsDir);
  var map = {};

  names.forEach(function(name) {
    var m = name.match(/(.+)\.js$/);
    var entry = m ? m[1] : '';
    var entryPath = entry ? path.resolve(jsDir, name) : '';

    if (entry)
      map[entry] = entryPath;
  });
  return map;
}
module.exports = makeConf;