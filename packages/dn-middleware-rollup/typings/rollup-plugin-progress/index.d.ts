declare module "rollup-plugin-progress" {
  import { Plugin } from "rollup";

  export interface PluginProgressOptions {
    clearLine?: boolean;
  }
  function progress(options?: PluginProgressOptions): Plugin;
  export default progress;
}
