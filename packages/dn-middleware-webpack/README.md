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

 ## 环境配置

 有时，我们开发应用时，希望在不同环境有不同的配置，比如开发时请求 /api 这样的 URL，然后做本地代理或 mock，线上请求真实的 API，或有可能是其它域名下的服务，这是应该让「环境配置」出场了，基于 midway/eggjs 写过 Node.js 应用的同学可能都知道，有 config.<环境>.js 这样的配置，那么，dawn 的 webpack 中间件让你在前端也能用环境配置

```sh
src/
├── config.build.yml
├── config.dev.yml
├── config.yml
```

如上，可以在应用的 src 目录中添加 `config.xxx.yml`，并在其中添加不同的配置，其中 `config.yml` 是默认配置，在所有环境都有效，如果对应的环境配置有与其中有相同的配置以环境配置为准，比如，我们可以这样

在 config.dev.yml 中编辑开发配置

```yaml
serviceUri: /api
```

执行 dn dev 时这个配置将生效

在 config.build.yml中编辑发布配置

```yaml
serviceUri: https://xxx.aliyun.com/efg/
```

执行 dn build 时这个配置会生效

然后，就可以在项目的代码中读取配置了，类似这样

```js
import conf from '$config';

function xxxx(){
  return  ajax(`${conf.serviceUri}/your-path`)
}
```

通过环境配置就能让前端应用根据环境不同请求到不同的地址了。需要注意是与后端应用的环境配置不同，dawn 的环境配置作用于「构建阶段」，是在编译时期确定的环境并进行了条件编译。
