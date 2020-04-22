# eslint-config-dawn

[![npm package](https://img.shields.io/npm/v/eslint-config-dawn.svg)](https://www.npmjs.org/package/eslint-config-dawn) [![npm downloads](http://img.shields.io/npm/dm/eslint-config-dawn.svg)](https://www.npmjs.org/package/eslint-config-dawn)

`eslint-config-dawn` 是一套渐进式的开源 Lint 规范，适配 `JavaScript/NodeJS/TypeScript/React` 等多种项目类型，同时也为您个性化的 ESLint Config 提供了最佳实践参考。

> 本项目基于 [Alibaba ESLint Config](https://www.npmjs.com/package/eslint-config-ali)

## 设计理念

* 可以不依赖于于 [Dawn](https://github.com/alibaba/dawn) 单独使用
* 严谨但不死板，规则的设置有梯度
* 跟随业界最佳实践调整实现方式及规则细节，保持先进性
* 部分规则交给 [Prettier](https://prettier.io/) 处理，同时在代码格式化时我们推荐使用 prettier
* 可扩展，`.eslintrc/.prettierrc` 都可以针对项目自定义

## 安装 Install

按照下方示例安装依赖：

```bash
$ npm install --save-dev eslint@6 prettier@2 eslint-config-dawn@latest
```

## 快速开始 Quick Start

在项目根目录下添加 `.eslintrc.yml` 和 `.prettierrc.js` 两个文件，复制下方示例到对应的文件中：

```yaml
# .eslintrc.yml
extends: dawn
```

```javascript
// .prettierrc.js
module.exports = require('eslint-config-dawn/prettierrc');
```

## 高阶使用 Advanced Usage

### NodeJS 项目或纯 JS 项目（无 React）

```yaml
# .eslintrc.yml
extends: dawn/standard
```

### TypeScript 项目

```yaml
# .eslintrc.yml
extends: dawn/typescript
```

`dawn/ts` 与 `dawn/typescript` 是等价的。

### TypeScript + React 项目

```yaml
# .eslintrc.yml
extends: dawn/typescript-react
```

`dawn/ts-react` 与 `dawn/typescript-react` 是等价的。

### 多个 config 混合使用

规则的覆盖关系为后者覆盖前者。

```yaml
# .eslintrc.yml
extends:
  - airbnb
  - dawn
```

### 自定义规则

```yaml
# .eslintrc.yml
extends: dawn
env:
  # node: true
  # jeest: true
globals:
  # myGlobal: false
rules:
  # indent: 0
```

```javascript
// .prettierrc.js
module.exports = {
  ...require('eslint-config-dawn/prettierrc'),
  semi: true, // your rule
};
```
