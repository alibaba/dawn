# @dawnjs/dn-middleware-jest

[![npm](https://img.shields.io/npm/v/@dawnjs/dn-middleware-jest)](https://www.npmjs.com/package/@dawnjs/dn-middleware-jest)
[![npm](https://img.shields.io/npm/dw/@dawnjs/dn-middleware-jest)](https://www.npmjs.com/package/@dawnjs/dn-middleware-jest)
<!-- [![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/@dawnjs/dn-middleware-jest)](https://libraries.io/npm/@dawnjs/dn-middleware-jest)<br>
![node-current](https://img.shields.io/node/v/@dawnjs/dn-middleware-jest) -->

Jest 单元测试中间件

## 功能亮点

- 支持零配置快速集成单元测试
- 支持丰富的扩展能力
- 与其他 testing library 友好集成

## 示例

```yml
# 简单使用
unit:
  - name: jest

# watch mode
unit:watch:
  - name: jest
    watch: true

# 更多参数
unit:argv:
  - name: jest
    argv:
      - --cache
      - --ci
```

更多 CLI config 请参考: [https://jestjs.io/zh-Hans/docs/cli](https://jestjs.io/zh-Hans/docs/cli)

## 配置项说明

### `watch`

类型：`boolean`<br>
默认值：`false`

监视文件更改，并重新运行与已更改的文件相关的测试

### `watchAll`

类型：`boolean`<br>
默认值：`false`

监视文件的更改并在任何更改时重新运行「所有测试」

### `coverage`

类型：`boolean`<br>
默认值：`true`

将测试覆盖率信息输出为报告

### `debug`

类型：`boolean`<br>
默认值：`false`

打印关于 Jest 配置的调试信息

### `silent`

类型：`boolean`<br>
默认值：`false`

阻止所有测试通过控制台输出信息

### `argv`

类型：`string[]`<br>
默认值：`null`

所有 Jest CLI 支持的命令行参数，请查看文档：[https://jestjs.io/zh-Hans/docs/cli](https://jestjs.io/zh-Hans/docs/cli)
