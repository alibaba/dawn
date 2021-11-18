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
import { RollupEslintOptions } from "@rollup/plugin-eslint";
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
  onlyMinFile?: boolean;
  sourcemap?: boolean | "inline" | "hidden";
  template?: false | string;
}

export interface ISystemJS extends IBundleOptions {
  minify?: boolean;
  sourcemap?: boolean | "inline" | "hidden";
  globals?: Record<string, string>;
  name?: string;
}

export interface IIIFE extends IBundleOptions {
  minify?: boolean;
  sourcemap?: boolean | "inline" | "hidden";
  globals?: Record<string, string>;
}

export interface IBundleOptions {
  target?: "node" | "browser";
  entry?: string | string[];
  outDir?: string;
  file?: string | Record<string, string>;
  esm?: IEsm | false;
  cjs?: ICjs | false;
  umd?: IUmd | false;
  system?: ISystemJS | false;
  iife?: IIIFE | false;
  extractCSS?: boolean | string;
  injectCSS?: boolean | Record<string, any>;
  cssModules?: boolean | Record<string, any>;
  less?: Record<string, any>;
  sass?: Record<string, any>;
  autoprefixer?: AutoprefixerOptions;
  runtimeHelpers?: boolean | string;
  corejs?: false | 2 | 3 | { version: 2 | 3; proposals: boolean };
  jsxRuntime?: "classic" | "automatic";
  pragma?: string;
  pragmaFrag?: string;
  disableAutoReactRequire?: boolean;
  nodeVersion?: string | "current" | true;
  extraBabelPresets?: any[];
  extraBabelPlugins?: any[];
  babelExclude?: string | RegExp | Array<string | RegExp>;
  babelInclude?: string | RegExp | Array<string | RegExp>;
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
  lint?: boolean | RollupEslintOptions;
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
  type: "cjs" | "esm" | "umd" | "system" | "iife";
  bundleOpts: IBundleOptions;
  watch?: boolean;
  configFile?: string;
  analysis?: boolean;
}

export interface IGetRollupConfigOpts {
  cwd: string;
  entry: string;
  type: "cjs" | "esm" | "umd" | "system" | "iife";
  bundleOpts: IBundleOptions;
  analysis?: boolean;
}

export interface IGetBabelConfigOpts {
  target: "browser" | "node";
  type?: "cjs" | "esm" | "umd" | "system" | "iife";
  typescript?: boolean;
  runtimeHelpers?: boolean;
  nodeVersion?: number;
}
