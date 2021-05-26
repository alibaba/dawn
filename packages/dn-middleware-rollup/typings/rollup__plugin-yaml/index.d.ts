declare module "@rollup/plugin-yaml" {
  import { Plugin } from "rollup";

  export interface IYamlPluginOptions {
    documentMode?: "single" | "multi";
    exclude?: string | string[];
    include?: string | string[];
    safe?: boolean;
    transform?: (data: any) => any;
  }
  function yaml(options?: IYamlPluginOptions): Plugin;
  export default yaml;
}
