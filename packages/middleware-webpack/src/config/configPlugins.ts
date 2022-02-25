import path from "path";
import fs from "fs";
import { DefinePlugin, IgnorePlugin } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import WebpackBar from "webpackbar";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { StatsWriterPlugin } from "webpack-stats-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import VModulePlugin from "vmodule-webpack-plugin";
import type Config from "webpack-chain";
import type { Context, INormalizedOpts } from "../types";

export default async (config: Config, options: INormalizedOpts, ctx: Context) => {
  if (options.template?.length) {
    // Add html for every entry point
    options.entry.forEach(({ name }) => {
      const template = options.template.find(t => t.name === name) || options.template[0];
      config.plugin(`html_${name}`).use(HtmlWebpackPlugin, [
        {
          title: "Dawn App",
          filename: path.join(options.folders.html, `${name}.html`),
          template: template.file,
          inject: true,
          chunks: [options.common?.name, name].filter(Boolean),
          minify:
            options.env === "production"
              ? {
                  collapseWhitespace: true,
                  keepClosingSlash: true,
                  minifyCSS: true,
                  minifyJS: true,
                  minifyURLs: true,
                  removeComments: true,
                  removeEmptyAttributes: true,
                  removeRedundantAttributes: true,
                  removeScriptTypeAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  sortAttributes: true,
                  sortClassName: true,
                  useShortDoctype: true,
                }
              : false,
        },
      ]);
    });
  }

  config
    .plugin("define")
    .use(DefinePlugin, [{ "process.env": { NODE_ENV: JSON.stringify(process.env.NODE_ENV || options.env) } }]);
  config.plugin("case-sensitive-paths").use(require.resolve("case-sensitive-paths-webpack-plugin"));
  config.plugin("progress").use(WebpackBar, [{ profile: options.profile }]);
  if (!options.disabledTypeCheck && fs.existsSync(path.resolve(options.cwd, "tsconfig.json"))) {
    config.plugin("type-check").use(ForkTsCheckerWebpackPlugin, [
      {
        typescript: {
          mode: "write-references",
          profile: options.profile,
          diagnosticOptions: { syntactic: true, semantic: true },
          configOverwrite: {
            compilerOptions: {
              resolveJsonModule: true,
            },
            include: [path.resolve(__dirname, "../../typings.d.ts"), ...options.typeCheckInclude],
          },
        },
      },
    ]);
  }
  const configPath = path.resolve(options.cwd, options.config.path);
  config.plugin("config").use(VModulePlugin, [
    {
      name: options.config.name,
      watch: [configPath, `${configPath}.*`, `${configPath}/**/*`],
      content:
        options.config.content ??
        (() => {
          // @ts-ignore TS2339
          const confman = new ctx.utils.confman.Parser({ env: options.config.env });
          return confman.load(configPath);
        }),
    },
  ]);

  if (!options.injectCSS) {
    config.plugin("extract-css").use(MiniCssExtractPlugin, [
      {
        filename: path.join(options.folders.style, "[name].css"),
        chunkFilename: path.join(options.folders.style, "[name].[contenthash:8].chunk.css"),
        experimentalUseImportModule: true, // This improves performance and memory usage a lot, but isn't as stable as the normal approach. https://github.com/webpack-contrib/mini-css-extract-plugin#experimentaluseimportmodule
      },
    ]);
  }

  if (options.ignoreMomentLocale) {
    config
      .plugin("ignore-moment-locale")
      .use(IgnorePlugin, [{ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }]);
  }

  if (options.profile) {
    config.plugin("stats").use(StatsWriterPlugin, [{ stats: options.statsOpts }]);
  }

  if (options.analysis) {
    config.plugin("analyzer").use(BundleAnalyzerPlugin, [options.analysis as BundleAnalyzerPlugin.Options]);
  }

  if (options.server && options.serverOpts.hot) {
    config.plugin("react-refresh").use(require.resolve("@pmmmwh/react-refresh-webpack-plugin"));
  }

  if (options.lint) {
    config.plugin("eslint").use(require.resolve("eslint-webpack-plugin"), [
      {
        extensions: "js,jsx,ts,tsx",
        formatter: require.resolve("eslint-formatter-pretty"),
        failOnError: false,
        files: "**/*.(js|jsx|ts|tsx)",
        ...(typeof options.lint === "object" ? options.lint : {}),
      },
    ]);
  }
};
