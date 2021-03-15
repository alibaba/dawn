---
group: middleware
name: webpack
title: Webpack
index: 1
---

## Webpack 中间件

这是一个基于 `webpack3` 的构建中间件，默认能处理「js/jsx/ts/less/css/image/font」等文件

## 特点
- 支持多页面，可通过 glob 语法，指定多入口，可共用页面模板，也可根据名称匹配
- 支持排除库文件，比如 React/Vue
- 支持抽取当前项目中的公共模块或资源，生成 common 文件
- 支持自定义 `webpack` 配置，还可通过 `config` 选项指定配置文件路径

以上都可以在 `pipe.yml` 中配置完成，用于不同的工程或模板时作者可根据情况有不同配置。

## 示例
```yml
dev:
  - name: webpack
    watch: true                     # 是否开启 watch，开启后，文件发生变化时将会实时增量编译
    entry: ./src/*.js               # 将 src 下所有 .js 文件作为入口（不包括子目录中的 js,）
    template: ./src/assets/*.html   # 将 assest 下的所有 html 作为页面模板 

build:
  - name: webpack
    entry: ./src/*.js               # 将 src 下所有 .js 文件作为入口（不包括子目录中的 js,）
    template: ./src/assets/*.html   # 将 assest 下的所有 html 作为页面模板 
    externals:                      # 声明排除的库文件，将不会打入 chunks 中
      jquery: jQuery 
    common:
      disabled: true                # 是否禁用抽取公共部分
      name: 'common'                # 生成的公共资源名称
    cssModules: true                # 是否启用 css modules 方案
    output: build                   # 构建结果目录，默认为 build
    folders:                        # 指定资源子目录名称
      js: js
      css: css
      font: font
      img: img
``` 

注意：
- `entry` 和 `template` 的值都可以是一个数组，当 `template` 只有一个文件时将作为公共模板，所有 chunk 共用
- `entry` 的默认值为 `./src/\*.js`，tempalte 的默认值为 `./src/assets/\*.html`
- `entry` 和 `template` 还可以用 `map` 形式配置

## 合并自定义 webpack 配置
 `webpack` 中间件，允行开发者自定义「构建配置」，开发者只需要在当前工程根目录添加 `webpack.config.js` 文件即可，示例：
 
 ```js
 module.exports = function(configs,webpack,ctx){
   //configs 为默认配置，可以在这里对其进行修改
   //webpack 当前 webpack 实例
   //ctx 当前构建「上下文实例」
   configs.module.loaders.push(<your_loader>);
 };
 ```

 另外，开发者还可以通过 `config` 自定义「配置文件路径」，如下：

 ```yml
 dev:
  - name: webpack
    watch: true
    configFile: ./wp.conf.js
 ```

 如上边示例，在 dev 时 webpack 中间件将会加载名为 `wp.conf.js` 的构建配置

 ## 完全自定义 webpack 配置

 除了合并部分自定义的配置，还可以完全使用自定义的 webpack 配置，如下

 ```js
 module.exports = {
   ...
   <your_config>
   ...
 };
 ```

 当然，如果目前的 `webpack` 中间件，不能满足需求时，可以通过 issue 或 pr 参与改进 webpack 中间件，甚至重新写一个新的中间件。