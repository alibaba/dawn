---
group: template
name: middleware-ts
title: 中间件模板（TS版）
---

## dn-template-middleware-ts

中间件模板，用于快速的创建一个 Dawn 中间件工程，和普通的中间件模板相比，支持使用 TS 编写模板。

创建一个中间件

```sh
$ dn init -t middleware-ts
```

如果你的 dn 连接的是默认服务，也可以从模板列表中选择

```sh
$ dn init
```

可在以类似如下的菜单中选择 `middleware` 模板

```sh
? Found 3 templates (Use arrow keys)
  1. front         : Blank front end project template
  2. node          : Blank node project template
  3. middleware    : Dawn middleware project template
❯ 4. middleware-ts : Dawn middleware project template with typescript support
```

工程初始化完成后，就可以使用 `dn` 相关命令进行开发构建了。
