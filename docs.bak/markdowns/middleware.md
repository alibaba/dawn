---
group: guide
name: middleware
title: 开发中间件
index: 3
---

# 开发一个中间件


通常，应该先看看是否已经存在满足您需求的中间件，查看「推荐的中间件」，可以通过如下命令：

```sh
$ dn middleware [keyword]
```

示例:
```sh
$ dn middleware webpack
? Found 3 templates (Use arrow keys)
❯ 1. webpack        : 基于 Webpack 的构建中间件（无缝升级）
  2. webpack2       : 基于 Webpack2 的构建中间件
  3. webpack1       : 基于 Webpack1 的构建中间件
```

通过「上下方向键」可以选择指定中间件，然后「回车」可以查看对应中间件的在线使用说明。

当您决定要开发一个新的中间件时，您可以通过 dn init 命令，然后选择「中间件工程模板」即可快速创建一个「中间件」，如下：

```sh
$ dn init
? Found 3 templates (Use arrow keys)
  1. front      : Front Project Template
  2. node       : Node.js Project Template
❯ 3. middleware : Middleware Project Template
```

Dawn 的中间件和 Koa 中间件类似，中间件核心基础代码结构如下：

```js
/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {

    //在这里处理你的逻辑
    this.console.log('This is an example');

    //next 触发后续执行
    //如果需要在后续中间件执行完成再做一些处理
    //还可以 await next(); 并在之后添加逻辑
    next();

  };

};
```

中间件是一个标准的 npm 包，但是要求必须命名为 `dn-middleware-xxx` 这样的格式，开发完成后直接通过 `npm publish` 发布就行了。

### 提交到推荐列表
如果希望将你的中间件添加到「推荐中间件列表」，请 fork [https://alibaba.github.io/dawn](https://alibaba.github.io/dawn) 后，编辑 `docs/middleware.yml`，然后，发起一个 Pull Request 就行了。