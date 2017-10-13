# dn-middleware-ref

通过 `ref` 中间件，在制作一个 dawn 模板时，可以引用其它模板作为基础模板，然后再叠加上当前模板的变更。

## 使用

使用这个模板需要先安装好 Dawn [https://github.com/alibaba/dawn](https://github.com/alibaba/dawn)

在模板 `init` 的 `pipeline` 中添加 `ref` 配置即可，如下

```yml
init:
  - name: ref
    template: front
  - name: pkginfo
```

`template` 可是以是一个模板名称，也可以一个数组，当为数据时会依次叠加指定的模板，如下

```yml
init:
  - name: ref
    template: 
      - front
      - react
  - name: pkginfo
```

注意，`ref` 中间件，必须是 init 的第一个中间件。