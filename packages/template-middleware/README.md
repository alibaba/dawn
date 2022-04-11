## @dawnjs/dn-template-middleware

中间件模板，用于快速的创建一个 Dawn 中间件工程，和普通的中间件模板相比，支持使用 TS 编写模板。

### 创建一个中间件

```sh
$ dn init -t @dawnjs/dn-template-middleware
```

### 开发中间件

修改 `src/` 目前下的文件，实现中间件逻辑

### 构建发布

```sh
$ npm run build # 构建中间件
$ npm test # 测试
$ npm publish # 发布中间件，注意修改版本号
```
