## 简介
这是一个基于 Webpack2 的构建中件间

## 特点
- 支持多页面，可通过 glob 语法，指定多入口，可共用页面模板，也可根据名称匹配
- 支持排除库文件
- 支持抽离当前项目中的公共模块或资源
- 支持自定义 webpack.config.js 配置，还可通过 config 选项指定配置文件路径

以上都可以在 pipe.yml 中配置完成，用于不同的工程模板时作者可根据情况有不同配置。

## 示例
```yml
dev:
  - name: webpack2
    watch: true                     # 是否开启 watch，开启后，文件发生变化时将会实时增量编译
    entry: ./src/*.js               # 将 src 下所有 .js 文件作为入口（不包括子目录中的 js,）
    template: ./src/assets/*.html   # 将 assest 下的所有 html 作为页面模板 

build:
  - name: webpack2
    watch: false
    entry: ./src/*.js               # 将 src 下所有 .js 文件作为入口（不包括子目录中的 js,）
    template: ./src/assets/*.html   # 将 assest 下的所有 html 作为页面模板 
    externals:                      # 声明排除的库文件，将不会打入 chunks 中
      jquery: jQuery 
    common:
      disabled: true                # 禁用抽取公共部分
      name: 'common'                # 生成的公共资源名称
    cssModules: true                # 是否启用 css modules 方案,
    folders:                        # 指定资源子目录名称
      js: js
      css: css
      font: font
      img: img
``` 

注意：
- entry 和 template 的值都可以是一个数组，当 template 只有一个文件时将作为公共模板，所有 chunk 共用
- entry 的默认值为 ./src/\*.js，tempalte 的默认值为 ./src/assets/\*.html
- entry 和 template 还可以用 map 形式配置

## 自定义 webpack.config.js
 webpack2 中间件，允行开发者自定义「构建配置」，开发者只需要在当前工程根目录添加 `webpack.config.js` 文件即可，示例：
 
 ```js
 module.exports = function(configs,webpack,ctx){
   //configs 为默认配置，可以在这里对其进行修改
   //webpack 当前 webpack 实例
   //ctx 当前构建上下文件实例
 };
 ```

 另外，开发者还可以自定义 configFile 文件路径，如下：

 ```yml
 dev:
  - name: webpack2
    watch: true
    configFile: ./wp.conf.js
 ```

 如上边的示例，在 dev 时 webpack2 中件间将会加载名为 `wp.conf.js` 的构建配置