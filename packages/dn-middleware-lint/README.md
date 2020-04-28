---
group: middleware
name: lint
title: 静态检查
---

# lint 中间件

## 简介

基于 `eslint/prettier` 的语法检查中间件，lint 规则基于 `eslint-config-dawn`。 

## 用法

默认配置，支持 JavaScript/TypeScript/React/NodeJS 等多种项目类型，并自动识别。

```yml
test:
  - name: lint
```

其它选项

```yml
test:
  - name: lint
    autoFix: true # 默认是 true，开启 prettier 和 eslint 的自动修复
    realtime: false # 默认是 false，可结合 webpack 等中间件实现开发时实时 lint
```
