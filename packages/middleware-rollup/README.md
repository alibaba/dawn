# @dawnjs/dn-middleware-rollup

[![npm](https://img.shields.io/npm/v/@dawnjs/dn-middleware-rollup)](https://www.npmjs.com/package/@dawnjs/dn-middleware-rollup)
[![npm](https://img.shields.io/npm/dw/@dawnjs/dn-middleware-rollup)](https://www.npmjs.com/package/@dawnjs/dn-middleware-rollup)

这是一个提供使用 Rollup 打包资源文件的中间件

## 功能亮点

- 同时支持 `CJS` 、 `ESM` 、 `UMD`、 `SystemJS`、 `IIFE` 打包格式
- 支持 `TypeScript` 代码打包及类型检查
- 大部分情况下只需要很少配置甚至无需配置
- 支持复杂的自定义配置场景
- 支持代码混淆压缩和 `SourceMap`

## 使用说明

### 安装

```shell
npm i -D @dawnjs/dn-middleware-rollup
```

### 配置 `.dawn/pipe.yml`

```yml
dev:
  - name: '@dawnjs/dn-middleware-rollup'
    watch: true
  - name: server
  - name: browser-sync

build:
  - name: '@dawnjs/dn-middleware-rollup'
```

## 配置项说明

### `cwd`

类型：`string`<br>
默认值：`process.cwd()`

文件相对路径的起始点，默认为执行 `dn` 命令所在的目录，通常情况为项目的根目录

### `watch`

类型：`boolean`<br>
默认值：`false`

开启 `Watch Mode`

### `fullCustom`

类型：`boolean`<br>
默认值：`false`

开启配置完全自定义能力，所有的配置项不再提供任何默认值

### `configFile`

类型：`string`<br>
默认值：`"./rollup.config.js"`

自定义配置文件路径，提供可编程的 `rollup` 打包配置合并或覆盖能力

#### 合并模式（推荐）

合并模式提供在中间件自动根据配置项生成的 `rollup` 配置基础上，自定义进行复杂逻辑扩展的能力

```js
module.exports = async (config, opts, ctx) => {
  // config 为当前打包实例的rollup配置
  // opts 为中间件实际执行的配置项
  // ctx 为中间件执行上下文环境
  // config.output.name = "foo";
  // 直接修改config对象，无需返回值
};
```

#### 覆盖模式

覆盖模式提供完全的自定义 `rollup` 配置，一般不太需要使用

```js
module.exports = async (config, opts, ctx) => {
  // config 为当前打包实例的rollup配置
  // opts 为中间件实际执行的配置项
  // ctx 为中间件执行上下文环境

  const newConfig = { ...config };

  return newConfig;
};
```

或

```js
module.exports = {
  input: 'app.js',
  output: {
    file: 'bundle.js',
    format: 'umd',
  },
};
```

### `analysis`

类型：`boolean`<br>
默认值：`false`

开启打包分析功能，会产出打包内容的体积等信息，主要用于打包体积调优过程

### `parallel`

类型：`boolean`<br>
默认值：`false`

开启并行打包模式

### `entry`

类型：`string | string[] | Object`<br>
默认值：

打包入口，如果未配置，默认会按优先级自动查找

_说明：优先级顺序 `src/index.tsx` > `src/index.ts` > `src/index.jsx` > `src/index.js`_

#### `string`

最常规的单入口模式，输出文件规则遵循[输出文件名说明](#输出文件名说明)

#### `string[]`

简单的多入口模式，每个入口的构建配置都完全一致，输出文件名由入口路径结合输出格式决定，不再识别 package.json 中的配置和统一的 file 配置

_说明：如果数组中只有一个值，等同于单入口模式_

#### `Object`

完整的多入口模式，key 为入口文件，value 为完整的一份构建配置，会和顶层的配置进行合并处理，优先级高于顶层配置，不再识别 package.json 中的配置和统一的 file 配置

_说明：如果对象只有一个 key，等同于单入口模式_

### `target`

类型：`"node" | "browser"`<br>
默认值：`"browser"`

指定编译结果的目标运行环境

_说明：当配置为 `"browser"` 时，可通过 `.browserslistrc` 指定目标浏览器范围，详细说明请查看[相关文档](https://github.com/browserslist/browserslist)_

### `outDir`

类型：`string`<br>
默认值：`"build"`

配合 `file` 配置项使用，指定输出目录

### `file`

类型：`string`<br>
默认值：

指定输出文件路径和文件名

_说明：输出文件的最终文件名由多个条件与配置项组合后形成，详细说明请查看[输出文件名说明](#输出文件名说明)_

### `esm`

类型：`false | Object`<br>
默认值：在 `Watch Mode` 下默认为 `false`

针对 `ESM` 输出格式的配置，如不需要 `ESM` 格式，可以配置为 `false`

#### `esm.file`

类型：`string`<br>
默认值：

指定 `ESM` 输出格式的输出文件路径和文件名

_说明：输出文件的最终文件名由多个条件与配置项组合后形成，详细说明请查看[输出文件名说明](#输出文件名说明)_

#### `esm.mjs`

类型：`boolean`<br>
默认值：`false`

是否额外输出后缀为 `.mjs` 的文件

_说明：`.mjs` 文件始终会进行混淆压缩，不受 `esm.minify` 配置项影响_

#### `esm.minify`

类型：`boolean`<br>
默认值：`false`

是否开启 `ESM` 输出格式的混淆压缩

### `cjs`

类型：`false | Object`<br>
默认值：在 `Watch Mode` 下默认为 `false`

针对 `CJS` 输出格式的配置，如不需要 `CJS` 格式，可以配置为 `false`

#### `cjs.file`

类型：`string`<br>
默认值：

指定 `CJS` 输出格式的输出文件路径和文件名

_说明：输出文件的最终文件名由多个条件与配置项组合后形成，详细说明请查看[输出文件名说明](#输出文件名说明)_

#### `cjs.minify`

类型：`boolean`<br>
默认值：`false`

是否开启 `CJS` 输出格式的混淆压缩

### `umd`

类型：`false | Object`<br>
默认值：

针对 `UMD` 输出格式的配置，如不需要 `UMD` 格式，可以配置为 `false`

#### `umd.file`

类型：`string`<br>
默认值：

指定 `UMD` 输出格式的输出文件路径和文件名

_说明：输出文件的最终文件名由多个条件与配置项组合后形成，详细说明请查看[输出文件名说明](#输出文件名说明)_

#### `umd.name`

类型：`string`<br>
默认值：

指定 `UMD` 输出格式暴露到全局的变量名

_说明：默认会根据项目 `package.json` 中的 `name` 字段动态生成，规则为 `camelCase(basename(pkg.name))`_

#### `umd.globals`

类型：`Object`<br>
默认值：

指定外部依赖的全局变量名，详细说明请查看[相关文档](https://rollupjs.org/guide/en/#outputglobals)

#### `umd.sourcemap`

类型：`boolean | "inline" | "hidden"`<br>
默认值：`false`

是否输出 `SourceMap` ，详细说明请查看[相关文档](https://rollupjs.org/guide/en/#outputsourcemap)

#### `umd.minFile`

类型：`boolean`<br>
默认值：`true`，在 `Watch Mode` 下默认为 `false`

是否额外输出 `.min.js` 文件，该文件会被混淆压缩

#### `umd.onlyMinFile`

类型：`boolean`<br>
默认值：

是否仅输出 `.min.js` 文件

#### `umd.template`

类型：`false | string`<br>
默认值：`"./src/assets/index.html"`

当 `target` 为 `"browser"` 时，`UMD` 输出格式会同时输出一份 `index.html` 入口文件，该配置项用于指定自定义模板文件。设置为`false`时，会关闭入口文件的输出

_说明：如果自定义模板文件不存在，会使用内置的模板进行输出。对于模板编写的详细说明，请查看[入口模板文件编写说明](#入口模板文件编写说明)了解更多_

### `system`

类型：`false | Object`<br>
默认值：`false`

针对 `SystemJS` 输出格式的配置，如不需要 `SystemJS` 格式，可以配置为 `false`

#### `system.file`

类型：`string`<br>
默认值：

指定 `SystemJS` 输出格式的输出文件路径和文件名

_说明：输出文件的最终文件名由多个条件与配置项组合后形成，详细说明请查看[输出文件名说明](#输出文件名说明)_

#### `system.minify`

类型：`boolean`<br>
默认值：`false`

是否开启 `SystemJS` 输出格式的混淆压缩

#### `system.sourcemap`

类型：`boolean | "inline" | "hidden"`<br>
默认值：`false`

是否输出 `SourceMap` ，详细说明请查看[相关文档](https://rollupjs.org/guide/en/#outputsourcemap)

#### `system.globals`

类型：`Object`<br>
默认值：

指定外部依赖的全局变量名，详细说明请查看[相关文档](https://rollupjs.org/guide/en/#outputglobals)

#### `system.name`

类型：`string`<br>
默认值：

指定 `SystemJS` 输出格式注册的模块名称

### `iife`

类型：`false | Object`<br>
默认值：`false`

针对 `IIFE` 输出格式的配置，如不需要 `IIFE` 格式，可以配置为 `false`

#### `iife.file`

类型：`string`<br>
默认值：

指定 `IIFE` 输出格式的输出文件路径和文件名

_说明：输出文件的最终文件名由多个条件与配置项组合后形成，详细说明请查看[输出文件名说明](#输出文件名说明)_

#### `iife.minify`

类型：`boolean`<br>
默认值：`false`

是否开启 `IIFE` 输出格式的混淆压缩

#### `iife.sourcemap`

类型：`boolean | "inline" | "hidden"`<br>
默认值：`false`

是否输出 `SourceMap` ，详细说明请查看[相关文档](https://rollupjs.org/guide/en/#outputsourcemap)

#### `iife.globals`

类型：`Object`<br>
默认值：

指定外部依赖的全局变量名，详细说明请查看[相关文档](https://rollupjs.org/guide/en/#outputglobals)

### `disableTypescript`

类型：`boolean`<br>
默认值：`false`

是否禁用 TypeScript 编译（使用 babel 代替）

### `typescript`

类型：`Object`<br>
默认值：

额外的 `rollup-plugin-typescript2` 配置项，详细说明请查看[相关文档](https://github.com/ezolenko/rollup-plugin-typescript2#plugin-options)

### `disableTypeCheck`

类型：`boolean`<br>
默认值：`false`

禁用类型检查

_说明：该配置项主要是为了老的历史项目可以快速接入，过程中临时性禁用类型检查。对于新项目不建议禁用，类型检查可以帮助我们在编译阶段就发现可能的代码错误_

### `runtimeHelpers`

类型：`boolean | string`<br>
默认值：`true`

配置是否开启 `@babel/plugin-transform-runtime`，为 `string` 时作为 `version` 配置项透传给 `@babel/plugin-transform-runtime`，详细说明请查看[相关文档](https://babeljs.io/docs/en/babel-plugin-transform-runtime#version)

### `corejs`

类型：`false | 2 | 3 | { version: 2 | 3; proposals: boolean }`<br>
默认值：`false`

透传给 `@babel/plugin-transform-runtime` 的 `corejs` 配置项，详细说明请查看[相关文档](https://babeljs.io/docs/en/babel-plugin-transform-runtime#corejs)

### `jsxRuntime`

类型：`"classic" | "automatic"`<br>
默认值：

透传给 `@babel/preset-react` 的 `runtime` 配置项，详细说明请查看[相关文档](https://babeljs.io/docs/en/babel-preset-react#runtime)

_说明：会检查当前依赖的 `react` 版本是否支持 `jsxRuntime`，如果不支持，统一设置为 `"classic"`_

### `pragma`

类型：`string`<br>
默认值：

透传给 `@babel/preset-react` 的 `pragma` 配置项，详细说明请查看[相关文档](https://babeljs.io/docs/en/babel-preset-react#pragma)

### `pragmaFrag`

类型：`string`<br>
默认值：

透传给 `@babel/preset-react` 的 `pragmaFrag` 配置项，详细说明请查看[相关文档](https://babeljs.io/docs/en/babel-preset-react#pragmafrag)

### `disableAutoReactRequire`

类型：`boolean`<br>
默认值：

配置是否排除 `babel-plugin-react-require`。默认情况下不会排除，但如果 `jsxRuntime` 设置为 `"automatic"` 并且使用了支持新 JSX Runtime 的 React 版本，则默认排除

### `extraBabelPresets`

类型：`any[]`<br>
默认值：`[]`

额外的 Babel 插件集，推荐使用 `.babelrc` 配置文件代替该配置项

### `extraBabelPlugins`

类型：`any[]`<br>
默认值：`[]`

额外的 Babel 插件，推荐使用 `.babelrc` 配置文件代替该配置项

### `babelExclude`

类型：`string | RegExp | Array<string | RegExp>`<br>
默认值：`"node_modules/**"`

自定义的 babel 转换排除路径，默认排除 node_modules 下所有文件，详细说明请查看[相关文档](https://github.com/rollup/plugins/blob/master/packages/babel/README.md#exclude)

### `babelInclude`

类型：`string | RegExp | Array<string | RegExp>`<br>
默认值：`undefined`

自定义的 babel 转换包含路径，详细说明请查看[相关文档](https://github.com/rollup/plugins/blob/master/packages/babel/README.md#include)

### `nodeVersion`

类型：`string | "current" | true`<br>
默认值：

当 `target` 为 `"node"` 时，作为 `@babel/preset-env` 的 `targets.node` 配置项使用，详细说明请查看[相关文档](https://babeljs.io/docs/en/babel-preset-env#targetsnode)

### `extractCSS`

类型：`boolean | string`<br>
默认值：`true`

额外输出独立的 `CSS` 文件，详细说明请查看[相关文档](https://github.com/egoist/rollup-plugin-postcss#extract)

### `injectCSS`

类型：`boolean | Object`<br>
默认值：`true`

是否在 `JS` 中添加注入样式文件的代码，在 `extractCSS` 为 `true` 时，该配置项始终为 `false` ，详细说明请查看[相关文档](https://github.com/egoist/rollup-plugin-postcss#inject)

### `cssModules`

类型：`boolean | Object`<br>
默认值：`{ localsConvention: 'camelCase' }`

是否开启 CSS modules 或设置 `postcss-modules` 选项，详细说明请查看[相关文档](https://github.com/egoist/rollup-plugin-postcss#modules)

### `autoCssModules`

类型：`boolean`<br>
默认值：`true`

是否自动对 `.module.*` 文件开启 CSS modules ，详细说明请查看[相关文档](https://github.com/egoist/rollup-plugin-postcss#automodules)

### `less`

类型：`Object`<br>
默认值：

透传给 `less` 的选项，详细说明请查看[相关文档](http://lesscss.org/usage/#less-options)

### `sass`

类型：`Object`<br>
默认值：

透传给 [`sass`](https://github.com/sass/dart-sass#javascript-api) 或 [`node-sass`](https://github.com/sass/node-sass#options) 的选项

### `postcssImport`

类型：`Object`<br>
默认值：

额外的 `postcss-import` 配置项，详细说明请查看[相关文档](https://github.com/postcss/postcss-import#options)

### `autoprefixer`

类型：`Object`<br>
默认值：

额外的 `autoprefixer` 配置项，详细说明请查看[相关文档](https://github.com/postcss/autoprefixer#options)

### `postcssPresetEnv`

类型：`Object`<br>
默认值：

额外的 `postcss-preset-env` 配置项，详细说明请查看[相关文档](https://github.com/csstools/postcss-preset-env#options)

### `postcss`

类型：`Object`<br>
默认值：

额外的 `rollup-plugin-postcss` 配置项，详细说明请查看[相关文档](https://github.com/egoist/rollup-plugin-postcss#options)

### `nodeResolve`

类型：`Object`<br>
默认值：`{}`

额外的 `@rollup/plugin-node-resolve` 配置项，详细说明请查看[相关文档](https://github.com/rollup/plugins/tree/master/packages/node-resolve#options)

### `commonjs`

类型：`Object`<br>
默认值：`{}`

额外的 `@rollup/plugin-commonjs` 配置项，详细说明请查看[相关文档](https://github.com/rollup/plugins/tree/master/packages/commonjs#options)

_说明：仅当 `UMD` 输出格式时，才会启用 `@rollup/plugin-commonjs` 插件_

### `alias`

类型：`Object | Object[]`<br>
默认值：

额外的模块别名配置，功能与 `webpack` 的 `resolve.alias` 类似，详细说明请查看[相关文档](https://github.com/rollup/plugins/tree/master/packages/alias#entries)

_说明：对于在 `tsconfig.json` 中配置了 `paths` 的别名，无需额外配置_

### `extraExternals`

类型：`string[]`<br>
默认值：`[]`

配置额外的外部依赖

_说明：如果是已加入到 `peerDependencies` 或 `dependencies` 中的依赖，无需额外配置，详情说明请查看[外部依赖说明](#外部依赖说明)_

### `externalsExclude`

类型：`string[]`<br>
默认值：`[]`

配置外部依赖的排除项，需要精确到具体引用文件

### `inject`

类型：`Object`<br>
默认值：

透传给 `@rollup/plugin-inject` ，详细说明请查看[相关文档](https://github.com/rollup/plugins/tree/master/packages/inject)

### `replace`

类型：`Object`<br>
默认值：

透传给 `@rollup/plugin-replace` ，详细说明请查看[相关文档](https://github.com/rollup/plugins/tree/master/packages/replace)

### `terser`

类型：`Object`<br>
默认值：`{}`

额外的 `rollup-plugin-terser` 配置项，详细说明请查看[相关文档](https://github.com/TrySound/rollup-plugin-terser#options)

### `html`

类型：`Object`<br>
默认值：`{}`

除 `template` 外额外的 `@rollup/plugin-html` 配置项，详细说明请查看[相关文档](https://github.com/rollup/plugins/tree/master/packages/html#options)

### `json`

类型：`Object`<br>
默认值：`{}`

透传给 `@rollup/plugin-json` ，详细说明请查看[相关文档](https://github.com/rollup/plugins/tree/master/packages/json#options)

### `yaml`

类型：`Object`<br>
默认值：`{}`

透传给 `@rollup/plugin-yaml` ，详细说明请查看[相关文档](https://github.com/rollup/plugins/tree/master/packages/yaml#options)

### `wasm`

类型：`boolean | Object`<br>
默认值：`false`

开启对 `WebAssembly` 模块的打包支持。当配置成对象时，作为 `@rollup/plugin-wasm` 的配置项，详细说明请查看[相关文档](https://github.com/rollup/plugins/tree/master/packages/wasm#options)

### `string`

类型：`Object`<br>
默认值：`{ include: "**/*.txt" }`

透传给 `rollup-plugin-string` ，详细说明请查看[相关文档](https://github.com/TrySound/rollup-plugin-string#usage)

### `svgr`

类型：`Object`<br>
默认值：

透传给 `@svgr/rollup` ，详细说明请查看[相关文档](https://react-svgr.com/docs/rollup/#passing-options)

## 其他

### 输出文件名说明

输出文件名可通过相关配置项定义，整体上由以下优先级确定：

1. 具体输出格式指定的文件名
2. 顶层配置项指定的文件名
3. `package.json` 中入口字段的值
4. 打包入口文件的文件名

#### 对于 `ESM` 输出格式：

1. 如果配置了 `esm.file` ：`` `${outDir}/${esm.file}.js` ``<br>_对于 `mjs` 文件：`` `${outDir}/${esm.file}.mjs` ``_
2. 如果配置了 `file` ：`` `${outDir}/${file}.esm.js` ``<br>_对于 `mjs` 文件：`` `${outDir}/${file}.mjs` ``_
3. 如果在 `package.json` 中定义了 `module` ：`pkg.module`<br>_对于 `mjs` 文件：`` `${getFileName(pkg.module)}.mjs` ``_
4. 以上配置都不存在时 ：`` `${outDir}/${basename(entry, extname(entry))}.esm.js` ``<br>_对于 `mjs` 文件：`` `${outDir}/${basename(entry, extname(entry))}.mjs` ``_

#### 对于 `CJS` 输出格式：

1. 如果配置了 `cjs.file` ：`` `${outDir}/${cjs.file}.js` ``
2. 如果配置了 `file` ：`` `${outDir}/${file}.js` ``
3. 如果在 `package.json` 中定义了 `main` ：`pkg.main`
4. 以上配置都不存在时：`` `${outDir}/${basename(entry, extname(entry))}.js` ``

#### 对于 `UMD` 输出格式：

1. 如果配置了 `umd.file` ：`` `${outDir}/${umd.file}.js` ``<br>_对于 `minFile` 文件：`` `${outDir}/${umd.file}.min.js` ``_
2. 如果配置了 `file` ：`` `${outDir}/${file}.umd.js` ``<br>_对于 `minFile` 文件：`` `${outDir}/${file}.umd.min.js` ``_
3. 如果在 `package.json` 中定义了 `browser` ：`pkg.browser`<br>_对于 `minFile` 文件：`` `${getFileName(pkg.browser)}.min.js` ``_
4. 以上配置都不存在时：`` `${outDir}/${basename(entry, extname(entry))}.umd.js` ``<br>_对于 `minFile` 文件：`` `${outDir}/${basename(entry, extname(entry))}.umd.min.js` ``_

#### 对于 `SystemJS` 输出格式：

1. 如果配置了 `system.file` ：`` `${outDir}/${system.file}.js` ``
2. 如果配置了 `file` ：`` `${outDir}/${file}.system.js` ``
3. 如果在 `package.json` 中定义了 `browser` ：`` `${getFileName(pkg.browser)}.system.js` ``
4. 以上配置都不存在时：`` `${outDir}/${basename(entry, extname(entry))}.system.js` ``

#### 对于 `IIFE` 输出格式：

1. 如果配置了 `iife.file` ：`` `${outDir}/${iife.file}.js` ``
2. 如果配置了 `file` ：`` `${outDir}/${file}.iife.js` ``
3. 如果在 `package.json` 中定义了 `browser` ：`` `${getFileName(pkg.browser)}.iife.js` ``
4. 以上配置都不存在时：`` `${outDir}/${basename(entry, extname(entry))}.iife.js` ``

### 入口模板文件编写说明

底层使用 `Dawn` 内置的超简模板引擎 [`STP`](https://github.com/houfeng/stp)

根据配置项 `html` 及打包结果，提供了以下上下文变量可用于模板变量替换

- `htmlAttr` 根据 `html.attributes.html` 生成，默认： `' lang="en"'`
- `metas` 根据 `html.meta` 生成，默认： `'<meta charset="utf-8">'`
- `title` 根据 `html.title` 生成，默认： `'Dawn'`
- `links` 根据 `html.publicPath` 、 `html.attributes.link` 和打包结果中的 `CSS` 文件列表生成<br>_说明：单个文件的输出格式为 `` `<link href="${publicPath}${fileName}" rel="stylesheet"${attrs}>` ``_
- `scripts` 根据 `html.publicPath` 、 `html.attributes.script` 和打包结果中的 `JS` 文件列表生成<br>_说明：单个文件的输出格式为 `` `<script src="${publicPath}${fileName}"${attrs}>` ``_

默认模板的内容如下：

```html
<!doctype html>
<html${htmlAttr}>
  <head>
    ${metas}
    <title>${title}</title>
    ${links}
  </head>
  <body>
    <div id="root"></div>
    <script>
      var mountNode = document.getElementById('root');
    </script>
    ${scripts}
  </body>
</html>
```

### 外部依赖说明

默认根据项目 `package.json` 中的 `dependencies` 和 `peerDependencies` 自动设置

- 对于 `ESM` 和 `CJS` 输出格式，默认使用 `dependencies` 和 `peerDependencies` 的并集作为 `external`<br>_特别说明：对于 `.mjs` 文件，仅使用 `peerDependencies` 作为 `external`_
- 对于 `UMD` 输出格式，默认使用 `peerDependencies` 作为 `external`

### 扩展 `postcss` 配置

支持通过项目根目录下定义 `postcss.config.js` 文件进行扩展

```js
// postcss.config.js
module.exports = context => {
  console.log(context.options.entry); // 入口文件
  console.log(context.options.type); // 输出格式
  console.log(context.options.bundleOpts); // 配置项

  return {};
};
```
