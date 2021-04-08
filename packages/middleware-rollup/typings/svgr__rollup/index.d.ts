declare module "@svgr/rollup" {
  import { Plugin } from "rollup";

  export interface ISvgrPluginOptions {
    include?: string;
    exclude: string;
    babel: boolean;
  }

  function svgr(options?: ISvgrPluginOptions): Plugin;
  export default svgr;
}
