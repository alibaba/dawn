export type Env = "development" | "production";
export type Devtool = boolean | string;
export type Entry = string | Record<string, string> | string[] | Array<{ name: string; file: string }>;
export type Template = string | Record<string, string> | string[] | Array<{ name: string; file: string }>;
export type Output =
  | string
  | {
      path: string;
    };

export interface IOpts {
  cwd?: string;
  env: Env;
  inject?: string | string[];
  append?: string | string[];
  entry?: Entry;
  output?: Output;
  template?: Template;
  devtool?: Devtool; // sourcemap
  performance?: boolean | "warning" | "error";
  target?: "browser" | "node" | "webworker" | string;

  // plugin options
  // HtmlWebpackPlugin: https://github.com/jantimon/html-webpack-plugin#options
  html?: object;
  // HTMLMinifier: https://github.com/DanielRuf/html-minifier-terser
  htmlMinifier?: boolean | object;

  // loader options
  // UrlLoader: https://github.com/webpack-contrib/url-loader
  urlLoader?: object;
  // FileLoader: https://github.com/webpack-contrib/file-loader
  fileLoader?: object;

  // babel
  runtimeHelpers?: boolean | string;
  corejs?: false | 2 | 3 | { version: 2 | 3; proposals: boolean };
  nodeVersion?: string | "current" | true;
  extraBabelPresets?: any[];
  extraBabelPlugins?: any[];
}

export interface IGetWebpackConfigOpts extends IOpts {
  entry?: Array<{ name: string; file: string }>;
  template?: Array<{ name: string; file: string }>;
  performanceConfig?: object;
}
