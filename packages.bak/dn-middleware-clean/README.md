---
group: middleware
name: clean
title: 目录清理
---

## 清理中间件

一般用于清理构建结果目录

示例
```yml
build:
  - name: clean
    target: ./build/**/*.*    # 指定清理的目录或文件，默认为 build 目录
  - name: webpack2
```