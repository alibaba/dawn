# 配置中间件

在指定的 pipe 中配置

```yml
publish:
  - name: grep
    mode: exclude         # 排除模式找到时中止，包含模式找不到时中止
    src: ./build/**/*.js  # 指定扫描的文件或目录
```

# 指定关键词
在项目根目录添加 .greprc，格式为 yaml，如下
```yml
words:
  - 'let '
  - 'const '
  - '.find'
  - '.findIndex'
  - '=>'
  - 'class '
```