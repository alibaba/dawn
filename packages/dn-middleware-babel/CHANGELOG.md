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
