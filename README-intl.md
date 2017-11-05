![Banner](docs/assets/banner-sm.jpg)

# Dawn

[中文 README](README.md)

Dawn is a lightweight task management and build tool for front-end and nodejs. It abstracts the development process into relatively fixed phases and limited operations through `pipeline` and `middleware`, simplifying and unifying the work related to the construction and development of developers.

[![npm](https://img.shields.io/npm/l/dawn.svg)](LICENSE.md)
[![NPM Version](https://img.shields.io/npm/v/dawn.svg)](https://www.npmjs.com/package/dawn)
[![Build Status](https://www.travis-ci.org/alibaba/dawn.svg?branch=master)](https://www.travis-ci.org/alibaba/dawn)
[![Coverage Status](https://coveralls.io/repos/github/alibaba/dawn/badge.svg?branch=dev)](https://coveralls.io/github/alibaba/dawn?branch=dev)
[![npm](https://img.shields.io/npm/dt/dawn.svg)](https://www.npmjs.com/package/dawn)


## Features

- Support middleware, easy to extend, and easy to reuse.
- Support pipeline, multiple subtasks collaborate to complete the build task.
- Simple and consistent command line interfaces that are easy for developers to use.
- Manage middleware and engineering templates based on central services.
- Support 'private central service', distribution rules, and easy team management.

## Install

```sh
$ npm install dawn -g
```

## Use
```sh
# 1. Create & Initialize
$ dn init -t front

# 2. Development & Real-time compilation
$ dn dev

# 3. Lint & Test
$ dn test

# 4. Build & pack
$ dn build
```

## Example（.dawn.yml or .dawn folder）

```yml
# Development & Real-time compilation
dev:
  - name: webpack
    entry: ./src/*.js
    template: ./assets/*.html
    watch: true
  - name: server
    port: 8001
    
# Build & pack
buid:
  - name: webpack
    entry: ./src/*.js
    template: ./assets/*.html
```

## Documents

- Getting Started: [getting-started.md](https://alibaba.github.io/dawn/docs/#!/zh/guide/getting-started)
- Pipeline: [pipeline.md](https://alibaba.github.io/dawn/docs/#!/zh/guide/pipeline)
- Middleware: [middleware.md](https://alibaba.github.io/dawn/docs/#!/zh/guide/middleware)
- More docs: [https://alibaba.github.io/dawn/docs/](https://alibaba.github.io/dawn/docs/)


## Others

- [Contributing](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)
- [MIT](https://tldrlegal.com/license/mit-license)