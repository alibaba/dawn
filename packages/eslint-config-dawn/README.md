# eslint-config-dawn

## Usage

`eslint-config-dawn` 是一个[可分享 ESLint 配置包](http://eslint.org/docs/developer-guide/shareable-configs.html)，支持 JavaScript、TypeScript、React 等项目类型。

在项目目录下添加 `.eslintrc.yml` 文件（也支持其他格式），继承对应类型的配置文件即可。

```yaml
# JavaScript + React (by default)
extends: dawn

# 两者等价
extends: dawn/react
```

```yaml
# Pure JavaScript
extends: dawn/standard
```

```yaml
# TypeScript
extends: dawn/typescript

# Alias: ts
extends: dawn/ts
```

```yaml
# TypeScript + React
extends: dawn/typescript-react

# Alias ts-react
extends: dawn/ts-react
```

```yaml
# JavaScript ES5
extends: dawn/legacy
```

> 为了保证一致的编码风格，本包中大量风格相关的规则被设为了 error 级别，以引起开发者的足够重视。

## Learn more

- 如果你对 ESLint 还不熟悉，可以阅读官网的 [Getting Started](https://eslint.org/docs/user-guide/getting-started) 快速入门。
- 了解如何在继承本包的基础上对项目 ESLint 进行个性化配置，可参考官网的 [Configuring ESLint](https://eslint.org/docs/user-guide/configuring)。下面简介下 ESLint 配置中的几个常用字段：
  - `extends`: 继承一组规则集。`"extends": "eslint-config-ali",` 表示继承本包定义的规则配置。
  - `rules`: 配置规则，这里定义的规则会覆盖 `extends` 的规则。如果觉得本包开启的某条规则过于严格，你可以暂时在这里将其关闭。
  - `parser`: 设置 ESLint 的解析器。ESLint 使用 espree 作为默认的解析器，可以通过这个参数指定其他的解析器。比如指定为 [babel-eslint](https://npmjs.com/package/babel-eslint)，以解析 Babel 支持但 ESLint 默认解析器不支持的语法。
  - `globals`: 指定代码中可能用到的全局变量，以免全局变量被 [no-undef](http://eslint.org/docs/rules/no-undef) 规则报错。
  - `env`: 指定代码的运行环境，每个环境预定义了一组对应的全局变量，本包已开启的环境有 browser、node、jquery、es6 及几个测试框架的环境。
- 了解如何为 IDE 配置 ESLint，可参考官网的 [Integrations](http://eslint.org/docs/user-guide/integrations)。
- 了解常用的 ESLint 命令，如 `--fix`、`--ext`、`-f`，可参考官网的 [Command Line Interface](http://eslint.org/docs/user-guide/command-line-interface)。
