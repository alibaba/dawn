![Banner](docs/assets/banner.png)

# Dawn

Dawn 取「黎明、破晓」之意， 是一个轻量的「任务管理和构建」工具。

[![npm](https://img.shields.io/npm/l/dawn.svg)](https://github.com/alibaba/dawn)
[![NPM Version](https://img.shields.io/npm/v/dawn.svg)](https://www.npmjs.com/package/dawn)
[![Build Status](https://www.travis-ci.org/alibaba/dawn.svg?branch=master)](https://www.travis-ci.org/alibaba/dawn)
[![Coverage Status](https://coveralls.io/repos/github/alibaba/dawn/badge.svg?branch=dev)](https://coveralls.io/github/alibaba/dawn?branch=dev)
[![npm](https://img.shields.io/npm/dt/dawn.svg)](https://www.npmjs.com/package/dawn)

- [English README](README.md)

## 特点

- 采用中间件技术，封装常用功能，易于扩展，方便重用
- 支持 pipeline 让多个 task 协同完成构建任务
- 简单、一致的命令行接口，易于开发人员使用
- 支持基于「中心服务」管理中件间和工程模板
- 支持搭建私有中心服务，并统一下发构建规则，易于团队统一管理

## 安装

```sh
$ npm install dawn -g
```

## 文档

- 使用入门：[getting-started.md](docs/mds/getting-started.md)
- 配置 Pipeline：[pipeline.md](docs/mds/pipeline.md)
- 中件间：[middleware.md](docs/mds/middleware.md)
- 更多文档：[https://alibaba.github.io/dawn/docs/](https://alibaba.github.io/dawn/docs/)

## 贡献

[贡献](CONTRIBUTING-zh.md)

## License

[MIT](https://tldrlegal.com/license/mit-license)