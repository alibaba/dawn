import { TransformOptions } from "@babel/core";
import { IGetBabelConfigOpts } from "./types";

export const getBabelConfig = (opts: IGetBabelConfigOpts): Pick<TransformOptions, "presets" | "plugins"> => {
  const { target, typescript, type, runtimeHelpers, nodeVersion, lazy } = opts;
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
      ...(isBrowser ? [require.resolve("@babel/preset-react")] : []),
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
      require.resolve("babel-plugin-react-require"),
      require.resolve("@babel/plugin-syntax-dynamic-import"),
      require.resolve("@babel/plugin-proposal-export-default-from"),
      require.resolve("@babel/plugin-proposal-export-namespace-from"),
      require.resolve("@babel/plugin-proposal-do-expressions"),
      require.resolve("@babel/plugin-proposal-nullish-coalescing-operator"),
      require.resolve("@babel/plugin-proposal-optional-chaining"),
      [require.resolve("@babel/plugin-proposal-decorators"), { legacy: true }],
      [require.resolve("@babel/plugin-proposal-class-properties"), { loose: true }],
      ...(runtimeHelpers
        ? [[require.resolve("@babel/plugin-transform-runtime"), { useESModules: isBrowser && type === "esm" }]]
        : []),
    ],
  };
};
