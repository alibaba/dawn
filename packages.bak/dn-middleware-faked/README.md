---
group: middleware
name: faked
title: 数据模拟
---

## Faked 中间件

Faked 用一个用于 `mock` 后端 `API` 的中间件

### 特点
- 支持 mock 静态数据或逻辑
- 支持 mock `fetch/jsonp/ajax`
- 支持 RESTful api 
- 同时支特手写 `mock` 代码或通过 GUI 配置
- 不依赖 `WebServer` 降低单测的成本

### 使用

```sh
dev:
  - name: faked
    port: 6002
  - name: webpack2
```

放到 `webpack` 中间件前即可，`port` 选项可指定 `GUI` 端口，省略将自动选取可用端口
