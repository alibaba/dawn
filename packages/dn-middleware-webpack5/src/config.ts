import * as path from "path";
import resolve from "resolve";
import * as Dawn from "@dawnjs/types";
import type { Configuration, ModuleOptions, RuleSetRule, WebpackPluginInstance } from "webpack/types.d";
import { DefinePlugin, HotModuleReplacementPlugin } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
// import InlineChunkHtmlPlugin from "react-dev-utils/InlineChunkHtmlPlugin";
import InterpolateHtmlPlugin from "react-dev-utils/InterpolateHtmlPlugin";
import ModuleNotFoundPlugin from "react-dev-utils/ModuleNotFoundPlugin";
import WatchMissingNodeModulesPlugin from "react-dev-utils/WatchMissingNodeModulesPlugin";
import ForkTsCheckerWebpackPlugin from "react-dev-utils/ForkTsCheckerWebpackPlugin";
import typescriptFormatter from "react-dev-utils/typescriptFormatter";
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

import getPublicUrlOrPath from "react-dev-utils/getPublicUrlOrPath";
import getCSSModuleLocalIdent from "react-dev-utils/getCSSModuleLocalIdent";
// import getCacheIdentifier from "react-dev-utils/getCacheIdentifier";
import { IGetWebpackConfigOpts } from "./types";

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
const getPublicPath = () => getPublicUrlOrPath(process.env.NODE_ENV === "development", process.env.PUBLIC_URL, "/");

// const extensions = [".js", ".jsx", ".ts", ".tsx", ".es6", ".es", ".mjs"];

// Generate webpack entries
const getEntry = (options: IGetWebpackConfigOpts) => {
  const webpackEntry: any = {};
  options.entry.forEach(({ name, file }) => {
    webpackEntry[name] = [...options.inject, file, ...options.append];
  });
  return webpackEntry;
};

// Generate devtool/sourcemap
const getDevtool = (devtool: boolean | string, ctx: Dawn.Context) => {
  let formatDevtool: string | false;
  switch (devtool) {
    case false:
      formatDevtool = false;
      break;
    case true:
    case undefined:
    default:
      if (typeof devtool === "string") {
        formatDevtool = devtool;
      } else {
        formatDevtool = ctx.isEnvDevelopment ? "cheap-module-source-map" : "source-map";
      }
      break;
  }
  return formatDevtool;
};

// Generate webpack plugins
const getPlugins = (options: IGetWebpackConfigOpts, ctx: Dawn.Context) => {
  const plugins: WebpackPluginInstance[] = [];

  // HTMLWebpackPlugin
  // Generates an `index.html` file with the <script> injected.
  options.entry.forEach(({ name }) => {
    const template = options.template?.find?.(temp => temp.name === name) ?? options.template[0];
    if (!template) return;
    const minifyOption =
      options.htmlMinifier ?? // use user options first
      (ctx.isEnvProduction // auto minify when production mode
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
        : undefined);
    plugins.push(
      new HtmlWebpackPlugin({
        ...options.html,
        inject: true,
        filename: path.join(options?.folders?.html ?? "", `${name}.html`),
        template: template.file,
        // TODO: do we need to filter chunks? https://github.com/jantimon/html-webpack-plugin#filtering-chunks
        // chunks: [name],
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
  plugins.push(
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
      // TODO: add some envs
    }) as any,
  );

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
      // TODO: envs
    }),
  );

  // This is necessary to emit hot updates (CSS and Fast Refresh):
  ctx.isEnvDevelopment && plugins.push(new HotModuleReplacementPlugin());

  // CaseSensitivePathsPlugin
  // Watcher doesn't work well if you mistype casing in a path so we use a plugin that prints an error when you attempt to do this.
  // See https://github.com/facebook/create-react-app/issues/240
  // https://github.com/Urthen/case-sensitive-paths-webpack-plugin
  ctx.isEnvDevelopment && plugins.push(new CaseSensitivePathsPlugin());

  // WatchMissingNodeModulesPlugin
  // If you require a missing module and then `npm install` it, you still have to restart the development server for webpack to discover it.
  // This plugin makes the discovery automatic so you don't have to restart.
  // See https://github.com/facebook/create-react-app/issues/186
  ctx.isEnvDevelopment &&
    plugins.push(new WatchMissingNodeModulesPlugin(path.join(options.cwd, "node_modules")) as any);

  // MiniCssExtractPlugin
  // Options similar to the same options in webpackOptions.output both options are optional
  ctx.isEnvProduction && plugins.push(new MiniCssExtractPlugin() as any);

  // TODO: webpack.IgnorePlugin
  // TODO: WorkboxWebpackPlugin

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

  return plugins;
};

// common function to get style loaders
const getStyleLoaders = (
  options: { cssOptions?: object; preProcessor?: string; preProcessorOptions?: object; styleOptions?: object },
  ctx: Dawn.Context,
) => {
  const loaders = [
    ctx.injectCSS
      ? require.resolve("style-loader")
      : {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: getPublicPath(),
            ...options.styleOptions,
          },
        },
    {
      loader: require.resolve("css-loader"),
      options: options.cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in package.json
      loader: require.resolve("postcss-loader"),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: "postcss",
        plugins: () => [
          // TODO: see what postcss-plugins used in rollup mw
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          require("postcss-flexbugs-fixes"),
          // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
          require("postcss-preset-env")({
            autoprefixer: { flexbox: "no-2009" },
            stage: 3,
          }),
          // Adds PostCSS Normalize as the reset css with default options,
          // so that it honors browserslist config in package.json
          // which in turn let's users customize the target behavior as per their needs.
          // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
          require("postcss-normalize")(),
        ],
        sourceMap: ctx.isEnvDevelopment,
      },
    },
  ].filter(Boolean);
  if (options.preProcessor) {
    loaders.push(
      {
        loader: require.resolve("resolve-url-loader"),
        options: {
          sourceMap: ctx.isEnvDevelopment,
        },
      },
      {
        loader: require.resolve(options.preProcessor),
        options: {
          sourceMap: true,
          ...options.preProcessorOptions,
        },
      },
    );
  }
  return loaders;
};

// Generate webpack modules config
// Each module has a smaller surface area than a full program, making verification, debugging, and testing trivial.
// Well-written modules provide solid abstractions and encapsulation boundaries, so that each module has a coherent design and a clear purpose within the overall application.
export const getModule = async (options: IGetWebpackConfigOpts, ctx: Dawn.Context) => {
  const webpackModule: ModuleOptions = {};
  const { babelOpts } = await ctx.exec({
    name: "babel",
    noEmit: true,
    cwd: options.cwd,
    target: ["web", "browser"].includes(options.target) ? "browser" : "node",
    type: "cjs",
    runtimeHelpers: options.runtimeHelpers,
    corejs: options.corejs,
    nodeVersion: options.nodeVersion,
    extraPresets: options.extraBabelPresets,
    extraPlugins: options.extraBabelPlugins,
  });

  const rules: RuleSetRule[] = [
    // Disable require.ensure as it's not a standard language feature.
    { parser: { requireEnsure: false } },
    // It's important to run the linter before Babel processes the JS.
    // We do this in lint middleware
    {
      // "oneOf" will traverse all following loaders until one will match the requirements.
      // When no loader matches it will fall back to the "file" loader at the end of the loader list.
      oneOf: [
        // "url" loader works like "file" loader except that it embeds assets smaller than specified limit in bytes as data URLs to avoid requests.
        // A missing `test` is equivalent to a match.
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: require.resolve("url-loader"),
          options: {
            limit: "10000",
            name: path.join(options?.folders?.media ?? "", "[name].[hash:8].[ext]"),
            ...options.urlLoader,
          },
        },
        // Process application JS with Babel.
        // The preset includes JSX, Flow, TypeScript, and some ESnext features.
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          loader: require.resolve("babel-loader"),
          options: {
            ...babelOpts,
            babelrc: false,
            configFile: false,
            exclude: "node_modules/**",
            // extensions,
            // babelHelpers: options.runtimeHelpers ? "runtime" : "bundled",
            // This is a feature of `babel-loader` for webpack (not Babel itself).
            // It enables caching results in ./node_modules/.cache/babel-loader/
            // directory for faster rebuilds.
            cacheDirectory: true,
            // See #6846 for context on why cacheCompression is disabled
            cacheCompression: false,
            compact: ctx.isEnvProduction,
            // Make sure we have a unique cache identifier, erring on the side of caution.
            // We remove this when the user ejects because the default is sane and uses Babel options. Instead of options, we use
            // the react-scripts and babel-preset-react-app versions.
            // cacheIdentifier: getCacheIdentifier(ctx.isEnvProduction ? "production" : "development", [
            //   "babel-plugin-named-asset-import",
            //   "react-dev-utils",
            // ]),
          },
        },
        // "postcss" loader applies autoprefixer to our CSS.
        // "css" loader resolves paths in CSS and adds assets as dependencies.
        // "style" loader turns CSS into JS modules that inject <style> tags.
        // In production, we use MiniCSSExtractPlugin to extract that CSS to a file, but in development "style" loader enables hot editing of CSS.
        // By default we support CSS Modules with the extension .module.css
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: getStyleLoaders(
            {
              cssOptions: {
                importLoaders: 1,
                sourceMap: ctx.isEnvDevelopment,
                ...options.cssLoader,
              },
              styleOptions: options.styleLoader,
            },
            ctx,
          ),
          // Don't consider CSS imports dead code even if the
          // containing package claims to have no side effects.
          // Remove this when webpack adds a warning or an error for this.
          // See https://github.com/webpack/webpack/issues/6571
          sideEffects: true,
        },
        // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
        // using the extension .module.css
        {
          test: /\.module\.css$/,
          use: getStyleLoaders(
            {
              cssOptions: {
                importLoaders: 1,
                sourceMap: ctx.isEnvDevelopment,
                modules: { getLocalIdent: getCSSModuleLocalIdent },
                ...options.cssLoader,
              },
              styleOptions: options.styleLoader,
            },
            ctx,
          ),
        },
        // Opt-in support for LESS (using .less extensions).
        // By default we support SASS Modules with the extensions .module.less
        {
          test: /\.less$/,
          exclude: /\.module\.less$/,
          use: getStyleLoaders(
            {
              cssOptions: {
                importLoaders: 3,
                sourceMap: ctx.isEnvDevelopment,
                ...options.cssLoader,
              },
              styleOptions: options.styleLoader,
              preProcessor: "less-loader",
              preProcessorOptions: {},
            },
            ctx,
          ),
          // Don't consider CSS imports dead code even if the containing package claims to have no side effects.
          // Remove this when webpack adds a warning or an error for this.
          // See https://github.com/webpack/webpack/issues/6571
          sideEffects: true,
        },
        // Adds support for CSS Modules, but using LESS using the extension .module.less
        {
          test: /\.module\.less$/,
          use: getStyleLoaders(
            {
              cssOptions: {
                importLoaders: 3,
                sourceMap: ctx.isEnvDevelopment,
                ...options.cssLoader,
              },
              styleOptions: options.styleLoader,
              preProcessor: "less-loader",
              preProcessorOptions: {},
            },
            ctx,
          ),
        },
        // "file" loader makes sure those assets get served by Server.
        // When you `import` an asset, you get its (virtual) filename.
        // In production, they would get copied to the `build` folder.
        // This loader doesn't use a "test" so it will catch all modules that fall through the other loaders.
        {
          loader: require.resolve("file-loader"),
          // Exclude `js` files to keep "css" loader working as it injects its runtime that would otherwise be processed through "file" loader.
          // Also exclude `html` and `json` extensions so they get processed by webpacks internal loaders.
          exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
          options: {
            name: path.join(options?.folders?.media ?? "", "[name].[hash:8].[ext]"),
            ...options.fileLoader,
          },
        },
        // file-loader should be the last one
      ],
    },
  ];

  webpackModule.rules = rules;
  return webpackModule;
};

// Generate webpack config
export const getWebpackConfig = async (options: IGetWebpackConfigOpts, ctx: Dawn.Context) => {
  // util symbol
  ctx.isEnvDevelopment = options.env === "development";
  ctx.isEnvProduction = options.env === "production";

  // default: only inject when dev, not inject when build
  ctx.injectCSS = options.injectCSS === undefined ? ctx.isEnvDevelopment : !!options.injectCSS;

  const webpackModule = await getModule(options, ctx);

  const config: Configuration = {
    // Learn more about the mode configuration and what optimizations take place on each value.
    // https://webpack.js.org/configuration/mode/
    mode: options.env,
    // stop compilation early in production
    bail: ctx.isEnvProduction,
    // https://webpack.js.org/configuration/devtool/#devtool
    devtool: getDevtool(options.devtool, ctx),
    // webpack can compile for multiple environments or targets.
    // to understand what a target is in detail: https://webpack.js.org/concepts/targets/
    target: options.target as any,
    // web script entry(ies)
    entry: getEntry(options),
    output: {
      // The build folder.
      path: path.join(options.cwd, "./build/"),
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: ctx.isEnvDevelopment,
      // There will be one main bundle, and one file per asynchronous chunk.
      // In development, it does not produce real files.
      filename: path.join(options?.folders?.script ?? "", "[name].js"),
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: path.join(options?.folders?.script ?? "", "[name].[chunkhash:8].chunk.js"),
      // webpack uses `publicPath` to determine where the app is being served from.
      // It requires a trailing slash, or the file assets will get an incorrect path.
      // We inferred the "public path" (such as / or /my-project) from homepage.
      publicPath: getPublicPath(),
      // Prevents conflicts when multiple webpack runtimes (from different apps)
      // are used on the same page.
      jsonpFunction: `webpackJsonp_${ctx?.project?.name || "dn-middleware-webpack5"}`,
      // this defaults to 'window', but by setting it to 'this' then
      // module chunks which are built will work in web workers as well.
      globalObject: "this",
      // User output option
      ...(options.output as any),
    },
    module: webpackModule,
    plugins: getPlugins(options, ctx).filter(Boolean),
    resolve: {
      alias: {
        // Allows for better profiling with ReactDevTools
        ...(options.profiling && {
          "react-dom$": "react-dom/profiling",
          // This is a package for cooperative scheduling in a browser environment. It is currently used internally by React, but we plan to make it more generic.
          // https://www.npmjs.com/package/scheduler
          "scheduler/tracing": "scheduler/tracing-profiling",
        }),
        ...options.alias,
      },
      // Enable resolving symlinks to the original location.
      symlinks: true,
      modules: [
        "node_modules",
        path.resolve(ctx.cwd, "./node_modules/"),
        path.resolve(__dirname, "../node_modules/"),
        ctx.cwd,
        path.resolve(__dirname, "../"),
      ],
      extensions: [".js", ".mjs", ".json", ".jsx", ".css", ".less", ".scss", ".sass"].concat(
        ctx.useTypeScript ? [".ts", ".tsx"] : [],
      ),
      // Use tsconfig.paths as webpack alias
      plugins: [ctx.useTypeScript && new TsconfigPathsPlugin()].filter(Boolean),
    },
    // Some libraries import Node modules but don't use them in the browser.
    // Tell webpack to provide empty mocks for them so importing them works.
    // webpack@v5 make some changes, see: https://webpack.js.org/migrate/5/#test-webpack-5-compatibility
    node: {
      // TODO: node
    },
    // Turn off performance processing because we utilize
    // our own hints via the FileSizeReporter
    performance: options.performanceConfig,
    optimization: {
      minimize: ctx.isEnvProduction,
      // TODO: splitChunks
      // TODO: minimizer
      // Keep the runtime chunk separated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      // https://github.com/facebook/create-react-app/issues/5358
      // runtimeChunk: {
      //   name: (entrypoint: any) => `runtime-${entrypoint?.name}`,
      // },
    },
  };
  return config;
};
