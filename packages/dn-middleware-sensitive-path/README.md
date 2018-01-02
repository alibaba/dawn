# dn-middleware-sensitive-path

Linux 对路径大小写是「敏感」的，而不少开发同学平时是在 Mac 甚至是 Windows 上完成开发，有可能你曾经历过在本地构建和测试都没有问题，当在以 Linux 为基础环境的 CI 上构建时失败，或发布后提示模块找不到，那这个插件将会帮助你。

### 如何使用？

`sensitive-path` 没有任何多余的选项，在 `webpack` 中间件前启用即可，如下

```yaml
build:
  - name: sensitive-path
  - name: webpack
```

启用插件后，将在 mac 和 windows 上也对路径大小写敏感，并且构建时会提示「已强制启用区分模块路径大小写」。