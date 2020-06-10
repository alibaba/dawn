import { Options as AutoprefixerOptions } from "autoprefixer";
import { RPT2Options as RollupTypescript2Options } from "rollup-plugin-typescript2";
import { RollupNodeResolveOptions } from "@rollup/plugin-node-resolve";
import { Alias } from "@rollup/plugin-alias";
import { RollupInjectOptions } from "@rollup/plugin-inject";
import { RollupReplaceOptions } from "@rollup/plugin-replace";
import { Options as RollupTerserOptions } from "rollup-plugin-terser";
import { RollupCommonJSOptions } from "@rollup/plugin-commonjs";
import { IHtmlPluginOptions } from "@rollup/plugin-html";
import { RollupJsonOptions } from "@rollup/plugin-json";
import { IYamlPluginOptions } from "@rollup/plugin-yaml";
import { RollupWasmOptions } from "@rollup/plugin-wasm";
import { Context } from "@dawnjs/types";

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
  sourcemap?: boolean | "inline" | "hidden";
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
  extractCSS?: boolean | string;
  injectCSS?: boolean | Record<string, any>;
  cssModules?: boolean | Record<string, any>;
  less?: Record<string, any>;
  sass?: Record<string, any>;
  autoprefixer?: AutoprefixerOptions;
  runtimeHelpers?: boolean;
  corejs?: false | 2 | 3 | { version: 2 | 3; proposals: boolean };
  nodeVersion?: string | "current" | true;
  extraBabelPresets?: any[];
  extraBabelPlugins?: any[];
  disableTypeCheck?: boolean;
  typescript?: RollupTypescript2Options;
  nodeResolve?: RollupNodeResolveOptions;
  extraExternals?: string[];
  externalsExclude?: string[];
  alias?: Record<string, string> | Alias[];
  inject?: RollupInjectOptions;
  replace?: RollupReplaceOptions;
  commonjs?: RollupCommonJSOptions;
  terser?: RollupTerserOptions;
  html?: Omit<IHtmlPluginOptions, "template">;
  json?: RollupJsonOptions;
  yaml?: IYamlPluginOptions;
  wasm?: boolean | RollupWasmOptions;
}

export interface IOpts extends IBundleOptions {
  cwd?: string;
  watch?: boolean;
  fullCustom?: boolean;
  configFile?: string;
  analysis?: boolean;
}

export type IDawnContext = Context<IOpts>;

export interface IRollupOpts {
  cwd: string;
  entry: string | string[];
  type: "cjs" | "esm" | "umd";
  bundleOpts: IBundleOptions;
  watch?: boolean;
  configFile?: string;
  analysis?: boolean;
}

export interface IGetRollupConfigOpts {
  cwd: string;
  entry: string;
  type: "cjs" | "esm" | "umd";
  bundleOpts: IBundleOptions;
  analysis?: boolean;
}

export interface IGetBabelConfigOpts {
  target: "browser" | "node";
  type?: "cjs" | "esm" | "umd";
  typescript?: boolean;
  runtimeHelpers?: boolean;
  nodeVersion?: number;
}
