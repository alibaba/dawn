declare module "@rollup/plugin-url" {
  import { Plugin } from "rollup";

  export interface IUrlPluginOptions {
    exclude?: string | string[];
    include?: string | string[];
    limit?: number;
    publicPath?: string;
    emitFiles?: boolean;
    fileName?: string;
    destDir?: string;
  }
  function url(options?: IUrlPluginOptions): Plugin;
  export default url;
}
