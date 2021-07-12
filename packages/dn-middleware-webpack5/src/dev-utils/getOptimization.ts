import * as Dawn from "@dawnjs/types";
import { ESBuildMinifyPlugin } from "esbuild-loader";

import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import { IGetWebpackConfigOpts, IOptimization } from "../types";

// common function to get style loaders
const getOptimization = (options: IGetWebpackConfigOpts, ctx: Dawn.Context) => {
  const { optimization, common } = options;
  const optimizationConfig: IOptimization = {
    minimize: options.compress,
    minimizer: [
      options?.esbuild?.minify
        ? new ESBuildMinifyPlugin(typeof options?.esbuild?.minify === "object" ? options?.esbuild?.minify : undefined)
        : new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true,
              },
              output: {
                comments: false,
              },
              ...(options?.terser?.terserOptions ? options?.terser?.terserOptions : {}),
            },
            extractComments: false,
          }),
      ,
      new CssMinimizerPlugin(),
    ].filter(Boolean),
    splitChunks: {
      chunks: "all",
      // It is recommended to set splitChunks.name to false for production builds
      // so that it doesn't change names unnecessarily.
      name: !ctx.isEnvProduction,
    },
    // default true when in production
    innerGraph: ctx.isEnvProduction,
    sideEffects: true,

    // Keep the runtime chunk separated to enable long term caching
    // https://twitter.com/wSokra/status/969679223278505985
    // https://github.com/facebook/create-react-app/issues/5358
    // runtimeChunk: {
    //   name: (entrypoint: any) => `runtime-${entrypoint?.name}`,
    // },
  };

  if (common?.disabled) {
    optimizationConfig.splitChunks = {
      minChunks: 100000,
    };
  } else {
    optimizationConfig.splitChunks = {
      cacheGroups: {
        // 打包公共模块
        [common?.name]: {
          test(module: any) {
            return (
              module.type !== "css/mini-extract" && module.resource && module.resource.indexOf("node_modules") !== -1
            );
          },
          name: common?.name,
          chunks: "all",
        },
        default: false, // 取消默认default打包
      },
    };
  }
  // New algorithms were added for long term caching in webpack5.
  // These are enabled by default in production mode.
  // chunkIds: "deterministic" moduleIds: "deterministic" mangleExports: "deterministic"

  // moduleIds/chunkIds/mangleExports: false disables the default behavior.
  // Note that in webpack 5 you must provide a custom plugin(webpack.ids.DeterministicModuleIdsPlugin).
  return {
    ...optimizationConfig,
    ...optimization,
  };
};

export default getOptimization;
