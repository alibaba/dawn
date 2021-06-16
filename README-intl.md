<h1 align="center">
  <img src="https://img.alicdn.com/tfs/TB1OjR6HQL0gK0jSZFAXXcA9pXa-1360-1360.png" alt="Dawn" width="200">
  <br>Dawn<br>
</h1>

<h4 align="center">Lightweight task management and build tool.</h4>

<p align="center">
  <a href="https://github.com/alibaba/dawn/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@dawnjs/cli.svg" alt="LICENSE">
  </a>
  <a href="https://www.npmjs.com/package/@dawnjs/cli">
    <img src="https://img.shields.io/npm/v/@dawnjs/cli.svg" alt="npm version">
  </a>
  <a href="https://github.com/alibaba/dawn/actions/workflows/main.yml">
    <img src="https://github.com/alibaba/dawn/actions/workflows/main.yml/badge.svg" alt="CI">
  </a>
  <a href="https://www.npmjs.com/package/@dawnjs/cli">
    <img src="https://img.shields.io/npm/dt/@dawnjs/cli.svg" alt="npm downloads">
  </a>
</p>

<pre align="center">npm i <a href="https://www.npmjs.com/package/@dawnjs/cli">@dawnjs/cli</a> -g</pre>

[中文 README](README.md)

Dawn is a lightweight task management and build tool for front-end and nodejs. It abstracts the development process into relatively fixed phases and limited operations through `pipeline` and `middleware`, simplifying and unifying the work related to the construction and development of developers.

## Features

- Support middleware, easy to extend, and easy to reuse.
- Support pipeline, multiple subtasks collaborate to complete the build task.
- Simple and consistent command line interfaces that are easy for developers to use.
- Manage middleware and engineering templates based on central services.
- Support 'private central service', distribution rules, and easy team management.

## Install

```sh
$ npm install @dawnjs/cli -g
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
  - name: '@dawnjs/dn-middleware-webpack'
    env: development
    entry: ./src/*.js
    template: ./assets/*.html
    serverOpts:
      port: 8001

# Build & pack
buid:
  - name: '@dawnjs/dn-middleware-webpack'
    env: production
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
