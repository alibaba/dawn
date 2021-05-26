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
    lazy,
  } = opts;
  const isBrowser = target === "browser";
  const targets = isBrowser ? undefined : { node: nodeVersion || "10" };

  return {
    presets: [
      ...(typescript ? [require.resolve("@babel/preset-typescript")] : []),
      [
        require.resolve("@babel/preset-env"),
        {
          targets,
          modules: type === "esm" ? false : "auto",
        },
      ],
      ...(isBrowser
        ? [
            [
              require.resolve("@babel/preset-react"),
              {
                development: env === "development",
                runtime: hasJsxRuntime() ? jsxRuntime || "classic" : "classic",
                pragma,
                pragmaFrag,
              },
            ],
          ]
        : []),
    ],
    plugins: [
      ...(type === "cjs" && lazy && !isBrowser
        ? [
            [
              require.resolve("@babel/plugin-transform-modules-commonjs"),
              {
                lazy: true,
              },
            ],
          ]
        : []),
      ...(disableAutoReactRequire === true || (jsxRuntime === "automatic" && hasJsxRuntime())
        ? []
        : [require.resolve("babel-plugin-react-require")]),
      require.resolve("@babel/plugin-syntax-dynamic-import"),
      require.resolve("@babel/plugin-proposal-export-default-from"),
      require.resolve("@babel/plugin-proposal-export-namespace-from"),
      require.resolve("@babel/plugin-proposal-do-expressions"),
      require.resolve("@babel/plugin-proposal-nullish-coalescing-operator"),
      require.resolve("@babel/plugin-proposal-optional-chaining"),
      [require.resolve("@babel/plugin-proposal-decorators"), { legacy: true }],
      // https://babeljs.io/docs/en/babel-plugin-proposal-class-properties#loose
      // When `loose` true, class properties are compiled to use an assignment expression instead of Object.defineProperty.
      [require.resolve("@babel/plugin-proposal-class-properties"), { setPublicClassFields: true }],
      ...(runtimeHelpers
        ? [
            [
              require.resolve("@babel/plugin-transform-runtime"),
              {
                useESModules: isBrowser && type === "esm",
                corejs,
                ...(typeof runtimeHelpers === "string" ? { version: runtimeHelpers } : {}),
              },
            ],
          ]
        : []),
    ],
  };
};
