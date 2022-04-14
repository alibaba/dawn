# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.1.1](https://github.com/alibaba/dawn/compare/@dawnjs/dn-middleware-babel@2.1.0...@dawnjs/dn-middleware-babel@2.1.1) (2022-04-14)

**Note:** Version bump only for package @dawnjs/dn-middleware-babel

# [2.1.0](https://github.com/alibaba/dawn/compare/@dawnjs/dn-middleware-babel@2.0.8...@dawnjs/dn-middleware-babel@2.1.0) (2021-11-17)

### Features

- update deps ([ea32a47](https://github.com/alibaba/dawn/commit/ea32a479e8e337f04c1acd69684ff0ddd1f5cf2e))

## [2.0.8](https://github.com/alibaba/dawn/compare/@dawnjs/dn-middleware-babel@2.0.7...@dawnjs/dn-middleware-babel@2.0.8) (2021-11-17)

**Note:** Version bump only for package @dawnjs/dn-middleware-babel

## [2.0.7](https://github.com/alibaba/dawn/compare/@dawnjs/dn-middleware-babel@2.0.6...@dawnjs/dn-middleware-babel@2.0.7) (2021-06-07)

**Note:** Version bump only for package @dawnjs/dn-middleware-babel

## [2.0.6](https://github.com/alibaba/dawn/compare/@dawnjs/dn-middleware-babel@2.0.5...@dawnjs/dn-middleware-babel@2.0.6) (2021-05-26)

**Note:** Version bump only for package @dawnjs/dn-middleware-babel

## [2.0.5](https://github.com/alibaba/dawn/compare/@dawnjs/dn-middleware-babel@2.0.4...@dawnjs/dn-middleware-babel@2.0.5) (2021-05-26)

**Note:** Version bump only for package @dawnjs/dn-middleware-babel

## [2.0.4](https://github.com/alibaba/dawn/compare/@dawnjs/dn-middleware-babel@2.0.3...@dawnjs/dn-middleware-babel@2.0.4) (2021-04-14)

**Note:** Version bump only for package @dawnjs/dn-middleware-babel

## [2.0.3](https://github.com/alibaba/dawn/compare/@dawnjs/dn-middleware-babel@2.0.2...@dawnjs/dn-middleware-babel@2.0.3) (2021-04-13)

**Note:** Version bump only for package @dawnjs/dn-middleware-babel

## [2.0.2](https://github.com/alibaba/dawn/compare/@dawnjs/dn-middleware-babel@2.0.1...@dawnjs/dn-middleware-babel@2.0.2) (2021-04-13)

### Bug Fixes

- **@dawnjs/dn-middleware-babel:** always return plugins key ([d260885](https://github.com/alibaba/dawn/commit/d2608856e1298dacc5791cd95131da6bba6268fb))

## [2.0.1](https://github.com/alibaba/dawn/compare/@dawnjs/dn-middleware-babel@2.0.0...@dawnjs/dn-middleware-babel@2.0.1) (2021-04-12)

**Note:** Version bump only for package @dawnjs/dn-middleware-babel

# 2.0.0 (2021-04-12)

### Bug Fixes

- **@dawnjs/dn-middleware-babel:** remove `lazy` opts ([4c0f48f](https://github.com/alibaba/dawn/commit/4c0f48f8643ca9c5f1d6b38e2e1aebe089986ea6))

### Code Refactoring

- **@dawnjs/eslint-config-dawn:** update to eslint-config-ali@12 ([7076734](https://github.com/alibaba/dawn/commit/707673406cf6987d21cb91d9a4abccf3e7e3bccd))

### Features

- add @dawnjs/dn-middleware-rollup ([9fcf9ff](https://github.com/alibaba/dawn/commit/9fcf9ffa269a8c1fe5c8744ab92e693f30fd98f2))
- **@dawnjs/dn-middleware-babel:** Use @dawnjs/babel-preset-dawn instead ([e00a2ff](https://github.com/alibaba/dawn/commit/e00a2ff76e3d4b7bad4ddbc740d3c2adb42da6bc))
- **@dawnjs/dn-middleware-call:** add @dawnjs/dn-middleware-call ([3dbb9fe](https://github.com/alibaba/dawn/commit/3dbb9fe8fbadb0e9b318c24e3c59510eeef3ca25))

### Reverts

- Revert "chore: publish" ([e32dbd0](https://github.com/alibaba/dawn/commit/e32dbd0d9aa3f3b76e6e707504840c1b7e8c0705))

### BREAKING CHANGES

- **@dawnjs/eslint-config-dawn:** Only support eslint >= 7

# Change Log

## 1.4.2 (2020-12-1)

### Features

- Support `pragma` and `pragmaFrag` options, which can modify `@babel/preset-react`'s behavior for JSX Transform.

## 1.4.0 (2020-11-16)

### Features

- Support `disableAutoReactRequire` to exclude `babel-plugin-react-require` plugin.

### Breaking Changes (maybe)

- If `jsxRuntime` is `"automatic"` and using React 17.0.0+/16.14.0+/15.7.0+/0.14.10+, `disableAutoReactRequire` is set to `true` by default.

## 1.3.0 (2020-11-11)

### Features

- Support `env` and `jsxRuntime` options, which can modify `@babel/preset-react`'s behavior for JSX Transform.

## 1.2.1 (2020-06-10)

### Features

- `runtimeHelpers` defaults to `false`.

## 1.2.0 (2020-06-10)

### Features

- Remove `useBuiltIns` support, use `runtimeHelpers` instead.
