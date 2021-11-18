import * as Dawn from "@dawnjs/types";
import { DevTool } from "webpack-chain";
import { Configuration as ServerConfiguration } from "webpack-dev-server";
import { Options as EslintWebpackPluginOptions } from "eslint-webpack-plugin";

export type Env = "development" | "production";
export interface FileInfo {
  name: string;
  file: string;
}
export interface Output {
  [key: string]: any;
  path: string;
  chunkFilename?: string | ((pathData: any, assetInfo: any) => string);
  library?: string | string[] | Library;
}
export interface Library {
  type?: string;
  name?: string | string[] | { amd?: string; commonjs?: string; root?: string | string[] };
}
export interface Folders {
  script?: string;
  style?: string;
  media?: string;
  html?: string;

  /**
   * @deprecated Use `script` instead
   */
  js?: string;

  /**
   * @deprecated Use `style` instead
   */
  css?: string;

  /**
   * @deprecated Use `media` instead
   */
  img?: string;
}

export interface IOpts {
  /**
   * Custom configration file path
   */
  configFile?: string;

  /**
   * Use webpack-chain's Config instance for custorm config file
   */
  chainable?: boolean;

  /**
   * Bundling environment
   */
  env?: Env;

  /**
   * Custom current working directory
   */
  cwd?: string;

  /**
   * Entry name and file
   */
  entry?: string | string[] | Record<string, string>;

  /**
   * File(s) prepended to all entries
   */
  inject?: string | string[];

  /**
   * File(s) appended to all entries
   */
  append?: string | string[];

  /**
   * Reference to https://webpack.js.org/configuration/output/
   */
  output?: string | Output;

  /**
   * @deprecated Use output.chunkFilename instead
   */
  chunkFilename?: string;

  /**
   * Specify output folders for different asset type separately
   */
  folders?: Folders;

  /**
   * Manually set publicPath
   * @deprecated Use output.publicPath instead
   */
  publicPath?: string;

  /**
   * Explicitly disable dynamic publichPath feature
   */
  disableDynamicPublicPath?: boolean;

  /**
   * Template path map
   */
  template?: string | Record<string, string> | string[] | boolean;

  /**
   * Reference to https://webpack.js.org/configuration/target/
   */
  target?: string | string[] | false;

  /**
   * Whether enable externals or not
   */
  external?: boolean;

  /**
   * Reference to https://webpack.js.org/configuration/externals/
   */
  externals?: Record<string, any>;

  /**
   * Reference to https://webpack.js.org/configuration/resolve/#resolvealias
   */
  alias?: Record<string, string>;

  /**
   * Reference to https://github.com/dividab/tsconfig-paths-webpack-plugin#options
   */
  tsconfigPathsPlugin?: Record<string, any>;

  /**
   * Reference to https://webpack.js.org/configuration/devtool/#devtool
   */
  devtool?: DevTool;

  /**
   * @deprecated Use devtool instead
   */
  sourceMap?: DevTool;

  /**
   * Config for whether using common chunk and set common chunk's name
   */
  common?: {
    disabled?: boolean;
    name?: string;
  };

  /**
   * Whether minimize code or not, default true in production
   */
  compress?: boolean;

  /**
   * Enable esbuild-loader to replace babel-loader or ts-loader
   * Enable esbuild-loader to replace terser-webpack-plugin and css-minimizer-webpack-plugin
   */
  esbuild?: {
    /**
     * Reference to https://github.com/privatenumber/esbuild-loader#loader
     */
    loader?: boolean | object;
    /**
     * Reference to https://github.com/privatenumber/esbuild-loader#minifyplugin
     */
    minify?: boolean | object;
  };

  /**
   * Enable swc-loader instead of babel-loader
   */
  swc?: boolean | Record<string, any>;

  /**
   * Reference to https://github.com/webpack-contrib/terser-webpack-plugin#options
   */
  terser?: Record<string, any>;

  /**
   * Reference to https://github.com/webpack-contrib/css-minimizer-webpack-plugin#options
   */
  cssMinimizer?: Record<string, any>;

  /**
   * Reference to https://webpack.js.org/configuration/optimization/
   */
  optimization?: Record<string, any>;

  /**
   * Ignore moment locale
   */
  ignoreMomentLocale?: boolean;

  /**
   * Several babel options
   */
  babel?: {
    runtimeHelpers?: boolean | string;
    corejs?: false | 2 | 3 | { version: 2 | 3; proposals: boolean };
    extraBabelPresets?: any[];
    extraBabelPlugins?: any[];
    extraBabelIncludes?: any[];
    ie11Incompatible?: boolean;
    jsxRuntime?: boolean;
    pragma?: string;
    pragmaFrag?: string;
    disableAutoReactRequire?: boolean;
  };

  /**
   * @deprecated Use babel.jsxRuntime instead
   */
  jsxRuntime?: boolean;

  /**
   * Disable type check for typescript
   */
  disabledTypeCheck?: boolean;

  /**
   * Glob patterns for files that needs to check type
   */
  typeCheckInclude?: string[];

  /**
   * Determine use style-loader or extract css, default to `true` in development and `false` in production
   */
  injectCSS?: boolean;

  /**
   * Reference to https://github.com/webpack-contrib/style-loader#options
   * Reference to https://github.com/webpack-contrib/mini-css-extract-plugin#loader-options
   */
  styleLoader?: Record<string, any>;

  /**
   * Reference to https://github.com/webpack-contrib/css-loader#options
   */
  cssLoader?: Record<string, any>;

  /**
   * @deprecated Use cssLoader.modules instead
   */
  cssModules?: boolean | Record<string, any>;

  /**
   * Reference to https://github.com/webpack-contrib/postcss-loader#options
   */
  postcssLoader?: Record<string, any>;

  /**
   * Extra PostCSS plugins
   */
  extraPostCSSPlugins?: any[];

  /**
   * Reference to https://github.com/csstools/postcss-preset-env#options
   */
  postcssPresetEnv?: Record<string, any>;

  /**
   * @deprecated Use postcssPresetEnv.autoprefixer instead
   */
  autoprefixer?: false | Record<string, any>;

  /**
   * Reference to https://github.com/webpack-contrib/less-loader#options
   */
  lessLoader?: Record<string, any>;

  /**
   * Reference to https://github.com/bholloway/resolve-url-loader/blob/master/packages/resolve-url-loader/README.md#options
   */
  resolveUrlLoader?: Record<string, any>;

  /**
   * Reference to https://github.com/webpack-contrib/sass-loader#options
   */
  sassLoader?: Record<string, any>;

  /**
   * Reference to https://github.com/webpack-contrib/worker-loader#options
   */
  workerLoader?: Record<string, any>;

  /**
   * Specify virtual config module options
   */
  config?: {
    name?: string; // config moduleName
    path?: string; // config file path
    env?: string;
    content?: any; // set whole content
  };

  /**
   * Enable all profile options
   */
  profile?: boolean;

  /**
   * Reference to https://webpack.js.org/configuration/stats/
   */
  statsOpts?: string | Record<string, any>;

  /**
   * Reference to https://github.com/webpack-contrib/webpack-bundle-analyzer#options-for-plugin
   */
  analysis?: boolean | Record<string, any>;

  /**
   * Enable webpack watch mode
   */
  watch?: boolean;

  /**
   * Reference to https://webpack.js.org/configuration/watch/#watchoptions
   */
  watchOpts?: Record<string, any>;

  /**
   * Enable webpack dev server
   */
  server?: boolean;

  /**
   * Reference to https://webpack.js.org/configuration/dev-server/#devserver
   */
  serverOpts?: ServerConfiguration;

  /**
   * Enable ESLint in server mode, see https://github.com/webpack-contrib/eslint-webpack-plugin#options
   */
  lint?: boolean | EslintWebpackPluginOptions;
}

export interface INormalizedOpts extends Omit<IOpts, "entry" | "template" | "inject" | "append" | "output"> {
  entry: FileInfo[];
  template: FileInfo[];
  inject: string[];
  append: string[];
  output: Output;
}

export type Handler = Dawn.Handler<Partial<IOpts>>;
export type Context = Dawn.Context<Partial<IOpts>>;
