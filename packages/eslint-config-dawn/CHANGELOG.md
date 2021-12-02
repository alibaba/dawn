# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.2.0](https://github.com/alibaba/dawn/compare/@dawnjs/eslint-config-dawn@3.1.3...@dawnjs/eslint-config-dawn@3.2.0) (2021-12-02)

### Features

- disable js-doc rule by default ([047eb66](https://github.com/alibaba/dawn/commit/047eb66ff3c174d6dc4922c9746754d7c28472b5))

## [3.1.3](https://github.com/alibaba/dawn/compare/@dawnjs/eslint-config-dawn@3.1.2...@dawnjs/eslint-config-dawn@3.1.3) (2021-11-17)

**Note:** Version bump only for package @dawnjs/eslint-config-dawn

## [3.1.2](https://github.com/alibaba/dawn/compare/@dawnjs/eslint-config-dawn@3.1.1...@dawnjs/eslint-config-dawn@3.1.2) (2021-11-17)

**Note:** Version bump only for package @dawnjs/eslint-config-dawn

## [3.1.1](https://github.com/alibaba/dawn/compare/@dawnjs/eslint-config-dawn@3.1.0...@dawnjs/eslint-config-dawn@3.1.1) (2021-11-16)

**Note:** Version bump only for package @dawnjs/eslint-config-dawn

# [3.1.0](https://github.com/alibaba/dawn/compare/@dawnjs/eslint-config-dawn@3.0.0...@dawnjs/eslint-config-dawn@3.1.0) (2021-11-12)

### Features

- postinstall required deps ([3c36b77](https://github.com/alibaba/dawn/commit/3c36b7733396952c89e887321f5d9f3d89641df3))

# 3.0.0 (2021-04-12)

### Code Refactoring

- **@dawnjs/eslint-config-dawn:** update to eslint-config-ali@12 ([7076734](https://github.com/alibaba/dawn/commit/707673406cf6987d21cb91d9a4abccf3e7e3bccd))

### Features

- lint 中间件支持 react hooks 检查 ([140e4d0](https://github.com/alibaba/dawn/commit/140e4d0b79467d129996cbb2ff5e33c987f23cbc))

### Reverts

- Revert "chore: publish" ([e32dbd0](https://github.com/alibaba/dawn/commit/e32dbd0d9aa3f3b76e6e707504840c1b7e8c0705))

### BREAKING CHANGES

- **@dawnjs/eslint-config-dawn:** Only support eslint >= 7

## 更新日志

本项目所有变更都将被记录到当前文档，项目版本遵循 [语义化版本 v2.0](https://semver.org/lang/zh-CN/)。

### [v2.0.0](#) - 2020.04.28

- Changed: 修改了大量 eslint rules，整体上更加严格 #203 @jeasonstudio
- Added：支持 TypeScript 项目，原 `tslint-config-dawn` 即将被废弃
- Added: 支持 prettier，提供 `.prettierrc.js`
