declare module "@rollup/plugin-babel" {
  import { Plugin } from "rollup";
  import { TransformOptions } from "@babel/core";

  export interface IBabelPluginOptions extends TransformOptions {
    exclude?: string | RegExp | Array<string | RegExp>;
    include?: string | RegExp | Array<string | RegExp>;
    extensions?: string[];
    babelHelpers?: "bundled" | "runtime" | "inline" | "external";
    skipPreflightCheck?: boolean;
  }
  function babel(options?: IBabelPluginOptions): Plugin;
  export default babel;
}
