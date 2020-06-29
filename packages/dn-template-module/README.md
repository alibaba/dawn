---
group: template
name: module
title: 单 SDK 项目 TS 模板
---

## dn-template-module

这是一个空的单 SDK 项目 TS 模板，没有集成任何框架，但相关配置是完整的，默认已经支持：

- 输出为 ES 模块
- 输出为 CJS 模块
- 输出为 UMD 模块
- 单元测试，已启用 unit 中间件

通过 `module` 模板初始化一下工程

```sh
$ dn init -t module
```

如果你的 dn 连接的是默认服务，也可以从模板列表中选择

```sh
$ dn init
```

可以在类似如下的菜单中选择 `module` 模板
```sh
? Found 3 templates (Use arrow keys)
❯ 1. module       : 单SDK项目TS模板
  2. node         : Blank node project template
  3. middleware   : Dawn middleware project template
```

工程初始化完成后，就可以使用 `dn` 相关命令进行开发构建了。
