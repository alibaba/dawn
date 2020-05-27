import { Context } from "@dawnjs/types";

export type IDawnContext = Context<IOpts>;

export interface IOpts {
  cwd?: string;
  watch?: boolean;
  type?: "esm" | "cjs";
  srcDir?: string;
  include: string[];
  exclude: string[];
  output?: string;
  target?: "browser" | "node";
  useBuiltins?: "usage" | "entry" | false;
  runtimeHelpers?: boolean | string;
  corejs?: false | 2 | 3 | { version: 2 | 3; proposals: boolean };
  extraPresets?: any[];
  extraPlugins?: any[];
  nodeVersion?: string | "current" | true;
  disableTypeCheck?: boolean;
  lazy?: boolean;
  noEmit?: boolean;
}

export interface IGetBabelConfigOpts {
  target: "browser" | "node";
  type?: "esm" | "cjs";
  typescript?: boolean;
  useBuiltins?: "usage" | "entry" | false;
  runtimeHelpers?: boolean | string;
  corejs?: false | 2 | 3 | { version: 2 | 3; proposals: boolean };
  nodeVersion?: number;
  lazy?: boolean;
}
