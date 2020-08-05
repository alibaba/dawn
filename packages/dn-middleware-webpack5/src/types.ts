export type Env = "development" | "production";
export type Devtool = boolean | string;
export type Entry = string | Record<string, string> | string[] | Array<{ name: string; file: string }>;
export type Template = string;

export interface IOpts {
  cwd?: string;
  env: Env;
  inject?: string | string[];
  append?: string | string[];
  entry: Entry;
  template: Template;
  // sourcemap
  devtool: Devtool;
}

export interface IGetWebpackConfigOpts extends IOpts {
  entry: Array<{ name: string; file: string }>;
}
