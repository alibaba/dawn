---
group: middleware
name: unit
title: 单元测试
index: 2
---

## 单元测试中间件

示例：

```yml
test:
  - name: lint
  - name: unit
```

默认测试代码目录为 ./test/unit，如需要自定义，参考下边的示例

```yml
test:
  - name: lint
  - name: unit
    files: ./**/*.test.js
```

一般情况，不建议自定义测试代码目录