export type Env = "development" | "production";
export type Devtool = boolean | string;
export type Entry = string | Record<string, string> | string[] | Array<{ name: string; file: string }>;
export type Template = string | Record<string, string> | string[] | Array<{ name: string; file: string }>;

export interface IOpts {
  cwd?: string;
  env: Env;
  inject?: string | string[];
  append?: string | string[];
  entry: Entry;
  template: Template;
  devtool: Devtool; // sourcemap

  // plugin options
  // HtmlWebpackPlugin: https://github.com/jantimon/html-webpack-plugin#options
  html?: object;
  // HTMLMinifier: https://github.com/DanielRuf/html-minifier-terser
  htmlMinifier?: boolean | object;
}

export interface IGetWebpackConfigOpts extends IOpts {
  entry: Array<{ name: string; file: string }>;
  template: Array<{ name: string; file: string }>;
}
