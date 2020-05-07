---
group: middleware
name: babel
title: Babel
---

# dn-middleware-babel

[![npm](https://img.shields.io/npm/v/dn-middleware-babel)](https://www.npmjs.com/package/dn-middleware-babel)
[![npm](https://img.shields.io/npm/dw/dn-middleware-babel)](<(https://www.npmjs.com/package/dn-middleware-babel)>)
[![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/dn-middleware-babel)](https://libraries.io/npm/dn-middleware-babel)<br>
![node-current](https://img.shields.io/node/v/dn-middleware-babel)

该中间件提供使用 Babel 进行代码编译，主要用于仅编译不打包场景，如果需要进行资源打包，推荐使用 rollup 或 webpack 中间件

## 功能亮点

- 高内聚的 babel 默认配置，绝大部分场景零配置或者仅需少量配置
- 支持 TypeScript 及其类型检查
- 支持 ESM 输出格式

## 示例

```yml
dev:
  - name: babel
    watch: true

build:
  - name: babel
```

## 配置项说明

支持项目本地使用 babel 配置文件覆盖默认配置

### `cwd`

类型：`string`<br>
默认值：`process.cwd()`

文件相对路径的起始点，默认为执行 dn 命令所在的目录，通常情况为项目的根目录

### `watch`

类型：`boolean`<br>
默认值：`false`

### `type`

类型：`"esm" | "cjs"`<br>
默认值：`"cjs"`

### `target`

类型：`"browser" | "node"`<br>
默认值：`"node"`

指定编译结果的目标运行环境

_说明：当配置为 `"browser"` 时，可通过 `.browserslistrc` 指定目标浏览器范围，详细配置请查看 `browserslist` [官方文档](https://github.com/browserslist/browserslist)_

### `srcDir`

类型：`string`<br>
默认值：`"src"`

### `include`

类型：`string[]`<br>
默认值：`["**/*"]`

指定编译需要包含的文件，支持 `glob` 语法

### `exclude`

类型：`string[]`<br>
默认值：`["**/__test__{,/**}", "**/*.+(test|e2e|spec).+(js|jsx|ts|tsx)"]`

指定编译需要排除的文件，支持 `glob` 语法

### `output`

类型：`string`<br>
默认值：当 `type` 为 `"esm"` 时，为 `"es"` ；当 `type` 为 `"cjs"` 时，为 `"lib"`

目标输入目录，如果不配置，会根据 `type` 不同，分别设置不同的目录

### `runtimeHelpers`

类型：`boolean`<br>
默认值：`false`

配置是否加入 `@babel/plugin-transform-runtime` 支持

### `extraPresets`

类型：`any[]`<br>
默认值：`[]`

### `extraPlugins`

类型：`any[]`<br>
默认值：`[]`

### `nodeVersion`

类型：`string | "current" | true`<br>
默认值：`"10"`

当 `target` 为 `"node"` 时有效，用于指定目标执行环境，可配置项参考[官方文档](https://babeljs.io/docs/en/babel-preset-env#targetsnode)

### `disableTypeCheck`

类型：`boolean`<br>
默认值：`false`

_说明：默认开启类型检查时，TS 文件会先经过 `gulp-typescript` 编译一次，产出 JS 文件后再经过 `babel` 编译。如果项目本地有配置 `tsconfig.json` 的话，推荐把其中的 `target` 配置为 `"ESNext"` ，把对目标环境的语法转换交给 `babel` 处理_

### `lazy`

类型：`boolean`<br>
默认值：`false`

仅在 `type` 为 `"cjs"` 并且 `target` 为 `"node"` 时有效，开启 `@babel/plugin-transform-modules-commonjs` 的 `lazy` 选项，具体解释可查看[官方文档](https://babeljs.io/docs/en/babel-plugin-transform-modules-commonjs#lazy)

### `noEmit`

类型：`boolean`<br>
默认值：`false`

不实际执行编译，通常用于作为其他中间件获取 `babel` 配置使用，比如 `webpack` 和 `rollup` 。有以下几种使用方式：

- #### 隐式依赖（推荐）
```ts
const { babelOpts } = await ctx.exec({ name: "babel", noEmit: true, /* any other options */ });
ctx.console.log(babelOpts);
```

- #### 显示依赖（方式一）
```yml
build:
  - name: babel
    noEmit: true
  - name: rollup # 必须紧跟在babel中间件之后
```

_在rollup中间件中_
```typescript
export default (opts) => {
  return async (next, ctx, args) => {
    if (args && args.babelOpts) {
      ctx.console.log(args.babelOpts);
    }
    // ...
  };
};
```

- #### 显示依赖（方式二）
```yml
build:
  - name: babel
    noEmit: true
  - name: some-other-middleware
  - name: rollup # 不需要紧跟在babel中间件之后
```

_在rollup中间件中_
```typescript
ctx.on("babel.config", babelOpts => {
  ctx.console.log(babelOpts);
});
```
