import { ModuleFormat } from "rollup";
import { Options as IAutoprefixerOptions } from "autoprefixer";
import { Alias } from "@rollup/plugin-alias";
import { Options as TerserOptions } from "rollup-plugin-terser";

type LogFN = (message?: any, ...optionalParams: any[]) => void;

export interface IDawnConsole {
  log: LogFN;
  info: LogFN;
  error: LogFN;
  debug: LogFN;
  warn: LogFN;
}

export interface IDawnContext {
  cwd: string;
  console: IDawnConsole;
  emit?: (eventName: string, ...eventParams: any[]) => void;
  utils: {
    sleep: (ms: number) => Promise<void>;
    stp: (strTmpl: string, data: Record<string, any>) => string;
  };
}

export interface IPkg {
  name?: string;
  main?: string;
  "jsnext:main"?: string;
  module?: string;
  browser?: string;
  dependencies?: Record<string, any>;
  peerDependencies?: Record<string, any>;
}

export interface IBundleOutput {
  file?: string;
}

export interface ICjs extends IBundleOutput {
  minify?: boolean;
}

export interface IEsm extends IBundleOutput {
  mjs?: boolean;
  minify?: boolean;
}

export interface IUmd extends IBundleOutput {
  globals?: Record<string, string>;
  name?: string;
  minFile?: boolean;
  sourcemap?: boolean;
  template?: string;
}

export interface IBundleOptions {
  target?: "node" | "browser";
  entry?: string | string[];
  outDir?: string;
  file?: string;
  esm?: IEsm | false;
  cjs?: ICjs | false;
  umd?: IUmd | false;
  extractCSS?: boolean;
  injectCSS?: boolean;
  cssModules?: boolean | Record<string, any>;
  less?: Record<string, any>;
  sass?: Record<string, any>;
  autoprefixer?: IAutoprefixerOptions;
  runtimeHelpers?: boolean;
  extraBabelPresets?: any[];
  extraBabelPlugins?: any[];
  disableTypeCheck?: boolean;
  typescript?: Record<string, any>;
  nodeResolve?: Record<string, any>;
  extraExternals?: string[];
  externalsExclude?: string[];
  alias?: Record<string, string> | Alias[];
  inject?: Record<string, any>;
  replace?: Record<string, any>;
  include?: string | RegExp;
  namedExports?: Record<string, string[]>;
  terser?: TerserOptions;
  nodeVersion?: number;
  wasm?: boolean | Record<string, any>;
}

export interface IOpts {
  cwd?: string;
  watch?: boolean;
  bundleOpts?: IBundleOptions;
  fullCustom?: boolean;
  configFile?: string;
  analysis?: boolean;
}

export interface IRollupOpts {
  cwd: string;
  entry: string | string[];
  type: ModuleFormat;
  bundleOpts: IBundleOptions;
  watch?: boolean;
  configFile?: string;
  analysis?: boolean;
}

export interface IGetRollupConfigOpts {
  cwd: string;
  entry: string;
  type: ModuleFormat;
  bundleOpts: IBundleOptions;
  analysis?: boolean;
}

export interface IGetBabelConfigOpts {
  target: "browser" | "node";
  type?: ModuleFormat;
  typescript?: boolean;
  runtimeHelpers?: boolean;
  nodeVersion?: number;
}
