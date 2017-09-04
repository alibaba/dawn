---
group: middleware
name: faked
title: 数据模拟
---

## Faked 中件间

Faked 用一个用于 mock 后端 API 的中间件

### 特点
- 支持 mock 静态数据或逻辑
- 支持 fetch/jsonp/ajax
- 支持 RESTFul api 
- 同时支特手写 mock 代码或通过 GUI 配置
- 不依赖 WebServer 降低单测的成本

### 使用

```sh
dev:
  - name: faked
    port: 6002
  - name: webpack2
```

放到 webpack 中间件前即可，port 选项可指定 GUI 端口，省略将自动选取可用端口

### 从 mock2easy 迁移到 faked

在 pipe 中添加 faked 中件间，同时移除 mock2easy 的配置，将设定 m2f 选项，如下：
```sh
dev:
  - name: faked
    port: 6002
    m2f: true
  - name: webpack2
```

在首次启动时，会自动进行数据迁移。

#### 迁移注意事项
- 如果接口本身存在配置错误，会被舍弃
- 如果接口本身指定的 method 和实际请求不一致，会无法匹配（因 mock2easy 对 method 并没有真实的检查）
- 部分 ng 工程在 xxx.html 中手动引入了 cdn 资源将无法匹配，请在引入 ng 之前引入 faked (https://unpkg.co/faked@1.0.10/dist/faked.js)