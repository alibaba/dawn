import { Context } from "@dawnjs/types";

export type IDawnContext = Context<IOpts>;

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
  extraPresets?: any[];
  extraPlugins?: any[];
  nodeVersion?: string | "current" | true;
  disableTypeCheck?: boolean;
  lazy?: boolean;
  noEmit?: boolean;
}

export interface IGetBabelConfigOpts {
  env?: "development" | "production";
  target: "browser" | "node";
  type?: "esm" | "cjs";
  typescript?: boolean;
  runtimeHelpers?: boolean | string;
  jsxRuntime?: "automatic" | "classic";
  corejs?: false | 2 | 3 | { version: 2 | 3; proposals: boolean };
  nodeVersion?: number;
  lazy?: boolean;
}
