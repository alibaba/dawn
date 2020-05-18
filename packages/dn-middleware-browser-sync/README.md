---
group: middleware
name: browser-sync
title: Browser-sync
---

# dn-middleware-browser-sync

[![npm](https://img.shields.io/npm/v/dn-middleware-browser-sync)](https://www.npmjs.com/package/dn-middleware-browser-sync)
[![npm](https://img.shields.io/npm/dw/dn-middleware-browser-sync)](<(https://www.npmjs.com/package/dn-middleware-browser-sync)>)
[![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/dn-middleware-browser-sync)](https://libraries.io/npm/dn-middleware-browser-sync)<br>
![node-current](https://img.shields.io/node/v/dn-middleware-browser-sync)

Browser-sync 中间件配合 server 中间件使用，方便在开发时自动刷新浏览器，以及在多个标签页间同步状态。

_说明：dn-middleware-browser-sync@2 要求 dn-middleware-server 的版本 >= v2.0.0，dn-middleware-server 版本小于 2.0.0 的请安装 dn-middleware-browser-sync@0.1.0_

## 示例

```yml
dev:
  - name: server
  - name: browser-sync
```

## 配置项说明

### `files`

类型：`string[]`<br>
默认值：`['./build/**/*']`

### `port`

类型：`number`<br>
默认值：`5001`

BrowserSync ui 端口号
