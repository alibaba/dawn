declare module "@rollup/plugin-html" {
  import { Plugin } from "rollup";

  export interface IHtmlPluginAttributes {
    html: Record<string, any>;
    link: Record<string, any>;
    script: Record<string, any>;
  }
  export interface IHtmlPluginTemplateFunctionArgument {
    attributes: IHtmlPluginAttributes;
    files: {
      js: Array<{ fileName: string }>;
      css: Array<{ fileName: string }>;
    };
    meta: Array<Record<string, any>>;
    publicPath: string;
    title: string;
  }
  export interface IHtmlPluginOptions {
    attributes?: IHtmlPluginAttributes;
    fileName?: string;
    meta?: Array<Record<string, any>>;
    publicPath?: string;
    template?: (opts: IHtmlPluginTemplateFunctionArgument) => string | Promise<string>;
    title?: string;
  }

  export function makeHtmlAttributes(attributes: Record<string, any>): string;

  function html(options?: IHtmlPluginOptions): Plugin;
  export default html;
}
