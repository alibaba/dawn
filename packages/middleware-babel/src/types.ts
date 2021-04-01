import { TransformOptions } from "@babel/core";
import { Context } from "@dawnjs/types";

export type IDawnContext = Context<IOpts, INextArgs>;

export interface IOpts {
  env?: "development" | "production";
  cwd?: string;
  watch?: boolean;
  type?: "esm" | "cjs";
  srcDir?: string;
  include: string[];
  exclude: string[];
  output?: string;
  target?: "browser" | "node";
  runtimeHelpers?: boolean | string;
  corejs?: false | 2 | 3 | { version: 2 | 3; proposals: boolean };
  jsxRuntime?: "automatic" | "classic";
  disableAutoReactRequire?: boolean;
  pragma?: string;
  pragmaFrag?: string;
  extraPresets?: any[];
  extraPlugins?: any[];
  nodeVersion?: string | "current" | true;
  disableTypeCheck?: boolean;
  noEmit?: boolean;
}

export interface INextArgs {
  babelOpts: Pick<TransformOptions, "presets" | "plugins">;
}

export interface IGetBabelConfigOpts {
  env?: "development" | "production";
  target: "browser" | "node";
  type?: "esm" | "cjs";
  typescript?: boolean;
  runtimeHelpers?: boolean | string;
  jsxRuntime?: "automatic" | "classic";
  disableAutoReactRequire?: boolean;
  pragma?: string;
  pragmaFrag?: string;
  corejs?: false | 2 | 3 | { version: 2 | 3; proposals: boolean };
  nodeVersion?: string | "current" | true;
}
