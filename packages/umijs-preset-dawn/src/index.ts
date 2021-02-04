/* eslint-disable valid-jsdoc */
/**
 * @umijs preset dawn
 */
export default function umijsPresetDawn() {
  return {
    plugins: [
      // register methods
      require.resolve("@umijs/preset-built-in/lib/plugins/registerMethods"),
      // misc
      require.resolve("@umijs/preset-built-in/lib/plugins/routes"),

      // generate files
      require.resolve("./plugins/paths"),
      require.resolve("@umijs/preset-built-in/lib/plugins/generateFiles/core/history"),
      require.resolve("@umijs/preset-built-in/lib/plugins/generateFiles/core/plugin"),
      require.resolve("@umijs/preset-built-in/lib/plugins/generateFiles/core/polyfill"),
      require.resolve("@umijs/preset-built-in/lib/plugins/generateFiles/core/routes"),
      require.resolve("@umijs/preset-built-in/lib/plugins/generateFiles/core/umiExports"),
      require.resolve("@umijs/preset-built-in/lib/plugins/generateFiles/core/configTypes"),
      require.resolve("./plugins/core"),

      // // bundle configs
      // require.resolve('./plugins/features/alias'),
      // require.resolve('./plugins/features/analyze'),
      // require.resolve('./plugins/features/autoprefixer'),
      // require.resolve('./plugins/features/base'),
      // require.resolve('./plugins/features/chainWebpack'),
      // require.resolve('./plugins/features/chunks'),
      // require.resolve('./plugins/features/cssLoader'),
      // require.resolve('./plugins/features/cssModulesTypescriptLoader'),
      // require.resolve('./plugins/features/cssnano'),
      // require.resolve('./plugins/features/copy'),
      // require.resolve('./plugins/features/define'),
      // require.resolve('./plugins/features/devScripts'),
      // require.resolve('./plugins/features/devServer'),
      // require.resolve('./plugins/features/devtool'),
      // require.resolve('./plugins/features/dynamicImport'),
      // require.resolve('./plugins/features/exportStatic'),
      // require.resolve('./plugins/features/externals'),
      // require.resolve('./plugins/features/extraBabelIncludes'),
      // require.resolve('./plugins/features/extraBabelPlugins'),
      // require.resolve('./plugins/features/extraBabelPresets'),
      // require.resolve('./plugins/features/extraPostCSSPlugins'),
      // require.resolve('./plugins/features/forkTSChecker'),
      // require.resolve('./plugins/features/fastRefresh'),
      // require.resolve('./plugins/features/globalCSS'),
      // require.resolve('./plugins/features/globalJS'),
      // require.resolve('./plugins/features/hash'),
      // require.resolve('./plugins/features/ignoreMomentLocale'),
      // require.resolve('./plugins/features/inlineLimit'),
      // require.resolve('./plugins/features/lessLoader'),
      // require.resolve('./plugins/features/manifest'),
      // require.resolve('./plugins/features/mountElementId'),
      // require.resolve('./plugins/features/mpa'),
      // require.resolve('./plugins/features/nodeModulesTransform'),
      // require.resolve('./plugins/features/outputPath'),
      // require.resolve('./plugins/features/plugins'),
      // require.resolve('./plugins/features/postcssLoader'),
      // require.resolve('./plugins/features/presets'),
      // require.resolve('./plugins/features/proxy'),
      // require.resolve('./plugins/features/publicPath'),
      // require.resolve('./plugins/features/runtimePublicPath'),
      // require.resolve('./plugins/features/ssr/ssr'),
      // require.resolve('./plugins/features/singular'),
      // require.resolve('./plugins/features/styleLoader'),
      // require.resolve('./plugins/features/targets'),
      // require.resolve('./plugins/features/terserOptions'),
      // require.resolve('./plugins/features/theme'),
      // require.resolve('./plugins/features/umiInfo'),
      // require.resolve('./plugins/features/runtimeHistory'),

      // html
      // require.resolve('./plugins/features/html/favicon'),
      // require.resolve('./plugins/features/html/headScripts'),
      // require.resolve('./plugins/features/html/links'),
      // require.resolve('./plugins/features/html/metas'),
      // require.resolve('./plugins/features/html/scripts'),
      // require.resolve('./plugins/features/html/styles'),
      // require.resolve('./plugins/features/html/title'),

      // commands
      require.resolve("@umijs/preset-built-in/lib/plugins/commands/build/build"),
      require.resolve("@umijs/preset-built-in/lib/plugins/commands/build/applyHtmlWebpackPlugin"),
      require.resolve("@umijs/preset-built-in/lib/plugins/commands/config/config"),
      require.resolve("@umijs/preset-built-in/lib/plugins/commands/dev/dev"),
      require.resolve("@umijs/preset-built-in/lib/plugins/commands/dev/devCompileDone/devCompileDone"),
      require.resolve("@umijs/preset-built-in/lib/plugins/commands/dev/mock/mock"),
      require.resolve("@umijs/preset-built-in/lib/plugins/commands/generate/generate"),
      require.resolve("@umijs/preset-built-in/lib/plugins/commands/help/help"),
      require.resolve("@umijs/preset-built-in/lib/plugins/commands/plugin/plugin"),
      require.resolve("@umijs/preset-built-in/lib/plugins/commands/version/version"),
      require.resolve("@umijs/preset-built-in/lib/plugins/commands/webpack/webpack"),

      require.resolve("./initialize"),
    ] as string[],
  };
}
