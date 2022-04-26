# @dawnjs/dn-middleware-submitter

[![npm](https://img.shields.io/npm/v/@dawnjs/dn-middleware-submitter)](https://www.npmjs.com/package/@dawnjs/dn-middleware-submitter)
[![npm](https://img.shields.io/npm/dw/@dawnjs/dn-middleware-submitter)](https://www.npmjs.com/package/@dawnjs/dn-middleware-submitter)

## Usage

```shell
$ npm i -D @dawnjs/dn-middleware-submitter
```

```yml
publish:
  - name: '@dawnjs/dn-middleware-submitter'
```

## Options

| Name    | Type                | Default | Description                                              |
| ------- | ------------------- | ------- | -------------------------------------------------------- |
| silence | `boolean \| string` |         | 是否静默模式，传入字符串时，可以作为静默提交时的 message |
| message | `string`            |         | 静默模式时，提交代码时使用的 message                     |
