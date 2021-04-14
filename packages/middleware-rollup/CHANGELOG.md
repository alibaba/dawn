# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.7.0](https://github.com/alibaba/dawn/compare/@dawnjs/dn-middleware-rollup@1.6.3...@dawnjs/dn-middleware-rollup@1.7.0) (2021-04-14)


### Features

* **@dawnjs/dn-middleware-rollup:** add `babelExclude` and `babelInclude` options ([af55445](https://github.com/alibaba/dawn/commit/af5544594b0ca4519b76b4387ad6928ac61d0744))





## [1.6.3](https://github.com/alibaba/dawn/compare/@dawnjs/dn-middleware-rollup@1.6.2...@dawnjs/dn-middleware-rollup@1.6.3) (2021-04-14)

**Note:** Version bump only for package @dawnjs/dn-middleware-rollup





## [1.6.2](https://github.com/alibaba/dawn/compare/@dawnjs/dn-middleware-rollup@1.6.1...@dawnjs/dn-middleware-rollup@1.6.2) (2021-04-13)

**Note:** Version bump only for package @dawnjs/dn-middleware-rollup





## [1.6.1](https://github.com/alibaba/dawn/compare/@dawnjs/dn-middleware-rollup@1.6.0...@dawnjs/dn-middleware-rollup@1.6.1) (2021-04-12)

**Note:** Version bump only for package @dawnjs/dn-middleware-rollup





# 1.6.0 (2021-04-12)


### Features

* add @dawnjs/dn-middleware-rollup ([9fcf9ff](https://github.com/alibaba/dawn/commit/9fcf9ffa269a8c1fe5c8744ab92e693f30fd98f2))


### Reverts

* Revert "chore: publish" ([e32dbd0](https://github.com/alibaba/dawn/commit/e32dbd0d9aa3f3b76e6e707504840c1b7e8c0705))





# Change Log

## 1.5.0 (2020-12-02)

### Features

- Default output dir determained by output type now. `"esm"` for `esm`, `"lib"` for `cjs` and `"build"` for `umd`.
- Support multile entry output file name option.

## 1.4.0 (2020-11-12)

### Breaking Change

- Change auto global test rule to match the exact package name for UMD/System/IIFE format.

### Features

- Support `jsxRuntime` option, pass through to `dn-middleware-babel`.
- If `jsxRuntime` is `"automatic"`, override tsconfig's `jsx` option to `"preserve"`.

## 1.3.0 (2020-06-28)

### Features

- Add support for IIFE output format

## 1.2.0 (2020-06-28)

### Features

- Add support for SystemJS output format

## 1.0.0 (2020-06-10)

### Major

- Release
