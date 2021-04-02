# @dawnjs/dn-middleware-call

[![npm](https://img.shields.io/npm/v/@dawnjs/dn-middleware-call)](https://www.npmjs.com/package/@dawnjs/dn-middleware-call)
[![npm](https://img.shields.io/npm/dw/@dawnjs/dn-middleware-call)](https://www.npmjs.com/package/@dawnjs/dn-middleware-call)

## Usage

```yaml
demo1:
  - name: shell
    script:
      - echo demo1

demo2:
  - name: shell
    script:
      - echo demo2

demo3:
  - name: shell
    script:
      - echo demo3

demo:
  - name: call
    pipe:
      - demo3
    when:
      'process.env.NODE_ENV !== "production"': demo1
      'process.env.NODE_ENV === "production"': demo2
```

## Options

| Name | Type | Description |
| --- | --- | --- |
| pipe | <code>string &#124; string[]</code> | The pipeline name[s] which needs to be called always in order |
| when | `object` | The pipeline name which needs to be called if meet the conditions after `pipe` array |

### Condition expression description
- Condition expression can be any valid statement that return boolean value.
- Middleware will extract all field in context to the condition expression scope with `with` statement.
