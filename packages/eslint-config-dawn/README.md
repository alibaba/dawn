# @dawnjs/eslint-config-dawn

[![npm package](https://img.shields.io/npm/v/@dawnjs/eslint-config-dawn.svg)](https://www.npmjs.org/package/@dawnjs/eslint-config-dawn) [![npm downloads](http://img.shields.io/npm/dm/@dawnjs/eslint-config-dawn.svg)](https://www.npmjs.org/package/@dawnjs/eslint-config-dawn)

`@dawnjs/eslint-config-dawn` 是一套渐进式的开源 Lint 规范，适配 `JavaScript/NodeJS/TypeScript/React` 等多种项目类型，同时也为您个性化的 ESLint Config 提供了最佳实践参考。

> 本项目基于 [Alibaba ESLint Config](https://www.npmjs.com/package/eslint-config-ali)

## 设计理念

- 不依赖于 [Dawn](https://github.com/alibaba/dawn) 可单独使用
- 严谨但不死板，规则的设置有梯度
- 跟随业界最佳实践调整实现方式及规则细节，保持先进性
- 部分规则交给 [Prettier](https://prettier.io/) 处理，同时在代码格式化时我们推荐使用 prettier
- 可扩展，`.eslintrc/.prettierrc` 都可以针对项目自定义

## 安装 Install

按照下方示例安装依赖：

```bash
$ npm install --save-dev eslint prettier @dawnjs/eslint-config-dawn
# 根据需要安装其他依赖，参照下表
```

### JavaScript 项目

<!-- prettier-ignore -->
| 项目类型 | 配置文件 | 依赖 |
| --- | --- | --- |
| 一般项目 | @dawnjs/eslint-config-dawn/standard | [@babel/eslint-parser](https://www.npmjs.com/package/@babel/eslint-parser)@^7.16.3 <br /> [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)@^2.25.3 <br/> [eslint-plugin-prettier](https://www.npmjs.com/package/eslint-plugin-prettier)@^4.0.0 |
| React 项目 | @dawnjs/eslint-config-dawn | [@babel/eslint-parser](https://www.npmjs.com/package/@babel/eslint-parser)@^7.16.3 <br /> [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)@^2.25.3 <br /> [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react)@^7.27.0 <br /> [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)@^4.3.0 <br /> [eslint-plugin-jsx-a11y](https://www.npmjs.com/package/eslint-plugin-jsx-a11y)@^6.5.1 <br/> [eslint-plugin-prettier](https://www.npmjs.com/package/eslint-plugin-prettier)@^4.0.0 |
| [Rax 项目](https://rax.js.org/) | @dawnjs/eslint-config-dawn/rax | [@babel/eslint-parser](https://www.npmjs.com/package/@babel/eslint-parser)@^7.16.3 <br /> [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)@^2.25.3 <br /> [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react)@^7.27.0 <br /> [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)@^4.3.0 <br /> [eslint-plugin-jsx-plus](https://www.npmjs.com/package/eslint-plugin-jsx-plus)@^0.1.0 <br/> [eslint-plugin-prettier](https://www.npmjs.com/package/eslint-plugin-prettier)@^4.0.0 |
| Vue 项目 | @dawnjs/eslint-config-dawn/vue | [vue-eslint-parser](https://www.npmjs.com/package/vue-eslint-parser)@^8.0.1 <br /> [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)@^2.25.3 <br /> [eslint-plugin-vue](https://www.npmjs.com/package/eslint-plugin-vue)@^8.0.3 <br/> [eslint-plugin-prettier](https://www.npmjs.com/package/eslint-plugin-prettier)@^4.0.0 |
| ES5 项目 | @dawnjs/eslint-config-dawn/legacy | 无 |

### TypeScript 项目

<!-- prettier-ignore -->
| 项目类型 | 配置文件 | 依赖 |
| --- | --- | --- |
| 一般项目 | @dawnjs/eslint-config-dawn/typescript | [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser)@^5.3.1 <br /> [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)@^5.3.1 <br /> [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)@^2.25.3 <br/> [eslint-plugin-prettier](https://www.npmjs.com/package/eslint-plugin-prettier)@^4.0.0 |
| React 项目 | @dawnjs/eslint-config-dawn/typescript-react | [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser)@^5.3.1 <br /> [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)@^5.3.1 <br /> [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)@^2.25.3 <br /> [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react)@^7.27.0 <br /> [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)@^4.3.0 <br /> [eslint-plugin-jsx-a11y](https://www.npmjs.com/package/eslint-plugin-jsx-a11y)@^6.5.1 <br/> [eslint-plugin-prettier](https://www.npmjs.com/package/eslint-plugin-prettier)@^4.0.0 |
| [Rax 项目](https://rax.js.org/) | @dawnjs/eslint-config-dawn/typescript-rax | [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser)@^5.3.1 <br /> [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)@^5.3.1 <br /> [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)@^2.25.3 <br /> [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react)@^7.27.0 <br /> [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)@^4.3.0 <br /> [eslint-plugin-jsx-plus](https://www.npmjs.com/package/eslint-plugin-jsx-plus)@^0.1.0 <br/> [eslint-plugin-prettier](https://www.npmjs.com/package/eslint-plugin-prettier)@^4.0.0 |
| Vue 项目 | @dawnjs/eslint-config-dawn/typescript-vue | [vue-eslint-parser](https://www.npmjs.com/package/vue-eslint-parser)@^8.0.1 <br /> [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)@^5.3.1 <br /> [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)@^2.25.3 <br /> [eslint-plugin-vue](https://www.npmjs.com/package/eslint-plugin-vue)@^8.0.3 <br/> [eslint-plugin-prettier](https://www.npmjs.com/package/eslint-plugin-prettier)@^4.0.0 |

## 快速开始 Quick Start

在项目根目录下添加 `.eslintrc.yml` 和 `.prettierrc.js` 两个文件，复制下方示例到对应的文件中：

```yaml
# .eslintrc.yml
extends: '@dawnjs/eslint-config-dawn'
```

```javascript
// .prettierrc.js
module.exports = require('@dawnjs/eslint-config-dawn/prettierrc');
```

## 高阶使用 Advanced Usage

### JavaScript 项目

#### 一般项目

```yaml
# .eslintrc.yml
extends: '@dawnjs/eslint-config-dawn/standard'
```

#### React 项目

```yaml
# .eslintrc.yml
extends: '@dawnjs/eslint-config-dawn/react'
```

#### Rax 项目

```yaml
# .eslintrc.yml
extends: '@dawnjs/eslint-config-dawn/rax'
```

#### Vue 项目

```yaml
# .eslintrc.yml
extends: '@dawnjs/eslint-config-dawn/vue'
```

#### ES5 项目

```yaml
# .eslintrc.yml
extends: '@dawnjs/eslint-config-dawn/legacy'
```

### TypeScript 项目

#### 一般项目

```yaml
# .eslintrc.yml
extends: '@dawnjs/eslint-config-dawn/typescript'
```

`@dawnjs/eslint-config-dawn/ts` 与 `@dawnjs/eslint-config-dawn/typescript` 是等价的。

#### React 项目

```yaml
# .eslintrc.yml
extends: '@dawnjs/eslint-config-dawn/typescript-react'
```

`@dawnjs/eslint-config-dawn/ts-react` 与 `@dawnjs/eslint-config-dawn/typescript-react` 是等价的。

#### Rax 项目

```yaml
# .eslintrc.yml
extends: '@dawnjs/eslint-config-dawn/typescript-rax'
```

#### Vue 项目

```yaml
# .eslintrc.yml
extends: '@dawnjs/eslint-config-dawn/typescript-vue'
```

### 多个 config 混合使用

规则的覆盖关系为后者覆盖前者。

```yaml
# .eslintrc.yml
extends:
  - airbnb
  - '@dawnjs/eslint-config-dawn'
```

### 自定义规则

```yaml
# .eslintrc.yml
extends: '@dawnjs/eslint-config-dawn'
env:
  # node: true
  # jest: true
globals:
  # myGlobal: false
rules:
  # indent: 0
```

```javascript
// .prettierrc.js
module.exports = {
  ...require('@dawnjs/eslint-config-dawn/prettierrc'),
  semi: true, // your rule
};
```
