# @dawnjs/dn-middleware-clean

[![npm](https://img.shields.io/npm/v/@dawnjs/dn-middleware-clean)](https://www.npmjs.com/package/@dawnjs/dn-middleware-clean)
[![npm](https://img.shields.io/npm/dw/@dawnjs/dn-middleware-clean)](https://www.npmjs.com/package/@dawnjs/dn-middleware-clean)

## Usage

```yml
build:
  - name: '@dawnjs/dn-middleware-clean'
    target: ./build/**/*.*
  - name: '@dawnjs/dn-middleware-webpack'
```

## Options

| Name   | Type                 | Default                   | Description                                                               |
| ------ | -------------------- | ------------------------- | ------------------------------------------------------------------------- |
| target | `string \| string[]` | `["./build/", "./dist/"]` | Specify target directories and files to be cleaned, support glob pattern. |
