---
group: middleware
name: dev-server
title: Dev Server
index: 2
---

## Server 中间件

示例：

```yml
dev:
  - name: server
    port: 8001       
    public: ./build
    autoOpen: true
```

其中，`port`、`public`、`autoOpen` 都是可选参数，如下

* port: 开发服务器要使用的端口
* public: 指定静态文件目录
* autoOpen: 是否自动打开浏览器窗口