import { dirname, extname, join, resolve } from "path";
import { existsSync, readFileSync, statSync } from "fs";
import { RollupOptions } from "rollup";
import url from "@rollup/plugin-url";
import svgr from "@svgr/rollup";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import NpmImport from "less-plugin-npm-import";
import alias from "@rollup/plugin-alias";
import inject from "@rollup/plugin-inject";
import replace from "@rollup/plugin-replace";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript2 from "rollup-plugin-typescript2";
import babel, { IBabelPluginOptions } from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import yaml from "@rollup/plugin-yaml";
import wasm from "@rollup/plugin-wasm";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import html, { IHtmlPluginTemplateFunctionArgument, makeHtmlAttributes } from "@rollup/plugin-html";
import visualizer from "rollup-plugin-visualizer";
import { merge } from "lodash";
import { getOutputFile, testExternal } from "./utils";
import { IDawnContext, IGetRollupConfigOpts, IUmd } from "./types";

// eslint-disable-next-line max-lines-per-function
export const getRollupConfig = async (opts: IGetRollupConfigOpts, ctx: IDawnContext): Promise<RollupOptions[]> => {
  const { cwd, entry, type, bundleOpts, analysis } = opts;
  const {
    umd,
    esm,
    cjs,
    extractCSS = true,
    injectCSS = true,
    cssModules: modules = false,
    less: lessOpts = {},
    sass: sassOpts = {},
    autoprefixer: autoprefixerOpts,
    commonjs: commonjsOpts = {},
    alias: aliasEntries,
    inject: injectOpts,
    replace: replaceOpts,
    nodeResolve: nodeResolveOpts = {},
    disableTypeCheck = false,
    typescript: typescriptOpts = {},
    target = "browser",
    useBuiltIns,
    corejs,
    runtimeHelpers,
    nodeVersion,
    extraBabelPresets,
    extraBabelPlugins,
    extraExternals = [],
    externalsExclude = [],
    terser: terserOpts = {},
    html: htmlOpts = {},
    json: jsonOpts = {},
    yaml: yamlOpts = {},
    wasm: wasmOpts = false,
  } = bundleOpts;

  const entryExt = extname(entry);
  const isTypeScript = entryExt === ".ts" || entryExt === ".tsx";
  const extensions = [".js", ".jsx", ".ts", ".tsx", ".es6", ".es", ".mjs"];

  const pkg = ctx.project;

  const { babelOpts } = await ctx.exec({
    name: "babel",
    noEmit: true,
    cwd,
    target,
    type,
    useBuiltIns,
    corejs,
    runtimeHelpers,
    nodeVersion,
    extraPresets: extraBabelPresets,
    extraPlugins: extraBabelPlugins,
  });
  const babelPluginOptions: IBabelPluginOptions = {
    ...babelOpts,
    babelrc: false,
    exclude: "node_modules/**",
    extensions,
    babelHelpers: runtimeHelpers ? "runtime" : "bundled",
  };

  const input = join(cwd, entry);
  const format = type;

  const external = new Set([
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    ...extraExternals,
  ]);
  const externalPeerDeps = new Set([...Object.keys(pkg.peerDependencies || {}), ...extraExternals]);

  const terserOptions = merge(
    {
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
        global_defs: {
          module: false,
        },
      },
    },
    terserOpts,
  );

  const template = async ({ attributes, files, meta, publicPath, title }: IHtmlPluginTemplateFunctionArgument) => {
    const htmlAttr = makeHtmlAttributes(attributes.html);
    const scripts = (files.js || [])
      .map(({ fileName }) => {
        const attrs = makeHtmlAttributes(attributes.script);
        return `<script src="${publicPath}${fileName}"${attrs}></script>`;
      })
      .join("\n");

    const links = (files.css || [])
      .map(({ fileName }) => {
        const attrs = makeHtmlAttributes(attributes.link);
        return `<link href="${publicPath}${fileName}" rel="stylesheet"${attrs}>`;
      })
      .join("\n");

    const metas = (meta || [])
      .map(item => {
        const attrs = makeHtmlAttributes(item);
        return `<meta${attrs}>`;
      })
      .join("\n");

    const data = {
      htmlAttr,
      metas,
      title,
      scripts,
      links,
    };
    const defaultTemplate = `
<!doctype html>
<html\${htmlAttr}>
  <head>
    \${metas}
    <title>\${title}</title>
    \${links}
  </head>
  <body>
    <div id="root"></div>
    <script>
      var mountNode = document.getElementById('root');
    </script>
    \${scripts}
  </body>
</html>
`;
    const templateFile = resolve(cwd, (umd as IUmd).template);
    if (existsSync(templateFile) && statSync(templateFile).isFile()) {
      const strTmpl = readFileSync(templateFile, "utf-8");
      return ctx.utils.stp(strTmpl, data);
    }
    return ctx.utils.stp(defaultTemplate, data);
  };

  const getPlugins = ({ minCSS }: { minCSS?: boolean } = {}) => {
    return [
      url(),
      svgr(),
      postcss({
        extract: extractCSS,
        inject: injectCSS,
        modules,
        minimize: !!minCSS,
        use: [
          ["less", { javascriptEnabled: true, plugins: [new NpmImport({ prefix: "~" })], ...lessOpts }],
          ["sass", { ...sassOpts }],
        ],
        plugins: [autoprefixer(autoprefixerOpts)],
        config: {
          ctx: opts,
        },
      }),
      ...(aliasEntries && ((Array.isArray(aliasEntries) && aliasEntries.length) || Object.keys(aliasEntries).length)
        ? [alias({ entries: aliasEntries })]
        : []),
      ...(injectOpts && Object.keys(injectOpts).length ? [inject(injectOpts)] : []),
      ...(replaceOpts && Object.keys(replaceOpts).length ? [replace(replaceOpts)] : []),
      nodeResolve({
        mainFields: ["module", "main"],
        extensions,
        ...nodeResolveOpts,
      }),
      ...(isTypeScript
        ? [
            typescript2({
              cwd,
              // @see https://github.com/ezolenko/rollup-plugin-typescript2/issues/105 >> try disabling it now
              // objectHashIgnoreUnknownHack: true,
              // @see https://github.com/umijs/father/issues/61#issuecomment-544822774
              clean: true,
              tsconfig: join(cwd, "tsconfig.json"),
              tsconfigDefaults: {
                compilerOptions: {
                  // Generate declaration files by default
                  declaration: true,
                },
              },
              tsconfigOverride: {
                compilerOptions: {
                  // Support dynamic import
                  target: "esnext",
                },
              },
              check: !disableTypeCheck,
              ...typescriptOpts,
            }),
          ]
        : []),
      babel(babelPluginOptions),
      json(jsonOpts),
      yaml(yamlOpts),
      ...(wasmOpts ? [wasm({ ...(typeof wasmOpts === "object" ? wasmOpts : {}) })] : []),
    ];
  };
  const extraUmdPlugins = [commonjs(commonjsOpts)];

  switch (type) {
    case "esm":
      return [
        {
          input,
          output: {
            format,
            file: getOutputFile({ entry, type: "esm", pkg, bundleOpts }),
          },
          plugins: [
            ...getPlugins({ minCSS: (esm && esm.minify) || false }),
            ...(esm && esm.minify ? [terser(terserOptions)] : []),
            ...(analysis
              ? [
                  visualizer({
                    filename: join(dirname(getOutputFile({ entry, type: "esm", pkg, bundleOpts })), "stats-esm.html"),
                    title: "Rollup Visualizer - ESM",
                    open: true,
                    gzipSize: true,
                  }),
                ]
              : []),
          ],
          external: id => testExternal(external, externalsExclude, id),
        },
        ...(esm && esm.mjs
          ? [
              {
                input,
                output: {
                  format,
                  file: getOutputFile({ entry, type: "esm", pkg, bundleOpts, mjs: true }),
                },
                plugins: [
                  ...getPlugins({ minCSS: true }),
                  replace({
                    "process.env.NODE_ENV": JSON.stringify("production"),
                  }),
                  terser(terserOptions),
                  ...(analysis
                    ? [
                        visualizer({
                          filename: join(
                            dirname(getOutputFile({ entry, type: "esm", pkg, bundleOpts, mjs: true })),
                            "stats-mjs.html",
                          ),
                          title: "Rollup Visualizer - MJS",
                          open: true,
                          gzipSize: true,
                        }),
                      ]
                    : []),
                ],
                external: (id: string) => testExternal(externalPeerDeps, externalsExclude, id),
              },
            ]
          : []),
      ];
    case "cjs":
      return [
        {
          input,
          output: {
            format,
            file: getOutputFile({ entry, type: "cjs", pkg, bundleOpts }),
          },
          plugins: [
            ...getPlugins({ minCSS: (cjs && cjs.minify) || false }),
            ...(cjs && cjs.minify ? [terser(terserOptions)] : []),
            ...(analysis
              ? [
                  visualizer({
                    filename: join(dirname(getOutputFile({ entry, type: "cjs", pkg, bundleOpts })), "stats-cjs.html"),
                    title: "Rollup Visualizer - CJS",
                    open: true,
                    gzipSize: true,
                  }),
                ]
              : []),
          ],
          external: id => testExternal(external, externalsExclude, id),
        },
      ];
    case "umd":
      return [
        {
          input,
          output: {
            format,
            sourcemap: (umd && umd.sourcemap) || false,
            file: getOutputFile({ entry, type: "umd", pkg, bundleOpts }),
            globals: umd && umd.globals,
            name: umd && umd.name,
          },
          plugins: [
            ...getPlugins(),
            ...extraUmdPlugins,
            replace({
              "process.env.NODE_ENV": JSON.stringify("development"),
            }),
            ...(target === "browser" ? [html({ title: "Dawn", ...htmlOpts, template })] : []),
            ...(analysis
              ? [
                  visualizer({
                    filename: join(dirname(getOutputFile({ entry, type: "umd", pkg, bundleOpts })), "stats-umd.html"),
                    title: "Rollup Visualizer - UMD",
                    open: true,
                    gzipSize: true,
                  }),
                ]
              : []),
          ],
          external: (id: string) => testExternal(externalPeerDeps, externalsExclude, id),
        },
        ...(umd && umd.minFile
          ? [
              {
                input,
                output: {
                  format,
                  sourcemap: (umd && umd.sourcemap) || false,
                  file: getOutputFile({ entry, type: "umd", pkg, bundleOpts, minFile: true }),
                  globals: umd && umd.globals,
                  name: umd && umd.name,
                },
                plugins: [
                  ...getPlugins({ minCSS: true }),
                  ...extraUmdPlugins,
                  replace({
                    "process.env.NODE_ENV": JSON.stringify("production"),
                  }),
                  terser(terserOptions),
                ],
                external: (id: string) => testExternal(externalPeerDeps, externalsExclude, id),
              },
            ]
          : []),
      ];
    default:
      throw new Error(`Unsupported type ${type}`);
  }
};
