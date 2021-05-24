import Config from "webpack-chain";
import { ESBuildMinifyPlugin } from "esbuild-loader";
import { INormalizedOpts } from "../types";
import { SWCMinifyPlugin } from "swc-webpack-plugin";

export default async (config: Config, options: INormalizedOpts) => {
  config.optimization
    .set("emitOnErrors", options.env === "development") // deprecate optimization.noEmitOnErrors in favor of optimization.emitOnErrors in webpack5
    .minimize(options.compress)
    .when(
      !!options.esbuild?.minify,
      optimization => {
        optimization.minimizer("esbuild").use(ESBuildMinifyPlugin, [
          {
            target: "es2015",
            css: true,
            ...(typeof options.esbuild?.minify === "object" ? options.esbuild?.minify : {}),
          },
        ]);
      },
      optimization => {
        optimization.when(
          !!options.swc,
          // eslint-disable-next-line @typescript-eslint/no-shadow
          optimization => {
            optimization.minimizer("swc").use(SWCMinifyPlugin, [typeof options.swc === "object" ? options.swc : {}]);
          },
          // eslint-disable-next-line @typescript-eslint/no-shadow
          optimization => {
            optimization.minimizer("terser").use(require.resolve("terser-webpack-plugin"), [
              {
                extractComments: false,
                ...options.terser,
                terserOptions: {
                  ...options.terser?.terserOptions,
                  compress: { drop_console: true, ...options.terser?.terserOptions?.compress },
                  format: { comments: false, ...options.terser?.terserOptions?.format },
                },
              },
            ]);
          },
        );

        optimization.minimizer("css").use(require.resolve("css-minimizer-webpack-plugin"), [
          {
            ...options.cssMinimizer,
            minimizerOptions: {
              preset: ["default", { discardComments: { removeAll: true } }],
              ...options.cssMinimizer?.minimizerOptions,
            },
          },
        ]);
      },
    )
    .splitChunks({ cacheGroups: { default: false } })
    .when(!options.common.disabled, optimization => {
      optimization.merge({
        splitChunks: {
          cacheGroups: {
            [options.common.name]: {
              name: options.common.name,
              chunks: "all",
              test: (module: any) =>
                module.type !== "css/mini-extract" && module.resource?.indexOf("node_modules") !== -1,
            },
          },
        },
      });
    })
    .merge(options.optimization || {});
};
