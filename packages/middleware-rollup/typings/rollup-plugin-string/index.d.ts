declare module "rollup-plugin-string" {
  import { Plugin } from "rollup";

  export interface IStringPluginOptions {
    exclude?: string | string[];
    include?: string | string[];
  }
  export function string(options?: IStringPluginOptions): Plugin;
}
