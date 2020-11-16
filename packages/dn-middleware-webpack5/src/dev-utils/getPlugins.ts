import resolve from "resolve";
import * as path from "path";
import * as Dawn from "@dawnjs/types";
import { DefinePlugin, HotModuleReplacementPlugin } from "webpack";
import type { WebpackPluginInstance } from "webpack/types.d";
// import InterpolateHtmlPlugin from "react-dev-utils/InterpolateHtmlPlugin";
import ModuleNotFoundPlugin from "react-dev-utils/ModuleNotFoundPlugin";
// import WatchMissingNodeModulesPlugin from "react-dev-utils/WatchMissingNodeModulesPlugin";
import ForkTsCheckerWebpackPlugin from "react-dev-utils/ForkTsCheckerWebpackPlugin";
import typescriptFormatter from "react-dev-utils/typescriptFormatter";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
// import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import Webpackbar from "webpackbar";
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");

// import InlineChunkHtmlPlugin from "react-dev-utils/InlineChunkHtmlPlugin";
// import getCacheIdentifier from "react-dev-utils/getCacheIdentifier";

import { FileInfo, IGetWebpackConfigOpts } from "../types";

const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

// Generate webpack plugins
const getPlugins = (options: IGetWebpackConfigOpts, ctx: Dawn.Context) => {
  const plugins: WebpackPluginInstance[] = [];

  // HTMLWebpackPlugin
  // Generates an `index.html` file with the <script> injected.
  (options.entry as FileInfo[]).forEach(({ name }) => {
    const template = options.template?.find?.(temp => temp.name === name) ?? options.template[0];
    if (!template) return;
    const minifyOption = ctx.isEnvProduction // auto minify when production mode
      ? {
          // https://github.com/DanielRuf/html-minifier-terser
          // Strip HTML comments
          removeComments: true,
          // Collapse white space that contributes to text nodes in a document tree
          collapseWhitespace: true,
          // Remove attributes when value matches default.
          removeRedundantAttributes: true,
          // Replaces the doctype with the short (HTML5) doctype
          useShortDoctype: true,
          // Remove all attributes with whitespace-only values
          removeEmptyAttributes: true,
          // Remove type="text/css" from style and link tags. Other type attribute values are left intact
          removeStyleLinkTypeAttributes: true,
          // Keep the trailing slash on singleton elements
          keepClosingSlash: true,
          // Minify JavaScript in script elements and event attributes (uses Terser)
          minifyJS: true,
          // Minify CSS in style elements and style attributes (uses clean-css)
          minifyCSS: true,
          // Minify URLs in various attributes (uses relateurl)
          minifyURLs: true,
        }
      : false;
    plugins.push(
      new HtmlWebpackPlugin({
        inject: true,
        filename: path.join(options?.folders?.html ?? "", `${name}.html`),
        template: template.file,
        chunks: [options?.common?.name, name].filter(Boolean),
        minify: minifyOption,
      }),
    );
  });

  // InlineChunkHtmlPlugin
  // Inlines the webpack runtime script. This script is too small to warrant a network request.
  // https://github.com/facebook/create-react-app/tree/master/packages/react-dev-utils#new-inlinechunkhtmlpluginhtmlwebpackplugin-htmlwebpackplugin-tests-regex
  // ctx.isEnvProduction && plugins.push(new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]) as any);

  // InterpolateHtmlPlugin
  // Makes some environment variables available in index.html.
  // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
  // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
  // It will be an empty string unless you specify "homepage" in `package.json`, in which case it will be the pathname of that URL.
  // https://github.com/facebook/create-react-app/tree/master/packages/react-dev-utils#new-interpolatehtmlpluginhtmlwebpackplugin-htmlwebpackplugin-replacements-keystring-string
  // plugins.push(
  // new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
  // TODO: add some envs
  // }) as any,
  // );

  // ModuleNotFoundPlugin
  // This gives some necessary context to module not found errors, such as the requesting resource.
  plugins.push(new ModuleNotFoundPlugin(options.cwd));

  // DefinePlugin
  // Makes some environment variables available to the JS code, for example:
  // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
  // It is absolutely essential that NODE_ENV is set to production during a production build.
  // Otherwise React will be compiled in the very slow development mode.
  plugins.push(
    new DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(options.env), // production
      },
    }),
  );

  // CaseSensitivePathsPlugin
  // Watcher doesn't work well if you mistype casing in a path so we use a plugin that prints an error when you attempt to do this.
  // See https://github.com/facebook/create-react-app/issues/240
  // https://github.com/Urthen/case-sensitive-paths-webpack-plugin
  ctx.isEnvDevelopment && plugins.push(new CaseSensitivePathsPlugin());

  // MiniCssExtractPlugin
  // Options similar to the same options in webpackOptions.output both options are optional
  !ctx.injectCSS &&
    plugins.push(
      new MiniCssExtractPlugin({
        filename: path.join(options?.folders?.style ?? "", "[name].css"),
        chunkFilename: path.join(options?.folders?.style ?? "", "[name].[contenthash:8].chunk.css"),
      }) as any,
    );

  // This is necessary to emit hot updates (CSS and Fast Refresh):
  // https://github.com/pmmmwh/react-refresh-webpack-plugin/issues/232
  // options.hot && plugins.push(new ReactRefreshWebpackPlugin());
  // options.hot && plugins.push(new HotModuleReplacementPlugin());

  // hide it
  plugins.push(new Webpackbar({}));

  // webpack.IgnorePlugin
  // Moment.js is an extremely popular library that bundles large locale files
  // by default due to how webpack interprets its code. This is a practical
  // solution that requires the user to opt into importing specific locales.
  // checkContext was removed from IgnorePlugin in webpack5.
  // now IgnorePlugin must now be passed only one argument that can be an object, string or function.
  // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
  // You can remove this if you don't use Moment.js:
  // new IgnorePlugin({
  //   resourceRegExp: /^\.\/locale$/,
  //   contextRegExp: /moment$/
  // });

  // BundleAnalyzerPlugin
  // https://github.com/webpack-contrib/webpack-bundle-analyzer
  const analysisOptions = options.analysis === true ? {} : options.analysis;
  options.analysis && plugins.push(new BundleAnalyzerPlugin(analysisOptions as BundleAnalyzerPlugin.Options));

  // ForkTsCheckerWebpackPlugin
  // TypeScript type checking
  ctx.useTypeScript &&
    plugins.push(
      new ForkTsCheckerWebpackPlugin({
        typescript: resolve.sync("typescript", {
          basedir: path.join(options.cwd, "node_modules"),
        }),
        async: ctx.isEnvDevelopment,
        checkSyntacticErrors: true,
        tsconfig: path.join(options.cwd, "tsconfig.json"),
        reportFiles: [
          // This one is specifically to match during tests, as micromatch doesn't match
          "../**/src/**/*.{ts,tsx}",
          "**/src/**/*.{ts,tsx}",
          "!**/src/**/__tests__/**",
          "!**/src/**/?(*.)(spec|test).*",
          "!**/src/setupProxy.*",
          "!**/src/setupTests.*",
        ],
        silent: true,
        // The formatter is invoked directly in WebpackDevServerUtils during development
        formatter: ctx.isEnvProduction ? typescriptFormatter : undefined,
      }),
    );

  // https://webpack.docschina.org/concepts/module-federation/
  options.moduleFederation &&
    plugins.push(
      new ModuleFederationPlugin({
        // name: "app_one_remote",
        // remotes: {
        //   app_two: "app_two_remote",
        //   app_three: "app_three_remote"
        // },
        // exposes: {
        //   AppContainer: "./src/App"
        // },
        shared: ["react", "react-dom"],
        ...options.moduleFederation,
      }),
    );
  return plugins;
};

export default getPlugins;
