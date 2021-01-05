import * as path from "path";
import * as Dawn from "@dawnjs/types";
// import getCSSModuleLocalIdent from "react-dev-utils/getCSSModuleLocalIdent";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import type { ModuleOptions, RuleSetRule } from "webpack/types.d";
import { IGetWebpackConfigOpts } from "../types";
import { getPublicPath } from "./utils";

// common function to get style loaders
const getStyleLoaders = (
  options: {
    cssOptions?: object;
    preProcessor?: string;
    preProcessorOptions?: object;
    styleOptions?: object;
  },
  ctx: Dawn.Context,
) => {
  const loaders = [
    ctx.injectCSS
      ? require.resolve("style-loader")
      : {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: getPublicPath(ctx),
            ...options.styleOptions,
          },
        },
    {
      loader: require.resolve("css-loader"),
      options: {
        sourceMap: ctx.isEnvDevelopment,
        ...options.cssOptions,
      },
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in package.json
      loader: require.resolve("postcss-loader"),
      options: {
        postcssOptions: {
          plugins: [
            [
              "postcss-preset-env",
              {
                autoprefixer: { flexbox: "no-2009" },
                stage: 3,
              },
            ],
            // Adds PostCSS Normalize as the reset css with default options,
            // so that it honors browserslist config in package.json
            // which in turn let's users customize the target behavior as per their needs.
            // "postcss-normalize",
          ],
        },
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
// Well-written modules provide solid abstractions and encapsulation boundaries,
// so that each module has a coherent design and a clear purpose within the overall application.
const getModule = async (options: IGetWebpackConfigOpts, ctx: Dawn.Context) => {
  const webpackModule: ModuleOptions = {};
  const { babelOpts } = await ctx.exec({
    env: options.env,
    name: "babel",
    noEmit: true,
    cwd: options.cwd,
    target: Array.isArray(options.target)
      ? options.target
      : ["web", "browser"].includes(options.target)
      ? "browser"
      : "node",
    type: "cjs",
    // fast-refresh now because of an error of its plugin
    // extraPlugins: [...(options.hot ? ["react-hot-loader/babel", "react-refresh/babel"] : [])],
    jsxRuntime: options.jsxRuntime,
    ...options.babel,
  });

  const rules: RuleSetRule[] = [
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
            name: path.join(options?.folders?.media ?? "", "[name].[contenthash:8].[ext]"),
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
        // In production, we use MiniCSSExtractPlugin to extract that CSS to a file,
        // but in development "style" loader enables hot editing of CSS.
        // By default we support CSS Modules with the extension .module.css
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: getStyleLoaders(
            {
              cssOptions: {
                importLoaders: 1,
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
                modules: true,
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
                ...options.cssLoader,
              },
              styleOptions: options.styleLoader,
              preProcessor: "less-loader",
              preProcessorOptions: {
                javascriptEnabled: true,
              },
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
                modules: true,
                ...options.cssLoader,
              },
              styleOptions: options.styleLoader,
              preProcessor: "less-loader",
              preProcessorOptions: {
                javascriptEnabled: true,
              },
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
            name: path.join(options?.folders?.media ?? "", "[name].[contenthash:8].[ext]"),
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

export default getModule;
