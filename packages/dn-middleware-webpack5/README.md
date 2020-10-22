---
group: middleware
name: webpack5
title: Webpack5
---

# dn-middleware-webpack5
几乎完全向下兼容，即使是旧项目迁移，成本也很低，并且增加了很多开发中新功能：
1. target 允许传递一个目标列表，并且支持目标的版本。例如 `target: "node14"``target: ["web", "es2020"]`。
2. [模块联邦]("https://webpack.docschina.org/concepts/module-federation/")：远程的模块可以独立编译，然后在运行时进行加载，同时还能够定义公共库来避免重复加载。
3. 构建优化：optimization中的各种属性的更新和新增，例如 `optimization.innerGraph` 可以对模块中的标志进行分析，找出导出和引用之间的依赖关系。生产模式下是默认启用的。
4. 同时API支持了更多可扩展配置

除了新功能，还有很多使用上的优化
1. 新增了长期缓存的算法，这些算法在生产模式下是默认启用的，建议不要设置，使用默认值更合适。【`optimization.chunkIds`和`optimization.moduleIds`】
2. 统一使用内容哈希，`[contenthash]`，在只修改注释时优化长期缓存
3. 删除output.jsonpFunction，自动使用 `package.json` 中有唯一的名称来防止多个 webpack 运行时的冲突
4. 其他构建优化
5. 其他性能优化

## 示例

```yml
dev:
  - name: webpack5
    watch: true
  - name: server
  - name: browser-sync

build:
  - name: webpack5
```

## 配置项说明

### `env`

类型：`"development" | "production"`<br>
默认值：`development`

运行环境，开发环境development, 生产环境production

### `entry`

类型：`string`<br>
默认值：`/src/index`

入口起点

### `devtool` ｜ `sourceMap(v4)`

类型：`boolean | string`<br>
默认值：`false`

控制是否生成，以及如何生成 source map

### etc.

## 其他
