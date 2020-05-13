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
  runtimeHelpers?: boolean;
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
  runtimeHelpers?: boolean;
  nodeVersion?: number;
  lazy?: boolean;
}
