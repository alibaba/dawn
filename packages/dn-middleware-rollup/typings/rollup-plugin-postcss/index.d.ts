declare module "rollup-plugin-postcss" {
  import { Plugin } from "rollup";
  import { CssNanoOptions } from "cssnano";

  interface PostCssPluginOptions {
    extensions?: string[];
    plugins?: any[];
    inject?:
      | boolean
      | {
          insertAt?: "top" | string;
        };
    extract?: boolean | string;
    modules?: boolean | unknown;
    autoModules?: boolean;
    minimize?: boolean | CssNanoOptions;
    sourceMap?: boolean | "inline";
    exec?: boolean;
    config?:
      | boolean
      | {
          path?: string;
          ctx?: Record<string, any>;
        };
    name?: any[] | any[][];
    loaders?: any[];
    use?:
      | string[]
      | Array<[string, Record<string, any>]>
      | { sass?: Record<string, any>; stylus?: Record<string, any>; less?: Record<string, any> };
    namedExports?(...args: any[]): void | boolean;
    parser?(...args: any[]): void | string;
    syntax?(...args: any[]): void | string;
    stringifier?(...args: any[]): void | string;
    onImport?(id: any): void;
  }

  function postcss(options?: PostCssPluginOptions): Plugin;
  export default postcss;
}
