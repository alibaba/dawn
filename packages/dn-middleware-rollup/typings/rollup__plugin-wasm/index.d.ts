declare module "@rollup/plugin-wasm" {
  import { Plugin } from "rollup";

  export interface IWasmPluginOptions {
    sync?: string[];
  }
  function wasm(options?: IWasmPluginOptions): Plugin;
  export default wasm;
}
