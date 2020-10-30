import type { Configuration } from "webpack/types.d";

export type Env = "development" | "production";
export type Devtool = boolean | string;
export type FileInfo = { name: string; file: string };
export type Entry = string | Record<string, string> | string[] | Array<FileInfo>;
export type Template = string | Record<string, string> | string[] | Array<FileInfo>;
export type Output =
  | string
  | {
      [key: string]: any;
      path: string;
      library?: Library;
    };
type Library = {
  type?: string;
  name?: string;
}
export interface Folders {
  script?: string;
  style?: string;
  media?: string;
  html?: string;
}

export interface IOptimization {
  // Tell webpack to minimize the bundle using the TerserPlugin or the plugin(s) specified in optimization.minimizer.
  minimize?: Boolean;
  // minimizer?: any;
  splitChunks?: object;
  // tells webpack whether to conduct inner graph analysis for unused exports.
  innerGraph?: boolean;
  [key: string]: any;
}

interface ICommonOptionV3 {
  disabled?: Boolean;
  name?: string;
}

interface IBabel {
  runtimeHelpers?: boolean | string;
  corejs?: false | 2 | 3 | { version: 2 | 3; proposals: boolean };
  nodeVersion?: string | "current" | true;
  extraBabelPresets?: any[];
  extraBabelPlugins?: any[];
}

interface IModeleFederation {
  name?: string;
  remotes?: object;
  exposes?: object;
  shared?: string[];
  [key: string]: any;
}
export interface IOpts {
  configFile?: string;
  cwd?: string;
  env: Env;
  entry?: Entry;
  output?: Output;
  publicPath?: string;
  template?: Template;
  inject?: string | string[];
  append?: string | string[];
  devtool?: Devtool; // sourcemap
  performance?: boolean | "warning" | "error";
  target?: "browser" | "node" | "webworker" | string | [string, ...string[]];
  externals?: object;
  // moduleFederation configs
  // https://webpack.docschina.org/concepts/module-federation/
  moduleFederation?: IModeleFederation;
  analysis?: boolean | object; // analysis mode
  // https://webpack.js.org/configuration/resolve/#resolvealias
  alias?: Record<string, string>;
  profiling?: boolean;
  folders?: Folders;
  injectCSS?: boolean;
  cache?: object;

  // optimization
  // https://webpack.js.org/configuration/optimization/
  optimization?: IOptimization;
  // tsc still compile when error
  tscCompileOnError?: boolean;

  // use css Modules
  cssModules?: boolean;
  // babel
  babel?: IBabel;

  // fast refresh/HMR
  hot?: boolean;

  // BC dn-m-webpack4
  // BC dn-m-webpack3
  sourceMap?: Devtool;
  common?: ICommonOptionV3; // optimization options
  external?: boolean; // external or not
  chunkFilename?: string; // output.chunkFilename
  js?: string;
  css?: string;
  font?: string;
  img?: string;
  html?: string;
  // default true when in envProduction;
  compress?: boolean;
  watch?: boolean;
  watchOpts?: object;
}

interface PerformanceOpts {
  hints: false | "error" | "warning";
}

export interface IGetWebpackConfigOpts extends IOpts {
  entry?: Array<{ name: string; file: string }>;
  template?: Array<{ name: string; file: string }>;
  performanceConfig?: false | PerformanceOpts;

  // configurations
  // loader options
  // UrlLoader: https://github.com/webpack-contrib/url-loader
  urlLoader?: object;
  styleLoader?: object;
  cssLoader?: object;
  // FileLoader: https://github.com/webpack-contrib/file-loader
  fileLoader?: object;
}

export interface CompilerCreaterOpts {
  config: Configuration;
  useTypeScript: Boolean;
  tscCompileOnError: Boolean;
}
