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
