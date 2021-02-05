import type { Configuration } from "webpack/types.d";

export type Env = "development" | "production";
export type Devtool = boolean | string;
export interface FileInfo {
  name: string;
  file: string;
}
export type Entry = string | Record<string, string> | string[] | FileInfo[];
export type Template = string | Record<string, string> | string[] | FileInfo[] | boolean;
export type Output =
  | string
  | {
      [key: string]: any;
      path: string;
      chunkFilename?: string;
      library?: Library;
    };
interface Library {
  type?: string;
  name?: string;
}
export interface Folders {
  script?: string;
  style?: string;
  media?: string;
  html?: string;
  // v4
  js?: string;
  css?: string;
  font?: string;
  img?: string;
}

export interface IOptimization {
  // Tell webpack to minimize the bundle using the TerserPlugin or the plugin(s) specified in optimization.minimizer.
  minimize?: boolean;
  // minimizer?: any;
  splitChunks?: object;
  // tells webpack whether to conduct inner graph analysis for unused exports.
  innerGraph?: boolean;
  [key: string]: any;
}

interface ICommonOptionV3 {
  disabled?: boolean;
  name?: string;
}

interface IESBuildOptions {
  loader?: boolean | object; // TODO
  minify?: boolean | object;
}

interface IBabel {
  runtimeHelpers?: boolean | string;
  corejs?: false | 2 | 3 | { version: 2 | 3; proposals: boolean };
  nodeVersion?: string | "current" | true;
  extraBabelPresets?: any[];
  extraBabelPlugins?: any[];
  jsxRuntime?: boolean;
  pragma?: string;
  pragmaFrag?: string;
  disableAutoReactRequire?: boolean;
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
  // disabled typescript type check
  disabledTypeCheck?: boolean;

  // use css Modules
  cssModules?: boolean;
  // babel
  babel?: IBabel;
  jsxRuntime?: boolean;

  // fast refresh/HMR
  hot?: boolean;

  // BC dn-m-webpack4
  // BC dn-m-webpack3
  sourceMap?: Devtool;
  common?: ICommonOptionV3; // optimization options
  external?: boolean; // external or not
  chunkFilename?: string; // output.chunkFilename
  // default true when in envProduction;
  compress?: boolean;
  watch?: boolean;
  watchOpts?: object;
  statsOpts?: object;

  // esbuild
  esbuild?: IESBuildOptions;

  // config
  config?: IConfig;
}

interface IConfig {
  name?: string; // config moduleName
  path?: string; // config file path
  env?: string;
  content?: any; // set whole content
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
  useTypeScript: boolean;
  tscCompileOnError: boolean;
  disabledTypeCheck: boolean;
  statsOpts: object;
}
