---
group: template
name: front
title: 普通前端工程
---

## dn-template-front

这是一个基础的前端工程模板，没有集成任何框架，但相关配置是完整的，默认已经支持：

- 新语法，已针对 es6/7 几乎所有新语法做自动转译。
- 单元测试，已启用 unit 中间件

通过 `front` 模板初始化一下工程

```sh
$ dn init -t front
```

如果你的 dn 连接的是默认服务，也可以从模板列表中选择

```sh
$ dn init
```

可以在类似如下的菜单中选择 `front` 模板
```sh
? Found 3 templates (Use arrow keys)
❯ 1. front      : Blank front end project template
  2. node       : Blank node project template
  3. middleware : Dawn middleware project template
```

工程初始化完成后，就可以使用 `dn` 相关命令进行开发构建了。

你还可以在此工程的基础上集成相关框架、比如 react/vue 等，并发布为新的模板。