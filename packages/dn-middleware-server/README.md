---
group: middleware
name: server
title: Server
---

# dn-middleware-server

[![npm](https://img.shields.io/npm/v/dn-middleware-server)](https://www.npmjs.com/package/dn-middleware-server)
[![npm](https://img.shields.io/npm/dw/dn-middleware-server)](<(https://www.npmjs.com/package/dn-middleware-server)>)
[![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/dn-middleware-server)](https://libraries.io/npm/dn-middleware-server)<br>
![node-current](https://img.shields.io/node/v/dn-middleware-server)

Server 中间件用于在本地启动一个开发服务器。

## 功能亮点

- 轻量通用，与构建打包工具无特殊耦合
- 支持 `HTTPs`
- 支持 `browser-sync`

## 示例

```yml
dev:
  - name: server

server:
  - name: server
    host: local.aliyun.com # 需要绑定 host
    port: 3000
```

## 配置项说明

### `host`

类型：`string`<br>
默认值：`localhost`

开发服务的 HOST，默认为 `localhost`，对开发域名有要求的可以绑定 hosts 后在这里配置

### `port`

类型：`number`<br>
默认值：``

服务启动后的端口号，若不填写将自动获取一个可用端口

### `protocol`

类型：`"http://" | "https://"`<br>
默认值：`"http://"`

服务协议，当开启 `ssl` 配置或前置 `https` 中间件时将自动变更，一般不需要手动设置

### `public`

类型：`string`<br>
默认值：`./build`

开发服务的根目录，一般为编译打包产物的目录

### `autoOpen`

类型：`boolean`<br>
默认值：`true`

是否在服务启动后自动打开浏览器

### `ssl`

类型：`true | { key: string; cert: string }`<br>
默认值：``

是否开启 `HTTPs` 服务，支持多种方式：

1. 配置 [https 中间件](https://www.npmjs.com/package/dn-middleware-https)

  ```yaml
  dev:
    - name: https
    - name: server
  ```

2. `ssl: true`

  效果与使用 https 中间件相同

3.  `ssl: { key: [path_to_key], cert: [path_to_cert] }`

  配置 ssl 所需的 key/cert 文件目录地址

_说明：任何开启 HTTPs 的方式，都建议配置一个 host，直接用 IP 会导致证书不匹配，浏览器提示「非安全链接」_

### `historyApiFallback`

类型：`boolean`<br>
默认值：`false`

配合 `BrowserHistory`，所有「非资源的」的请求都会返回 `/` 的结果

_说明：开启后将会为所有 HTML 的 `<head />` 标签内添加 `<base href="/" />`_

### `configPath`

类型：`string`<br>
默认值：`./server.yml`

高阶配置项的文件目录，包括代理等

## 进阶配置项说明

通过 `configPath` 指定进阶配置项的配置文件路径，默认不指定为 `${cwd}/server.yml`

### 示例

```yaml
headers:
  'Access-Controll-Allow-Origin': '*'
  'Set-Cookie': 'client=dawn; path=/; secure;'

proxy:
  options:
    changeOrigin: true
    xfwd: true
  rules:
    ^/api(.*): https://query.aliyun.com
    ^/rest/.*: https://query.aliyun.com

handlers:
  '/handler/all': './route/all'
  'GET /handler/get': './route/get'
  'POST /handler/post': './route/post'
  'GET /handler/params/:id': './route/params'
```

### `headers`

类型：`object`<br>
默认值：`{}`

设置响应头，常见的如 CORS、SetCookie 等

### `proxy.rules`

类型：`object`<br>
默认值：`{}`

接口代理设置，`key` 为接口路径的正则匹配表达式，`value` 为 `target(https://aliyun.com=protocol+host+port)`

几个例子：

```yaml
proxy:
  rules:
    # `/api/foo/bar` => `https://www.aliyun.com/foo/bar`
    ^/api(.*): https://www.aliyun.com
    # `/rest/foo/bar` => `https://www.aliyun.com/rest/foo/bar`
    ^/rest/.*: https://www.aliyun.com:443
```

### `proxy.rules`

类型：`object`<br>
默认值：`{}`

`http-proxy` 的配置项，默认不需要配置，如有更改的需求请[查看文档](https://www.npmjs.com/package/http-proxy)

### `handlers`

类型：`object`<br>
默认值：`{}`

给开发服务 `dev server` 添加一些 `controller`，一些示例：

```yaml
handlers:
  # 匹配所有 method
  '/handler/all': './route/all'
  # 匹配 GET 请求，请求地址：/handler/get
  # Controller 文件地址 `${cwd}/route/get.js`
  'GET /handler/get': './route/get'
  'POST /handler/post': './route/post'
  'GET /handler/params/:id': './route/params'
```

```javascript
// ${cwd}/route/get.js
module.exports = async ctx => {
  // ctx.query
  // ctx.request.body
  // ctx.params => /restfull/:id
  return { code: 200 };
};
```

## 结合 browser-sync

```yaml
dev:
  - name: server
  - name: browser-sync
```
