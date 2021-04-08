declare module "rollup-plugin-visualizer" {
  import { Plugin } from "rollup";

  export interface IVisualizerPluginOptions {
    filename?: string;
    title?: string;
    sourcemap?: boolean;
    open?: boolean;
    template?: string;
    bundlesRelative?: boolean;
    gzipSize?: boolean;
  }
  function visualizer(options?: IVisualizerPluginOptions): Plugin;
  export default visualizer;
}
