import { TransformOptions } from "@babel/core";
import { IGetBabelConfigOpts } from "./types";
import { hasJsxRuntime } from "./utils";

export const getBabelConfig = (opts: IGetBabelConfigOpts): Pick<TransformOptions, "presets" | "plugins"> => {
  const {
    env,
    target,
    typescript,
    type,
    runtimeHelpers,
    corejs,
    jsxRuntime,
    pragma,
    pragmaFrag,
    disableAutoReactRequire,
    nodeVersion,
  } = opts;
  const isBrowser = target === "browser";
  const targets = isBrowser ? undefined : { node: nodeVersion || "10" };

  return {
    presets: [
      [
        require.resolve("@dawnjs/babel-preset-dawn"),
        {
          typescript,
          env: { targets, modules: type === "esm" ? false : "auto" },
          react: isBrowser
            ? {
                development: env === "development",
                runtime: hasJsxRuntime() ? jsxRuntime || "classic" : "classic",
                pragma,
                pragmaFrag,
              }
            : false,
          reactRequire: !(disableAutoReactRequire === true || (jsxRuntime === "automatic" && hasJsxRuntime())),
          transformRuntime: runtimeHelpers
            ? {
                useESModules: isBrowser && type === "esm",
                corejs,
                ...(typeof runtimeHelpers === "string" ? { version: runtimeHelpers } : {}),
              }
            : undefined,
        },
      ],
    ],
    plugins: [],
  };
};
