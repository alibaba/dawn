---
group: middleware
name: dev-server
title: Dev Server
index: 2
---

## Server 中间件

Server 中间件用于在本地启动一个开发服务器。

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

### 配置代理

使用 dawn 创建的工程，根目录下有一个 server.yml 配置文件，server 中间件会读取其中的配置。如果需要将请求转发到你的后端服务上，可以如下配置：

```yml
proxy:
  rules: 
    ^/api(.*): 'https://www.aliyun.com/'
```

请求到 /api/xxx 现在会被代理到请求 https://www.aliyun.com/api/xxx