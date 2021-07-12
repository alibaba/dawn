---
group: middleware
name: webpack5
title: Webpack5
---

# dn-middleware-webpack5
## Features
1. 新版本的中间件采用 ts 进行了完全的代码重写和设计上的改造
2. wepack5 新特性支持：
   1. target 允许传递一个目标列表，并且支持目标的版本。例如 target: "node14"``target: ["web", "es2020"]。
   2. 模块联邦：这是一个颠覆性的feature，远程的模块可以独立编译，然后在运行时进行加载，同时还能够定义公共库来避免重复加载。
   3. 构建优化：optimization中的各种属性的更新和新增，例如 optimization.innerGraph 可以对模块中的标志进行分析，找出导出和引用之间的依赖关系。生产模式下是默认启用的。
   4. 同时API支持了更多可扩展配置
3. 更加智能，自动生成很多默认值，比如文件入口、是否启用ts编译等
4. 除了新功能，还有很多使用上的优化
   1. 新增了长期缓存的算法，这些算法在生产模式下是默认启用的，建议不要设置，使用默认值更合适。optimization.chunkIds和optimization.moduleIds
   2. 统一使用内容哈希，[contenthash]，在只修改注释时优化长期缓存
   3. 删除output.jsonpFunction，自动使用 package.json 中有唯一的名称来防止多个 webpack 运行时的冲突
   4. 支持 Fast Refresh，替换了 HMR，支持 React Hooks 级别的热更新了，具体可往下看(由于兼容性暂时关闭，问题开发者已修复20201102)
5. 其他构建优化
6. 其他性能优化（btw.并不是所有 optimization 配置项都开启就是优化性能，有的只适用于小型项目，大型项目中反而起反作用）

## 示例

```yml
dev:
  - name: webpack5
    watch: true
  - name: server
  - name: browser-sync

build:
  - name: webpack5
    env: "production"
```

## 旧版本升级指南

1. 删除原有包，以更新 package.lock.json：`npm uninstall dn-middleware-webpack -D && npm i dn-middleware-webpack5 -D`
2. 修改 pipe.yml 中间件配置为webpack5
3. 可选：常用多余配置移除
   1. 在 development 环境下，会默认帮你配置
      1. watch：监听文件变化，默认 true 打开
      2. injectCSS：注入 css，默认 true 打开
      3. hot：热更新，默认打开
      4. devtool / sourceMap：默认为 "source-map"
   2. 在 production 环境下，会默认帮你设置
      1. compress：压缩，默认打开
      2. devtool / sourceMap：默认为 false
   3. 文件目录相关默认值
      1. entry 为 "src/index.tsx", "src/index.ts", "src/index.jsx", "src/index.js"时
      2. template 为 "public/index.html", "src/assets/index.html" 时
      3. output 为 "/build" 时
      4. 会自动根据目录中有无 ts 文件来决定要不要打开 ts 编译

## 配置项属性（基础配置类）
### `env`
类型：`"development" | "production"`<br>
默认值：`"development"`

运行环境，开发环境development，生产环境production


### `entry`
类型：`string | object`<br>
默认值：`"src/index"`<br>
示例：
```js
  entry: src/test.tsx
```
```js
  entry:
    (1): src/**.tsx
```
```js
  entry:
    x: src/index.tsx
    y: src/test.tsx
```

入口起点


### `output`
类型：`string ｜ object`<br>
默认值：`"/build"`

输出文件的相对路径


### `output.path`
同 `output`


### `output.library`
类型：`object`<br>
默认值：`{}`

参考：[library]("https://webpack.docschina.org/configuration/output/#outputlibrary")


### `output.chunkFileName`
同 `output`
默认值：`"[name].[chunkhash:8].chunk.js"`

默认异步chunk为这个路径，可根据vm中升级前的路径灵活变更


### `template`
类型：`string | Array<{ name: string; file: string }>`<br>
默认值：`"public/index.html"` 或 `"src/assets/index.html"`

html模板入口

### `publicPath`
类型：`string`<br>
默认值：`/`

异步资源默认前缀，如cdn地址


### `devtool` ｜ `sourceMap(v4)`
类型：`boolean | string`<br>
默认值：`false`

控制是否生成，以及如何生成 source map


### `target`
类型：`"browser"｜ "node" ｜ "webworker"`<br>
默认值：`"browser"`

编译环境


### `alias`
类型：`object`<br>
默认值：`{}`

别名


## 配置项属性（进阶基础配置）
### `jsxRuntime`
类型：`"automatic" | "classic"`<br>

透传给 `dn-middleware-babel` 的 `jsxRuntime` 配置项，详细说明请查看[相关文档](https://www.npmjs.com/package/dn-middleware-babel#jsxruntime)


### `injectCSS`
类型：`boolean`<br>
默认值：`true`

是否引入css


### `cssModules`
类型：`boolean`<br>
默认值：`false`

是否使用 css Modules


### `disabledTypeCheck`
类型：`boolean`<br>
默认值：`false`

是否阻止 ts 类型检查

### `tscCompileOnError`
类型：`boolean`<br>
默认值：`true`

ts类型检查中的错误是否会阻断编译

### `folders`
类型：
```js
{
  js?: string;
  css?: string;
  media?: string;
  html?: string;
}
```
默认值：`{}`

指定资源子目录名称，主要包括css,js，字体和图片和html的目录，不指定的话会直接输出到output目录下


### `moduleFederation`
类型：object<br>

模块联邦相关配置


### `js`

## 配置项属性（构建优化类）


### `compress`
类型：`boolean`<br>
默认值：开发环境默认 `false`，生产环境默认 `true`

是否启用压缩（如果使用了compress中间件，需要将此配置设置为 false）

### `terser.terserOptions`
类型： `object`<br>
默认值: {}

### `esbuild.minify`
类型：`boolean | object`<br>
默认值：`false`

是否启用 `esbuild` 的构建产物压缩能力，代替 `TerserPlugin`，类型为 object 时透传给 ESBuildMinifyPlugin 作为选项

### `esbuild.loader`
类型：`boolean | object`<br>
默认值：`false`

【暂不支持】是否启用 `esbuild` 的构建能力，代替 `babel-loader`，类型为 object 时作为 esbuild-loader 的选项

### `watch`
类型：`boolean`<br>
默认值：开发环境默认 `true`，生产环境默认 `false`

是否开启监听模式


### `externals`
类型：`object`<br>
默认值：`{}`

打包排除的依赖配置项


### `external(v4)`
类型：`boolean`<br>
默认值：`false`

是否要打包排除依赖

### `hot`
类型：`boolean`<br>
默认值：开发环境默认为 true

是否开启 react-refresh（类似于 HMR）


### `common.disabled(v4)`
类型：`boolean`<br>
默认值：`false`

禁用抽取公共部分


### `common.name(v4)`
类型：`string`<br>
默认值：`common`

生成的公共资源名称


## 配置项属性（性能优化类）

### `htmlMinifier`
类型：`boolean`<br>
默认值：`true`

是否压缩html


### `performance`
类型：`boolean ｜"warning" | "error"`<br>
默认值：`false`

是否开启性能提示及形式


### `optimization`
类型：
```js
{
  minimize?: Boolean;
  minimizer?: any;
  splitChunks?: object;
  innerGraph?: boolean;
}
```
默认值：`false`

优化配置项

### `cache`
类型：`object`<br>
默认值：`{ type: "filesystem" }`

缓存相关的配置项，参考：[官方文档]("https://webpack.js.org/configuration/other-options/#cache")了解相关配置项

## 配置项属性（分析工具类）

### `analysis`
类型：`boolean | object`<br>
默认值：`false`

是否启用分析工具`BundleAnalyzerPlugin`，以及相关配置项，如是否为其开启server

### `statsOpts`
类型：`object`<br>

定制 stats 输出项内容
