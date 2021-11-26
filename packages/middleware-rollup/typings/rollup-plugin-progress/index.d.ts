declare module "rollup-plugin-progress" {
  import { Plugin } from "rollup";

  export interface IProgressPluginOptions {
    clearLine?: boolean;
  }
  declare function progress(options?: IProgressPluginOptions): Plugin;

  export default progress;
}
