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

`dll` 中间件还有四个选项，分别为：
- `cache` 开启或关闭缓存
- `libName` 指定生成的 `库文件` 的文件名称
- `vendors` 指定打包为 'lib' 的依赖包名列表
- `output` 指定输出目录

```yml
dev:
  - name: clean
  - name: dll
    cache: false       # 可省略，默认为 true 启用缓存
    output: ./scripts  # 可省略，默认为 ./build/js
    libName: xxx       # 可省略，默认为 lib
    vendors:           # 可省略，默认将从 package 中的 dependencies 解析
      - react
      - react-dom
  - name: webpack
```

注意，在 `vendors` 未指定时，将依据 `dependencies` 中的依赖配置生成 `lib`，所以此时一定要注意在 `dependencies` 不要放置项目执行无关的包，本地开发时才用到的依赖到请放到 `devDependencies`。