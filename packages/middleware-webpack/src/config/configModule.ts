import MiniCssExtractPlugin from "mini-css-extract-plugin";
import svgToTinyDataUri from "mini-svg-data-uri";
import type Config from "webpack-chain";
import merge from "deepmerge";
import yaml from "js-yaml";

import { getDefaultESBuildTarget, getIncompatibleConfig } from "../utils";
import type { Context, INormalizedOpts } from "../types";

const addAssetsRule = (config: Config) => {
  config.module
    .rule("assets")
    // load source as raw if specified `raw` in resourceQuery. e.g., `import myModule from 'my-module?raw';`
    .oneOf("raw")
    .resourceQuery(/raw/)
    .set("type", "asset/source") // TODO: replace after webpack-chain support webpack5
    .end() // end of oneOf
    // load source as inline if specified `inline` in resourceQuery. e.g., `import myModule from 'my-module?inline';`
    .oneOf("inline")
    .resourceQuery(/inline/)
    .set("type", "asset/inline") // TODO: replace after webpack-chain support webpack5
    .end() // end of oneOf
    // load images as inline if it's size is smaller then 10000 byte
    .oneOf("images")
    .test(/\.(png|jpe?g|gif|webp|ico|bmp)(\?.*)?$/)
    .set("type", "asset") // TODO: replace after webpack-chain support webpack5
    .parser({ dataUrlCondition: { maxSize: 10000 } })
    .end() // end of oneOf
    // load svg as inline by custom data URI generator if it's size is smaller then 10000 byte
    .oneOf("svg")
    .test(/\.svg(\?.*)?$/)
    .set("type", "asset") // TODO: replace after webpack-chain support webpack5
    .parser({ dataUrlCondition: { maxSize: 10000 } })
    .set("generator", {
      dataUrl: content => {
        if (typeof content !== "string") {
          content = content.toString();
        }
        return svgToTinyDataUri(content);
      },
    }) // TODO: replace after webpack-chain support webpack5
    .end() // end of oneOf
    // load fonts as resource
    .oneOf("fonts")
    .test(/\.(eot|woff|woff2|ttf)(\?.*)?$/)
    .set("type", "asset/resource") // TODO: replace after webpack-chain support webpack5
    .end() // end of oneOf
    // load plaintext as raw
    .oneOf("plaintext")
    .test(/\.(txt|text|md)(\?.*)?$/)
    .set("type", "asset/source") // TODO: replace after webpack-chain support webpack5
    .end() // end of oneOf
    .oneOf("yaml")
    .test(/\.(yml|yaml)$/)
    .type("json")
    .parser({ parse: yaml.load })
    .end() // end of oneOf
    .end();
};

const addESBuildLoader = (config: Config, options: INormalizedOpts) => {
  const target = getDefaultESBuildTarget(options);
  config.module
    .rule("esbuild")
    .oneOf("js")
    .test(/\.(js|mjs|jsx)$/)
    .use("esbuild-loader")
    .loader(require.resolve("esbuild-loader"))
    .options({
      loader: "jsx",
      target,
      ...(typeof options.esbuild.loader === "object" ? options.esbuild.loader : {}),
    })
    .end() // end of use
    .end() // end of oneOf
    .oneOf("ts")
    .test(/\.ts$/)
    .use("esbuild-loader")
    .loader(require.resolve("esbuild-loader"))
    .options({
      loader: "ts",
      target,
      ...(typeof options.esbuild.loader === "object" ? options.esbuild.loader : {}),
    })
    .end() // end of use
    .end() // end of oneOf
    .oneOf("tsx")
    .test(/\.tsx$/)
    .use("esbuild-loader")
    .loader(require.resolve("esbuild-loader"))
    .options({
      loader: "tsx",
      target,
      ...(typeof options.esbuild.loader === "object" ? options.esbuild.loader : {}),
    })
    .end() // end of use
    .end() // end of oneOf
    .end();
};

const hasJsxRuntime = () => {
  try {
    require.resolve("react/jsx-runtime");
    return true;
  } catch (e) {
    return false;
  }
};

const getSWCOptions = (
  options: INormalizedOpts,
  { typescripit = true, react = true }: { typescripit?: boolean; react?: boolean } = {},
) => {
  const defaultOptions = {
    env: {
      coreJs: "3",
    },
    jsc: {
      parser: {
        syntax: typescripit ? "typescript" : "ecmascript",
        decorators: true,
        dynamicImport: true,
        ...(typescripit
          ? { tsx: react }
          : {
              jsx: react,
              privateMethod: true,
              functionBind: true,
              classPrivateProperty: true,
              exportDefaultFrom: true,
              exportNamespaceFrom: true,
              importMeta: true,
            }),
      },
      transform: {
        react: {
          development: options.env === "development",
          runtime: hasJsxRuntime() ? "automatic" : "classic",
        },
        legacyDecorator: true,
        decoratorMetadata: true,
      },
    },
  };

  return typeof options.swc === "object" ? merge(defaultOptions, options.swc) : defaultOptions;
};

const addSWCLoader = (config: Config, options: INormalizedOpts) => {
  config.module
    .rule("swc")
    // Transform all `jsx` files
    .oneOf("js")
    .test(/\.(mjs|js|jsx)$/)
    .use("swc-loader")
    .loader(require.resolve("swc-loader"))
    .options(getSWCOptions(options, { typescripit: false }))
    .end() // end of use
    .end() // end of oneOf
    .oneOf("ts")
    .test(/\.ts$/)
    .use("swc-loader")
    .loader(require.resolve("swc-loader"))
    .options(getSWCOptions(options, { react: false }))
    .end() // end of use
    .end() // end of oneOf
    .oneOf("tsx")
    .test(/\.tsx$/)
    .use("swc-loader")
    .loader(require.resolve("swc-loader"))
    .options(getSWCOptions(options))
    .end() // end of use
    .end() // end of oneOf
    .end();
};

const getBabelOpts = (
  options: INormalizedOpts,
  { typescript = true, react = true }: { typescript?: boolean; react?: boolean } = {},
) => {
  return {
    presets: [
      [
        require.resolve("@dawnjs/babel-preset-dawn"),
        {
          typescript,
          react: react
            ? {
                development: options.env === "development",
                runtime: options.babel?.jsxRuntime && hasJsxRuntime() ? "automatic" : "classic",
                pragma: options.babel?.pragma,
                pragmaFrag: options.babel?.pragmaFrag,
              }
            : false,
          reactRequire:
            react &&
            !(options.babel?.disableAutoReactRequire === true || (options.babel?.jsxRuntime && hasJsxRuntime())),
          transformRuntime: options.babel?.runtimeHelpers
            ? {
                corejs: options.babel?.corejs,
                ...(typeof options.babel?.runtimeHelpers === "string"
                  ? { version: options.babel?.runtimeHelpers }
                  : {}),
              }
            : undefined,
        },
      ],
      ...(options.babel?.extraBabelPresets ?? []),
    ].filter(Boolean),
    plugins: [
      options.server && options.serverOpts.hot && require.resolve("react-refresh/babel"),
      ...(options.babel?.extraBabelPlugins ?? []),
    ].filter(Boolean),
    cacheDirectory: process.env.BABEL_CACHE !== "none",
    cacheCompression: false,
  };
};

const pkgsRegList = getIncompatibleConfig();

const addBabelRule = (config: Config, options: INormalizedOpts) => {
  config.module
    .rule("babel")
    // Transform all `jsx` files
    .oneOf("jsx")
    .test(/\.jsx$/)
    .use("babel-loader")
    .loader(require.resolve("babel-loader"))
    .options(getBabelOpts(options, { typescript: false }))
    .end() // end of use
    .end() // end of oneOf
    // Transform all `js` and `mjs` files except files in node_modules
    .oneOf("app-js")
    .test(/\.(js|mjs)$/)
    .exclude.add(/node_modules/)
    .end() // end of exclude
    .use("babel-loader")
    .loader(require.resolve("babel-loader"))
    .options(getBabelOpts(options, { typescript: false }))
    .end() // end of use
    .end() // end of oneOf
    // Transform extra `js` and `mjs` files with user config
    .when(!!options.babel?.extraBabelIncludes?.length, rule => {
      rule
        .oneOf("extra-js")
        .test(/\.(js|mjs)$/)
        .include.merge(options.babel.extraBabelIncludes)
        .end() // end of include
        .use("babel-loader")
        .loader(require.resolve("babel-loader"))
        .options(getBabelOpts(options, { typescript: false }));
    })
    // compile whatever you need in ie11
    // make ie11 incompatible alone, developer can also use extraBabelIncludes
    .when(!!options.babel?.ie11Incompatible, rule => {
      rule
        .oneOf("ie11-incompatible")
        .include.merge(pkgsRegList)
        .end()
        .use("babel-loader")
        .loader(require.resolve("babel-loader"))
        .options(getBabelOpts(options, { typescript: false }))
        .end();
    })
    // Transform all `ts` files with react off
    .oneOf("ts")
    .test(/\.ts$/)
    .use("babel-loader")
    .loader(require.resolve("babel-loader"))
    .options(getBabelOpts(options, { react: false }))
    .end() // end of use
    .end() // end of oneOf
    // Transform all `tsx` files
    .oneOf("tsx")
    .test(/\.tsx$/)
    .use("babel-loader")
    .loader(require.resolve("babel-loader"))
    .options(getBabelOpts(options))
    .end() // end of use
    .end() // end of oneOf
    .end();
};

const addWorkerRule = (config: Config, options: INormalizedOpts) => {
  config.module
    .rule("worker")
    .test(/\.worker\.(js|mjs|ts)/)
    .use("worker-loader")
    .loader(require.resolve("worker-loader"))
    .options({
      inline: "fallback",
      ...options.workerLoader,
    });
};

const addStyleRule = (
  config: Config,
  options: INormalizedOpts,
  {
    name,
    test,
    preProcessors,
  }: {
    name: string;
    test: any;
    importLoaders?: number;
    preProcessors?: Array<{ loader: string; options?: object }>;
  },
  ctx: Context,
) => {
  config.module
    .rule(name)
    .test(test)
    // use style-loader for injectCSS, or extract css by mini-css-extract-plugin otherwise
    .when(
      options.injectCSS,
      rule => {
        rule.use("style-loader").loader(require.resolve("style-loader")).options(options.styleLoader);
      },
      rule => {
        rule.use("extract-css-loader").loader(MiniCssExtractPlugin.loader).options(options.styleLoader);
      },
    )
    // use css-loader, enable css modules for .modules.* by default
    .use("css-loader")
    .loader(require.resolve("css-loader"))
    .options({
      importLoaders: preProcessors?.length ?? 0 + 1,
      ...options.cssLoader,
      modules: {
        auto: true,
        exportLocalsConvention: "camelCase",
        localIdentHashSalt: ctx.project.name,
        ...(typeof options.cssLoader?.modules === "boolean"
          ? { auto: options.cssLoader?.modules }
          : typeof options.cssLoader?.modules === "string"
          ? { mode: options.cssLoader?.modules }
          : options.cssLoader?.modules),
      },
    })
    .end()
    // use postcss-loader before css-loader, but after any pre-processor loader
    .use("postcss-loader")
    .loader(require.resolve("postcss-loader"))
    .options({
      implementation: require.resolve("postcss"),
      ...options.postcssLoader,
      postcssOptions: (loaderContext: any) => {
        let customOptions = options.postcssLoader?.postcssOptions;
        if (typeof customOptions === "function") {
          customOptions = customOptions(loaderContext);
        }

        return {
          plugins: [
            [require.resolve("postcss-preset-env"), { stage: 0, ...options.postcssPresetEnv }],
            ...(options.extraPostCSSPlugins ?? []),
          ],
          ...customOptions,
        };
      },
    })
    .end()
    .when(!!preProcessors?.length, rule => {
      preProcessors.forEach(preProcessor => {
        rule.use(preProcessor.loader).loader(require.resolve(preProcessor.loader)).options(preProcessor.options);
      });
    });
};

export default async (config: Config, options: INormalizedOpts, ctx: Context) => {
  addAssetsRule(config);
  if (options.esbuild?.loader) {
    addESBuildLoader(config, options);
  } else if (options.swc) {
    addSWCLoader(config, options);
  } else {
    addBabelRule(config, options);
  }
  addWorkerRule(config, options); // MUST AFTER BABEL RULE !!!
  addStyleRule(config, options, { name: "css", test: /\.css(\?.*)?$/, importLoaders: 1 }, ctx);
  addStyleRule(
    config,
    options,
    {
      name: "less",
      test: /\.less(\?.*)?$/,
      preProcessors: [
        {
          loader: "less-loader",
          options: {
            implementation: require.resolve("less"),
            ...options.lessLoader,
            lessOptions: (loaderContext: any) => {
              let customOptions = options.lessLoader?.lessOptions;
              if (typeof customOptions === "function") {
                customOptions = customOptions(loaderContext);
              }
              return { rewriteUrls: "all", javascriptEnabled: true, ...customOptions };
            },
          },
        },
      ],
    },
    ctx,
  );
  addStyleRule(
    config,
    options,
    {
      name: "sass",
      test: /\.s(a|c)ss(\?.*)?$/,
      preProcessors: [
        { loader: "resolve-url-loader", options: { ...options.resolveUrlLoader } },
        {
          loader: "sass-loader",
          options: {
            implementation: require.resolve("sass"),
            ...options.sassLoader,
            sourceMap: true, // required by `resolve-url-loader`, see https://github.com/bholloway/resolve-url-loader/blob/master/packages/resolve-url-loader/README.md#configure-webpack
            sassOptions: (loaderContext: any) => {
              let customOptions = options.sassLoader?.sassOptions;
              if (typeof customOptions === "function") {
                customOptions = customOptions(loaderContext);
              }
              return { quietDeps: true, ...customOptions };
            },
          },
        },
      ],
    },
    ctx,
  );
};
