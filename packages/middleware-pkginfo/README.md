# @dawnjs/dn-middleware-pkginfo

[![npm](https://img.shields.io/npm/v/@dawnjs/dn-middleware-pkginfo)](https://www.npmjs.com/package/@dawnjs/dn-middleware-pkginfo)
[![npm](https://img.shields.io/npm/dw/@dawnjs/dn-middleware-pkginfo)](https://www.npmjs.com/package/@dawnjs/dn-middleware-pkginfo)

## Usage

```yml
init:
  - name: '@dawnjs/dn-middleware-pkginfo'
    prefix: '@dawnjs/dn-middleware-'
    items:
      - name: name
        type: input
        message: Please enter project name
      - name: private
        type: confirm
        message: Is this package private?
```

## Options

| Name   | Type         | Default                                                                      | Description                      |
| ------ | ------------ | ---------------------------------------------------------------------------- | -------------------------------- |
| prefix | `string`     |                                                                              | The fixed prefix of package name |
| items  | `Question[]` | Default questions are about the name, version and description of the package | Custom inquirer questions        |

## Silence Mode

Support silence mode for CI or automation environment, read answers from process.env.DN_ARGV:

```bash
# encodeURIComponent(JSON.stringify({ pkginfo: { name: 'info', version: '1.2.3', silence: true } }))
# => "%7B%22pkginfo%22%3A%7B%22name%22%3A%22info%22%2C%22version%22%3A%221.2.3%22%2C%22silence%22%3Atrue%7D%7D"
DN_ARGV="%7B%22pkginfo%22%3A%7B%22name%22%3A%22info%22%2C%22version%22%3A%221.2.3%22%2C%22silence%22%3Atrue%7D%7D" dn init

--------

[14:17:25] Setting pkginfo...
[14:17:25] Silence mode... {"name":"info","version":"1.2.3","silence":true}
[14:17:25] Done
```
