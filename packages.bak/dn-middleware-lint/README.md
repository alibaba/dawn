---
group: middleware
name: lint
title: 静态检查
---

## lint 中间件

### 简介
基于 eslint 的语法检查中间件

### 用法

默认配置
```yml
test:
  - name: lint
```

默认会检查 `./lib`、`./src`、`./app` 三个目录

自定义检查目录
```yml
test:
  - name: lint
    source: ./xxx ./yyy         # 空格隔开多个目录
```

其它选项
```yml
test:
  - name: lint
    disabled: true              # 禁用，一般不要用这个选项，只有在旧工程中临时禁用
    global: $,jQuery:true       # 声明全局变量
    ignore: './src/**/*.jsx'    # 不检查 jsx 文件
    ext: .js,.jsx               # 检查的扩展名，默认为 .js,.jsx
    env: browser,node           # 环境，默认为 browser,node
```