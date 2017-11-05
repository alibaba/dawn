![Banner](docs/assets/banner-sm.jpg)

# Dawn

[In English the README](README-intl.md)

Dawn 取「黎明、破晓」之意，原为「阿里云·业务运营团队」内部的前端构建和工程化工具，现已完全开源。它通过 `pipeline` 和 `middleware` 将开发过程抽象为相对固定的阶段和有限的操作，简化并统一了开发人员的日常构建与开发相关的工作。

[![npm](https://img.shields.io/npm/l/dawn.svg)](LICENSE.md)
[![NPM Version](https://img.shields.io/npm/v/dawn.svg)](https://www.npmjs.com/package/dawn)
[![Build Status](https://www.travis-ci.org/alibaba/dawn.svg?branch=master)](https://www.travis-ci.org/alibaba/dawn)
[![Coverage Status](https://coveralls.io/repos/github/alibaba/dawn/badge.svg?branch=dev)](https://coveralls.io/github/alibaba/dawn?branch=dev)
[![npm](https://img.shields.io/npm/dt/dawn.svg)](https://www.npmjs.com/package/dawn)

## 特点

- 采用中间件技术，封装常用功能，易于扩展，方便重用
- 支持 pipeline 让多个 task 协同完成构建任务
- 简单、一致的命令行接口，易于开发人员使用
- 支持基于「中心服务」管理中间件和工程模板
- 支持搭建私有中心服务，并统一下发构建规则，易于团队统一管理

## 安装

```sh
$ npm install dawn -g
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
  - name: webpack
    entry: ./src/*.js
    template: ./assets/*.html
    watch: true
  - name: server
    port: 8001
    
# 直接构建
buid:
  - name: webpack
    entry: ./src/*.js
    template: ./assets/*.html
```

## 文档

- 使用入门：[getting-started.md](https://alibaba.github.io/dawn/docs/#!/zh/guide/getting-started)
- 配置 Pipeline：[pipeline.md](https://alibaba.github.io/dawn/docs/#!/zh/guide/pipeline)
- 中间件：[middleware.md](https://alibaba.github.io/dawn/docs/#!/zh/guide/middleware)
- 更多文档：[https://alibaba.github.io/dawn/docs/](https://alibaba.github.io/dawn/docs/)

## 其它

- [贡献](CONTRIBUTING-zh.md)
- [更新日志](CHANGELOG.md)
- [MIT 协议](https://tldrlegal.com/license/mit-license)