---
group: middleware
name: dll
title: Dll
---

## dn-middleware-dll

Dll 中间件可用于将所有第三方依赖打包为独立的 `lib` 文件，以提高项目的构建速度，大多数情况能够下，对比不启用时能节省超过 `2/3` 的时间。

### 使用
```yml
dev:
  - name: clean
  - name: dll
  - name: webpack
```

`dll` 中间件必须放在 `webpack` 中间件之前，并且每个 `dll` 中间件只对它后边第一个 `webpack` 中间件生效。

`dll` 中间件还有两个选项，分别为：
- `cache` 分别用于开启或关闭缓存
- `lib` 用于指定生成的 `库文件` 的文件名称

```yml
dev:
  - name: clean
  - name: dll
    cache: false     # 默认为 true 启用缓存
    lib: vendors     # 默认为 lib
  - name: webpack
```