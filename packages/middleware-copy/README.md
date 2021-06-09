# @dawnjs/dn-middleware-copy

[![npm](https://img.shields.io/npm/v/@dawnjs/dn-middleware-copy)](https://www.npmjs.com/package/@dawnjs/dn-middleware-copy)
[![npm](https://img.shields.io/npm/dw/@dawnjs/dn-middleware-copy)](https://www.npmjs.com/package/@dawnjs/dn-middleware-copy)

## Usage

```yml
build:
  - name: '@dawnjs/dn-middleware-copy'
    log: true
    files:
      ./build/demo1/(1)/(0).(ext): ./demo/**/*.*
      ./build/demo2/: ./demo/**/*.*
    filter: true
  - name: '@dawnjs/dn-middleware-webpack'
```

## Options

| Name      | Type                            | Default | Description                                                                                      |
| --------- | ------------------------------- | ------- | ------------------------------------------------------------------------------------------------ |
| from      | `string`                        | `"./"`  | Root path of source files, relative to current working directory                                 |
| to        | `string`                        | `"./"`  | Root path of destination files, relative to current working directory                            |
| files     | `Record<string, string>`        | `{}`    | Specify key-value pairs corresponding to destination/source and source/destination files pattern |
| direction | `string`                        | `<-`    | Specify copy direction for files. `<-` for right to left, `->` for left to right                 |
| log       | `boolean`                       | `true`  | Output log                                                                                       |
| dot       | `boolean`                       | `true`  | Whether include dot files while scan files by source glob pattern or not                         |
| override  | `boolean`                       | `true`  | Whether override exist destination files or not                                                  |
| filter    | `boolean \| string \| Function` |         | Process source file's content with custom function                                               |
