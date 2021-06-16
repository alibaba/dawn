<h1 align="center">
  <img src="https://img.alicdn.com/tfs/TB1OjR6HQL0gK0jSZFAXXcA9pXa-1360-1360.png" alt="Dawn" width="200">
  <br>Dawn<br>
</h1>

<h4 align="center">Lightweight task management and build tool.</h4>

<p align="center">
  <a href="https://github.com/alibaba/dawn/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@dawnjs/cli.svg" alt="LICENSE">
  </a>
  <a href="https://www.npmjs.com/package/@dawnjs/cli">
    <img src="https://img.shields.io/npm/v/@dawnjs/cli.svg" alt="npm version">
  </a>
  <a href="https://github.com/alibaba/dawn/actions/workflows/main.yml">
    <img src="https://github.com/alibaba/dawn/actions/workflows/main.yml/badge.svg" alt="CI">
  </a>
  <a href="https://www.npmjs.com/package/@dawnjs/cli">
    <img src="https://img.shields.io/npm/dt/@dawnjs/cli.svg" alt="npm downloads">
  </a>
</p>

<pre align="center">npm i <a href="https://www.npmjs.com/package/@dawnjs/cli">@dawnjs/cli</a> -g</pre>

[README in English](README-intl.md)

Dawn 取「黎明、破晓」之意，原为「阿里云·业务运营团队」内部的前端构建和工程化工具，现已完全开源。它通过 `pipeline` 和 `middleware` 将开发过程抽象为相对固定的阶段和有限的操作，简化并统一了开发人员的日常构建与开发相关的工作。

## 特点

- 采用中间件技术，封装常用功能，易于扩展，方便重用
- 支持 pipeline 让多个 task 协同完成构建任务
- 简单、一致的命令行接口，易于开发人员使用
- 支持基于「中心服务」管理中间件和工程模板
- 支持搭建私有中心服务，并统一下发构建规则，易于团队统一管理

## 安装

```sh
$ npm install @dawnjs/cli -g
```

## 使用

```sh
# 1. 创建 & 初始化
$ dn init -t front

# 2. 开发 & 实时编译
$ dn dev

# 3. 语法检查 & 测试
$ dn test

# 4. 构建 & 打包
$ dn build
```

## 示例（.dawn.yml 或 .dawn 目录）

```yml
# 启动开发服务
dev:
  - name: '@dawnjs/dn-middleware-webpack'
    env: development
    entry: ./src/*.js
    template: ./assets/*.html
    serverOpts:
      port: 8001

# 直接构建
buid:
  - name: '@dawnjs/dn-middleware-webpack'
    env: production
    entry: ./src/*.js
    template: ./assets/*.html
```

## 文档

- 使用入门：[getting-started.md](docs/markdowns/getting-started.md)
- 配置 Pipeline：[pipeline.md](docs/markdowns/pipeline.md)
- 中间件：[middleware.md](docs/markdowns/middleware.md)
- 更多文档：[https://alibaba.github.io/dawn/docs/](https://alibaba.github.io/dawn/docs/)

## 其它

- [贡献](CONTRIBUTING-zh.md)
- [更新日志](CHANGELOG.md)
- [MIT 协议](https://tldrlegal.com/license/mit-license)
