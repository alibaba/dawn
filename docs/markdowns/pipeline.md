---
group: guide
name: pipeline
title: 配置 Pipeline
index: 1
---

# 配置 Pipeline

Dawn 的每个工程中都需要包含对应的 pipeline 配置，在 pipe 配置中定义了「每个命令」对应的任务，配置可以是 `yml/json/js` 格式，但是通常建议用更易于阅读的 `yml` 格式，需要放到「工程根目录」，配置的名称为 `.dawn` 可以是一个目录，也可以是一个文件。

### 使用单一个配置文件

在工程根目录新建一个 `.dawn.yml` (也可以是 .dawn.json 或 .dawn.js)，下边是 `yml` 格式的配置

```yml
pipe:
  build:
    - name: lint
    - name: webpack
      output: dist
```

如上配置，在执行 `dn build` 时，就会先进行语法检查，然后用 webpack 完成项目构建并将构建结果放入 dist 目录。

### 使用目录作为配置

在工程根目录新建一个 `.dawn` 的目录，然后在 `.dawn` 目录中新建一个 `pipe.yml` 的文件，如下

```
build:
  - name: lint
  - name: webpack
    output: dist
```

如上示例，「目录形式」的配置和之前的「文件形式」的配置一样，执行 `dn build` 就可以完成构建

### Pipe 的执行

每个 pipe 中可以放任意多个「中间件」，在执行时会创建一个 `context` 实例，然后，依次执行每个中间件，所有中间件都能访问 `context` 实例对象。

#### 示例
```
demo:
  - name: shell
    script:
      - echo 1
  - name: shell
    script:
      - echo 2
  - name: shell
    script:
      - echo 3
```

执行 `dn run demo`，控制台将会执次打印 `1 2 3`，每个中间件的配置选项有两个「保留的名称」

- name: 用于指定中间件 package 名称，可以是完整的名称 `dn-middleware-xxx` 也可以是省略前缀的 `xxx`
- location: 用于指定中间件入口文件的位置，一般用于本地调试，或内置在模板中不想独立发布的中间件

不同的中间件通常会有对应的其他配置项，可以参考中间件自身的说明文档。

#### 注意
> name 还可以包含 `version`，例如 `dn-middleware-xxx@1.0.0`，也可以包含 `scope` 例如 `@scope/dn-middleware-xxx`，或同时包含 `scope` 和 `version`，例如 `@scope/dn-middleware@1.0.0`