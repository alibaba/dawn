# dawn

Dawn framework cli

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/dawn.svg)](https://npmjs.org/package/dawn)
[![CircleCI](https://circleci.com/gh/alibaba/dawn/tree/master.svg?style=shield)](https://circleci.com/gh/alibaba/dawn/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/alibaba/dawn?branch=master&svg=true)](https://ci.appveyor.com/project/alibaba/dawn/branch/master)
[![Codecov](https://codecov.io/gh/alibaba/dawn/branch/master/graph/badge.svg)](https://codecov.io/gh/alibaba/dawn)
[![Downloads/week](https://img.shields.io/npm/dw/dawn.svg)](https://npmjs.org/package/dawn)
[![License](https://img.shields.io/npm/l/dawn.svg)](https://github.com/alibaba/dawn/blob/master/package.json)

<!-- toc -->

- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g dawn
$ dn COMMAND
running command...
$ dn (-v|--version|version)
dawn/2.0.0-alpha.0 darwin-x64 node-v10.17.0
$ dn --help [COMMAND]
USAGE
  $ dn COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`dn hello [FILE]`](#dn-hello-file)
- [`dn help [COMMAND]`](#dn-help-command)

## `dn hello [FILE]`

describe the command here

```
USAGE
  $ dn hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ dn hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/alibaba/dawn/blob/v2.0.0-alpha.0/src/commands/hello.ts)_

## `dn help [COMMAND]`

display help for dn

```
USAGE
  $ dn help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

<!-- commandsstop -->
