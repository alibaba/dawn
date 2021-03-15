---
group: guide
name: getting-started
title: 使用入门
index: 0
---

# 使用入门

### Dawn 是什么？

Dawn 取「黎明、破晓」之意，原为「阿里云·业务运营团队」内部的前端构建和工程化工具，现已完全开源。它通过 `pipeline` 和 `middleware` 将开发过程抽象为相对固定的阶段和有限的操作，简化并统一了开发人员的日常构建与开发相关的工作。


### 有什么特点？

- 采用中间件技术，封装常用功能，易于扩展，方便重用
- 支持 pipeline 让多个 task 协同完成构建任务
- 简单、一致的命令行接口，易于开发人员使用
- 支持基于「中心服务」管理中间件和工程模板
- 支持搭建私有中心服务，并统一下发构建规则，易于团队统一管理


### 安装和更新

依赖的环境、软件及其版本：
- Node.js v7.6.0 及以上版本
- Mac/Linux (Windows 基本支持未经严格测试)

安装或更新 Dawn:

```sh
$ [sudo] npm install dawn -g
```
中国大陆用户可以使用 cnpm 加速安装


### 初始化工程

```sh
$ dn init [template] [options]
```

示例：
```sh
$ dn init 
? Found 4 templates (Use arrow keys)
❯ 1. front      : Blank front end project template
  2. node       : Blank node project template
  3. middleware : Dawn middleware project template
  4. react      : Based on react-scripts, like create-react-app
```
选择一个工程类型，回车即可按向导初始化一个工程，还可以通过 `-t` 或 `--template` 直接按指定的模板名称，直接初始化工程。

比如，通过名为 `front` 的模板，初始化一个工程
```sh
$ dn init -t front
```


### 启动开发服务

```sh
$ dn dev 
```
如果是一个「前端」工程通常会启动构建进程并监听文件的变化，通常，还会启动一个 `Web Server`，并自动打开浏览器。


### 执行检查和测试

```sh
$ dn test
```
在执行 test 的时候会先进行「语法检查」（通过 eslint），然后执行「单元测试」和「E2E 测试」。


### 构建工程

```
$ dn build
```

执行构建任务，不同的工程类型的构建过程和结果可能不同，取决于初始化工程时使用的工程模板。
完成后，会在当前项目的根目录产生 **build** 目录，这是构建结果，当然，也可以指定为其它目录名称。


### 发布工程

```
$ dn publish
```

可以通过 `dn publish` 命令发布代码和构建结果，不同的工程模板决定了最终发布位置，是否支持 `publish` 命令取决于选择的「工程模板」。


### 执行自定义任务

init/dev/build/test/publish 这几个命令可以直接作为「子命令」写在 dn 后边，对于其它名称的 `pipeline` 需要使用 `run` 命令

编辑 `.dawn/pipe.yml` 或 `.dawn.yml`

```yaml
demo:
  - name: shell
    script:
      - echo demo
```

可以通过如下方法执行 demo

```sh
dn run demo
```