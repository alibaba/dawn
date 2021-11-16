# @dawnjs/dn-middleware-lint

## 简介

基于 `eslint/prettier` 的语法检查中间件，lint 规则基于 `@dawnjs/eslint-config-dawn`。

## 用法

### 默认配置

支持 JavaScript/TypeScript/React 等多种项目类型，并自动识别。

```yml
test:
  - name: '@dawnjs/dn-middleware-lint'
```

### 其它选项

```yml
test:
  - name: '@dawnjs/dn-middleware-lint'
    noEmit: false # 仅准备配置文件，不执行实际 lint
    autoFix: true # 默认是 true，开启 prettier 和 eslint 的自动修复
    realtime: false # 默认是 false，可结合 webpack 等中间件实现开发时实时 lint
    staged: false # 默认是 false，可结合 husky 等修改 precommit hook
    prettier: false # 默认是 false，开启后会执行 prettier --write，可能会导致 lint 执行时间加长
    cache: false # 默认是 false，开启后会缓存未修改过文件的上一次 Lint 结果，缓存路径为 `${cwd}/node_modules/.cache/.eslintcache`
```

### 配合 Git Hook

在 precommit hook 时增加对 stage file 的检查。

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "dn run precommit"
    }
  }
}
```

```yaml
# .dawn/pipe.yml
precommit:
  - name: '@dawnjs/dn-middleware-lint'
    staged: true
```

## 从旧版本(1.x 2.x)迁移

项目根目录下执行 (c)npm 命令，安装新的包依赖版本

```bash
$ npm uninstall dn-middleware-lint && npm install -D @dawnjs/dn-middleware-lint@latest
```
