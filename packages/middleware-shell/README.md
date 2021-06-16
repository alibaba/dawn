# @dawnjs/dn-middleware-shell

[![npm](https://img.shields.io/npm/v/@dawnjs/dn-middleware-shell)](https://www.npmjs.com/package/@dawnjs/dn-middleware-shell)
[![npm](https://img.shields.io/npm/dw/@dawnjs/dn-middleware-shell)](https://www.npmjs.com/package/@dawnjs/dn-middleware-shell)

## Usage

```yml
build:
  - name: '@dawnjs/dn-middleware-shell'
    script:
      - echo 123
      - echo 456
```

## Options

| Name    | Type       | Default | Description                                    |
| ------- | ---------- | ------- | ---------------------------------------------- |
| script  | `string[]` | `[]`    | Shell scripts to be executed                   |
| wscript | `string[]` |         | Shell scripts for win                          |
| async   | `boolean`  |         | Execute in async mode, not wait script to exit |
