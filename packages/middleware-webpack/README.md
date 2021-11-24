# @dawnjs/dn-middleware-webpack

[![npm](https://img.shields.io/npm/v/@dawnjs/dn-middleware-webpack)](https://www.npmjs.com/package/@dawnjs/dn-middleware-webpack)
[![npm](https://img.shields.io/npm/dw/@dawnjs/dn-middleware-webpack)](https://www.npmjs.com/package/@dawnjs/dn-middleware-webpack)

## Getting Started

To begin, you'll need to install `@dawnjs/dn-middleware-webpack`:

```console
$ npm i -D @dawnjs/dn-middleware-webpack
```

Then add the middleware to your `dawn` pipeline configuration. For example:

**.dawn/pipe.yml**

```yaml
dev:
  - name: '@dawnjs/dn-middleware-webpack'
```

And run `dn dev` via your preferred method.

## _Important Warning_

To be sure no other webpack middleware installed in your project. If any, please install the latest `webpack@5` with `npm install --dev webpack@5` manually in your project to ensure `node_modules/webpack`'s version is `5.x`.

## Options

<!-- prettier-ignore -->
| Name | Type | Default | Description |
| :---: | :---: | :---: | :--- |
| **[`configFile`](#configfile)** | `string` | `"./webpack.config.js"` | The path of custom configration for modify any webpack options |
| **[`chainable`](#chainable)** | `boolean` | `false` | Use webpack-chain's Config instance for custorm config file |
| **[`env`](#env)** | `string` | _Depends on environment variables_ | Set bundle environment, accepted values are `"development"` or `"production"` |
| **[`cwd`](#cwd)** | `string` | _Depends on current working directory_ | Specify working directory manually, useful for monorepo project etc. |
| **[`entry`](#entry)** | `string \| string[] \| object` | _Depends on files exist in `src`_ | Specify app entry, support glob pattern and multi-entry |
| **[`inject`](#inject)** | `string \| string[]` | `[]` | File list to be **prepended** to **all entries** |
| **[`append`](#append)** | `string \| string[]` | `[]` | File list to be **appended** to **all entries** |
| **[`output`](#output)** | `string \| object` | `{ path: "./build" }` | Webpack output options |
| **[`folders`](#folders)** | `object` | `{ script: "js", style: "css", media: "assets", html: "" }` | Output folders for different asset type |
| **[`disableDynamicPublicPath`](#disabledynamicpublicpath)** | `boolean` | `false` | Wether disable the auto dynamic public path feature or not |
| **[`template`](#template)** | `boolean \| string \| string[] \| object` | `true` | Specify html template |
| **[`target`](#target)** | `string \| string[] \| false` | | Specify webpack target |
| **[`external`](#external)** | `boolean` | _Depends on `env`_ | Whether enable externals or not |
| **[`externals`](#externals)** | `object` | _Depends on `env` and `output.library`_ | Specify webpack externals |
| **[`alias`](#alias)** | `object` | | Set webpack's `resolve.alias` |
| **[`tsconfigPathsPlugin`](#tsconfigpathsplugin)** | `object` | | Options for [`tsconfig-paths-webpack-plugin`](https://github.com/dividab/tsconfig-paths-webpack-plugin) |
| **[`devtool`](#devtool)** | `boolean \| string` | _Depends on `env`_ | Set webpack's `devtool` option |
| **[`common`](#common)** | `object` | `{ disabled: false, name: 'common' }` | Simply set whether using common chunk or not and the common chunks's name |
| **[`compress`](#compress)** | `boolean` | _Depends on `env`_ | Enable webpack's `optimization.minimize` option |
| **[`esbuild`](#esbuild)** | `object` | | Options for ESBuild's loader and plugin |
| **[`swc`](#swc)** | `boolean \| object` | | Options for swc's loader and plugin |
| **[`terser`](#terser)** | `object` | `{ extractComments: false, terserOptions: { compress: { drop_console: true }, format: { comments: false } } }` | Options for `terser-webpack-plugin` |
| **[`cssMinimizer`](#cssminimizer)** | `object` | `{ minimizerOptions: { preset: ["default", { discardComments: { removeAll: true } }] } }` | Options for `css-minimizer-webpack-plugin` |
| **[`optimization`](#optimization)** | `object` | | Extra optimization options |
| **[`ignoreMomentLocale`](#ignoremomentlocale)** | `boolean` | `true` | Whether to ignore locales in moment package or not |
| **[`babel`](#babel)** | `object` | | Options to custom behavior of babel preset |
| **[`disabledTypeCheck`](#disabledtypecheck)** | `boolean` | `false` | Disable type check for typescript files |
| **[`typeCheckInclude`](#typecheckinclude)** | `string[]` | `["**/*"]` | Glob patterns for files to check types |
| **[`injectCSS`](#injectcss)** | `boolean` | _Depends on `env`_ | Should inject css into the DOM, otherwise extract css to seperate files |
| **[`styleLoader`](#styleloader)** | `object` | | Options for `style-loader` or `MiniCssExtractPlugin.loader` |
| **[`cssLoader`](#cssloader)** | `object` | | Options for `css-loader` |
| **[`postcssLoader`](#postcssloader)** | `object` | `{ postcssOptions: { plugins: ["postcss-preset-env"] } }` | Options for `postcss-loader` |
| **[`extraPostCSSPlugins`](#extrapostcssplugins)** | `any[]` | | Extra plugins for PostCSS in `postcss-loader` |
| **[`postcssPresetEnv`](#postcsspresetenv)** | `object` | | Options for `postcss-preset-env` |
| **[`lessLoader`](#lessloader)** | `object` | `{ lessOptions: { rewriteUrls: "all" } }` | Options for `less-loader` |
| **[`resolveUrlLoader`](#resolveurlloader)** | `object` | | Options for `resolve-url-loader` |
| **[`sassLoader`](#sassloader)** | `object` | `{ sourceMap: true, sassOptions: { quietDeps: true } }` | Options for `sass-loader` |
| **[`workerLoader`](#workerloader)** | `object` | `{ inline: "fallback" }` | Options for `worker-loader` |
| **[`config`](#config)** | `object` | `{ name: "$config", path: "./src/config", env: ctx.command }` | Options to configure the runtime config virtual module |
| **[`profile`](#profile)** | `boolean` | | Enable webpack profile option and add `webpack-stats-plugin` to output stats file |
| **[`statsOpts`](#statsopts)** | `string \| object` | `"verbose"` | Options for `stats` in `webpack-stats-plugin` |
| **[`analysis`](#analysis)** | `boolean \| object` | | Enable and set options for `webpack-bundle-analyzer` |
| **[`watch`](#watch)** | `boolean` | | Enable watch mode |
| **[`watchOpts`](#watchopts)** | `object` | `{ ignored: /node_modules/ }` | Options for watch mode |
| **[`server`](#server)** | `boolean` | _Depends on `env`_ | Enable server mode |
| **[`serverOpts`](#serveropts)** | `object` | `{ host: "localhost", historyApiFallback: true, open: true, hot: true }` | Options for `webpack-dev-server` |
| **[`lint`](#lint)** | `boolean \| object` | `{ extensions: "js,jsx,ts,tsx", formatter: require.resolve("eslint-formatter-pretty"), failOnError: false }` | Enable ESLint in server mode |

### `configFile`

Type: `string`<br>
Default: `"./webpack.config.js"`

By default, the custom configration file must export a valid function.<br>
In compatible mode, the custom configration file could export a valid function or a valid webpack config object.

**Important: It is not recommend to modify existing module rules because their structure might be changed in the future.**

Examples:

```js
module.exports = function (config, webpack, ctx) {
  // config: a webpack config object or an instance of webpack-chain's `Config` in chainable mode
  // webpack: the imported `webpack` function
  // ctx: the dawn context
};
```

### `chainable`

Type: `boolean`<br>
Default: `false`

By default, the first argument of custom configration function is a webpack config object.<br>
If enable chainable mode, the first argument would be a webpack-chain's `Config` instance.

Avaliable chainable config name:

- rule (Access with `config.module.rule(ruleName)`)
  - `"assets"`
    - oneOf (Access with `config.module.rule("assets").oneOf(oneOfName)`)
      - `"raw"`
      - `"inline"`
      - `"images"`
      - `"svg"`
      - `"fonts"`
      - `"plaintext"`
      - `"yaml"`
  - `"esbuild"` (If using `esbuild.loader`)
    - oneOf (Access with `config.module.rule("esbuild").oneOf(oneOfName)`)
      - `"js"`
        - use (Access with `config.module.rule("esbuild").oneOf("js").use(useName)`)
          - `"esbuild-loader"`
      - `"ts"`
        - use (Access with `config.module.rule("esbuild").oneOf("ts").use(useName)`)
          - `"esbuild-loader"`
      - `"tsx"`
        - use (Access with `config.module.rule("esbuild").oneOf("tsx").use(useName)`)
          - `"esbuild-loader"`
  - `"swc"` (If using `swc`)
    - oneOf (Access with `config.module.rule("swc").oneOf(oneOfName)`)
      - `"js"`
        - use (Access with `config.module.rule("swc").oneOf("js").use(useName)`)
          - `"swc-loader"`
      - `"ts"`
        - use (Access with `config.module.rule("swc").oneOf("ts").use(useName)`)
          - `"swc-loader"`
      - `"tsx"`
        - use (Access with `config.module.rule("swc").oneOf("tsx").use(useName)`)
          - `"swc-loader"`
  - `babel` (If using babel, it's default)
    - oneOf (Access with `config.module.rule("babel").oneOf(oneOfName)`)
      - `"jsx"`
        - use (Access with `config.module.rule("babel").oneOf("jsx").use(useName)`)
          - `"babel-loader"`
      - `"app-js"`
        - use (Access with `config.module.rule("babel").oneOf("app-js").use(useName)`)
          - `"babel-loader"`
      - `"extra-js"` (If using `babel.extraBabelIncludes`)
        - use (Access with `config.module.rule("babel").oneOf("extra-js").use(useName)`)
          - `"babel-loader"`
      - `"ts"`
        - use (Access with `config.module.rule("babel").oneOf("ts").use(useName)`)
          - `"babel-loader"`
      - `"tsx"`
        - use (Access with `config.module.rule("babel").oneOf("tsx").use(useName)`)
          - `"babel-loader"`
  - `"worker"`
    - use (Access with `config.module.rule("worker").use(useName)`)
      - `"worker-loader"`
  - `"css"`
    - use (Access with `config.module.rule("css").use(useName)`)
      - `"style-loader"` (If using `injectCSS`)
      - `"extract-css-loader"` (If not using `injectCSS`)
      - `"css-loader"`
      - `"postcss-loader"`
  - `"less"`
    - use (Access with `config.module.rule("less").use(useName)`)
      - `"style-loader"` (If using `injectCSS`)
      - `"extract-css-loader"` (If not using `injectCSS`)
      - `"css-loader"`
      - `"postcss-loader"`
      - `"less-loader"`
  - `"sass"`
    - use (Access with `config.module.rule("sass").use(useName)`)
      - `"style-loader"` (If using `injectCSS`)
      - `"extract-css-loader"` (If not using `injectCSS`)
      - `"css-loader"`
      - `"postcss-loader"`
      - `"resolve-url-loader"`
      - `"sass-loader"`

### `env`

Type: `string`<br>
Default: _Depends on environment variables_

Available values are `"development"` and `"production"`. If not specified, we will determine it by `process.env.DN_ENV`, `process.env.NODE_ENV` and the dawn command executing currently in order.

Examples:

```sh
$ dn dev # set to "development" because of the command includes the "dev" string
$ dn run daily # set to "development" because of the command includes the "daily" string
$ dn run build # set to "production" because of the command neither includes the "dev" string nor includes the "daily" string
$ NODE_ENV=production dn dev # set to "production" because of process.env.NODE_ENV is "production"
$ DN_ENV=production NODE_ENV=development dn dev # set to "production" because of process.env.DN_ENV is "production"
```

### `cwd`

Type: `string`<br>
Default: _Depends on current working directory_

By default `cwd` equals to the current working directory.

### `entry`

Type: `string | string[] | object`
Default: _Depends on files exist in `src`_

By default, middleware will search files `src/index.tsx`, `src/index.ts`, `src/index.jsx`, `src/index.js` in order and set entry to the first founded file path.

#### `string`

Set a single entry by path. The entry name equals the base name of the path without extension.

Examples:

```yaml
dev:
  - name: '@dawnjs/dn-middleware-webpack'
    entry: src/app.tsx # The entry name is "app"
```

#### `string[]`

Set multiple entries by path.

Examples:

```yaml
dev:
  - name: '@dawnjs/dn-middleware-webpack'
    entry:
      - src/foo.tsx # The entry name is "foo"
      - src/bar.tsx # The entry name is "bar"
```

#### `object`

Set multiple entries by name and path. Support using glob pattern in path and placeholder in name to specify multiple entries.

Examples:

```yaml
dev:
  - name: '@dawnjs/dn-middleware-webpack'
    entry:
      index: src/index.tsx
      page_{0}: src/pages/*.tsx
```

If there is `a.tsx` and `b.tsx` in `src/pages/`, then two entries which with name `page_a` and `page_b` will be generated together with the fixed entry `index`.

### `inject`

Type: `string | string[]`<br>
Default: `[]`

Prepend file(s) to all entries.

#### `string`

Simplified for single file.

Examples:

```yaml
dev:
  - name: '@dawnjs/dn-middleware-webpack'
    inject: src/setup.ts
```

#### `string[]`

One or more files.

Examples:

```yaml
dev:
  - name: '@dawnjs/dn-middleware-webpack'
    inject:
      - src/bootstrap.ts
      - src/initGlobal.ts
```

### `append`

Type: `string | string[]`<br>
Default: `[]`

Append file(s) to all entries.

#### `string`

Simplified for single file.

Examples:

```yaml
dev:
  - name: '@dawnjs/dn-middleware-webpack'
    append: src/cleanup.ts
```

#### `string[]`

One or more files.

Examples:

```yaml
dev:
  - name: '@dawnjs/dn-middleware-webpack'
    append:
      - src/restore.ts
      - src/cleanup.ts
```

### `output`

Type: `string | object`<br>
Default: `{ path: "./build" }`

Pass to webpack output options.

#### `string`

If you provide an `string`, it means `output.path`.

#### `object`

Accept all webpack output options. Details to see [here](https://webpack.js.org/configuration/output/).

### `folders`

Type: `object`<br>
Default: `{ script: "js", style: "css", media: "assets", html: "" }`

Output folders for different asset type.

- `script` - All js files.
- `style` - All css files output by `mini-css-extract-plugin`.
- `html` - All html files output by `html-webpack-plugin`.
- `media` - Any files output by webpack with [asset modules](https://webpack.js.org/guides/asset-modules/)

### `disableDynamicPublicPath`

Type: `boolean`<br>
Default: `false`

By default, if `output.publicPath` not set (means it's `undefined`) then a small code snippet will be prepend to all entries to determine runtime dynamic public path with current script source url.

### `template`

Type: `boolean | string | string[] | object`<br>
Default: `true`

#### `false`

Disable the html output.

#### `true`

Scan file with path `public/index.html` and `src/assets/index.html` if it exists.

#### `string`

Specify the template file path.

```yaml
template: template/custom.html
```

#### `string[]`

Specify multi templates, the file's basename is the template name.

```yaml
template:
  - template/foo.html
  - template/bar.html
```

#### `object`

Specify multi templates with template name.

```yaml
template:
  foo: template/a.html
  bar: template/b.html
```

### `target`

Type: `string | string[] | false`<br>
Default:

See [webpack docs](https://webpack.js.org/configuration/target/#target).

### `external`

Type: `boolean`<br>
Default: _Depends on `env`_

Defaults to `false` in `development` mode, otherwise to `true`.

### `externals`

Type: `object`<br>
Default: _Depends on `env` and `output.library`_

By default, make `react` and `react-dom` as externals.

### `alias`

Type: `object`<br>
Default:

See [webpack docs](https://webpack.js.org/configuration/resolve/#resolvealias).

### `tsconfigPathsPlugin`

Type: `object`<br>
Default:

`tsconfig-paths-webpack-plugin` only enabled if there is a `tsconfig.json` file exists in the current work directory.

See [plugin docs](https://github.com/dividab/tsconfig-paths-webpack-plugin#options).

### `devtool`

Type: `boolean | string`<br>
Default: _Depends on `env`_

If `env` is `"development"`, defaults to `"eval-cheap-module-source-map"`, otherwise defaults to `"cheap-source-map"`.

#### `true`

Same as not set.

#### `false`

Disable source maps.

#### `string`

All available values see [webpack docs](https://webpack.js.org/configuration/devtool/#devtool).

### `common`

Type: `object`<br>
Default: `{ disabled: false, name: 'common' }`

#### `common.disabled`

Type: `boolean`<br>
Default: `false`

Set to `true` to disable common chunk.

#### `common.name`

Type: `string`<br>
Default: `"common"`

Set common chunk's name.

### `compress`

Type: `boolean`<br>
Default: _Depends on `env`_

Default to `true` in `"production"`.

### `esbuild`

Type: `object`<br>
Default:

#### `esbuild.loader`

Type: `boolean | object`<br>
Default:

##### `boolean`

Simply enable esbuild to replace babel without options.

##### `object`

See [esbuild-loader's loader options](https://github.com/privatenumber/esbuild-loader#loader).

#### `esbuild.minify`

Type: `boolean | object`<br>
Default:

##### `boolean`

Simply enable esbuild to replace terser without options.

##### `object`

See [esbuild-loader's minify plugin options](https://github.com/privatenumber/esbuild-loader#minifyplugin).

### `swc`

Type: `boolean | object`
Default:

#### `boolean`

Simply enable swc to replace babel and terser without options.

#### `object`

See [swc-loader options](https://github.com/swc-project/swc-loader#usage) and [swc-webpack-plugin options](https://github.com/soulwu/swc-webpack-plugin#options).

### `terser`

Type: `object`<br>
Default: `{ extractComments: false, terserOptions: { compress: { drop_console: true }, format: { comments: false } } }`

See [plugin docs](https://github.com/webpack-contrib/terser-webpack-plugin#options).

### `cssMinimizer`

Type: `object`<br>
Default: `{ minimizerOptions: { preset: ["default", { discardComments: { removeAll: true } }] } }`

See [plugin docs](https://github.com/webpack-contrib/css-minimizer-webpack-plugin#options)

### `optimization`

Type: `object`<br>
Default:

Extra options to override other optimization options.

See [webpack docs](https://webpack.js.org/configuration/optimization/).

### `ignoreMomentLocale`

Type: `boolean`<br>
Default:

Whether to ignore locales in moment package or not, default is true.

### `babel`

Type: `object`<br>

#### `babel.corejs`

Type: `false | 2 | 3 | { version: 2 | 3; proposals: boolean }`<br>
Default:

See [babel docs](https://babeljs.io/docs/en/babel-plugin-transform-runtime#corejs).

#### `babel.disableAutoReactRequire`

Type: `boolean`<br>
Default: `false`

Whether to use `babel-plugin-react-require` or not. See [plugin docs](https://github.com/vslinko/babel-plugin-react-require).

#### `babel.extraBabelIncludes`

Type: `any[]`<br>
Default:

By default babel only transform application source files except files in the `node_modules` folder. Pass in any valid include pattern list to tell babel to transform. Include patther follow [webpack module rule condition](https://webpack.js.org/configuration/module/#condition)

#### `babel.extraBabelPlugins`

Type: `any[]`<br>
Default:

Specify extra babel plugins.

#### `babel.extraBabelPresets`

Type: `any[]`<br>
Default:

Specify extra babel presets.

#### `babel.ie11Incompatible`

Type: `boolean`<br>
Default: false

Enable IE11 compatible mode, use [es5-imcompatible-versions](https://github.com/umijs/es5-imcompatible-versions)

#### `babel.jsxRuntime`

Type: `boolean`<br>
Default:

Enable react's new jsx runtime syntax.

#### `babel.pragma`

Type: `string`<br>
Default:

See [babel docs](https://babeljs.io/docs/en/babel-preset-react#pragma).

#### `babel.pragmaFrag`

Type: `string`<br>
Default:

See [babel docs](https://babeljs.io/docs/en/babel-preset-react#pragmafrag).

#### `babel.runtimeHelpers`

Type: `boolean | string`<br>
Default:

Enable `transform-runtime` plugin or specify the plugin version.

### `disabledTypeCheck`

Type: `boolean `<br>
Default: `false`

By default, if there is a `tsconfig.json` file in current working directory, it will checking the types for typescript files. Can disable it with set `disabledTypeCheck` to `true`.

### `typeCheckInclude`

Type: `string[]`<br>
Default: `["**/*"]`

By default, all files will be checked. Custom glob patterns to override the range.

### `injectCSS`

Type: `boolean`<br>
Default: _Depends on `env`_

If `env` is `"development"` then it defaults to `true`, else defaults to `false`.

When it is `true`, CSS would be injected into the DOM by `style-loader`, otherwise, be extracted to seperate files by `mini-css-extract-plugin`.

### `styleLoader`

Type: `object`<br>
Default:

Options for `style-loader` or `MiniCssExtractPlugin.loader`.

See [style-loader doc](https://github.com/webpack-contrib/style-loader#options) and [MiniCssExtractPlugin.loader doc](https://github.com/webpack-contrib/mini-css-extract-plugin#loader-options).

### `cssLoader`

Type: `object`<br>
Default:

Options for `css-loader`. Support CSS Modules if file has extension like `.module.*`.

See [css-loader docs](https://github.com/webpack-contrib/css-loader#options).

### `postcssLoader`

Type: `object`<br>
Default: `{ implementation: require("postcss"), postcssOptions: { plugins: ["postcss-flexbugs-fixes", "postcss-preset-env"] } }`

Options for `css-loader`.

See [postcss-loader docs](https://github.com/webpack-contrib/postcss-loader#options)

### `extraPostCSSPlugins`

Type: `any[]`<br>
Default:

Extra plugins for PostCSS in `postcss-loader`. _Only available if `postcssLoader.postcssOptions` is not a function._

### `postcssPresetEnv`

Type: `object`<br>
Default:

Options for `postcss-preset-env`. _Only available if `postcssLoader.postcssOptions` is not a function._

See [postcss-preste-env docs](https://github.com/csstools/postcss-preset-env#options).

### `lessLoader`

Type: `object`<br>
Default: `{ implementation: require("less"), lessOptions: { rewriteUrls: "all" } }`

Options for `less-loader`.

See [less-loader docs](https://github.com/webpack-contrib/less-loader#options).

### `resolveUrlLoader`

Type: `object`<br>
Default:

Options for `resolve-url-loader`. `resolve-url-loader` only apply to SASS files. See [this](https://github.com/webpack-contrib/sass-loader#problems-with-url).

See [resolve-url-loader docs](https://github.com/bholloway/resolve-url-loader/blob/master/packages/resolve-url-loader/README.md#options).

### `sassLoader`

Type: `object`<br>
Default: `{ implementation: require("sass"), sourceMap: true, sassOptions: { fiber: require("fibers") } }`

Options for `sass-loader`. `sassLoader.sourceMap` always be `true` because of the requirement of `resolve-url-loader`. See [here](https://github.com/bholloway/resolve-url-loader/blob/master/packages/resolve-url-loader/README.md#configure-webpack).

See [sass-loader docs](https://github.com/webpack-contrib/sass-loader#options).

### `workerLoader`

Type: `object`<br>
Default: `{ inline: "fallback" }`

Options for `worker-loader`. Files with `.worker.*` extensions will be processed.

See [worker-loader docs](https://github.com/webpack-contrib/worker-loader#options).

### `config`

Type: `object`<br>
Default: `{ name: "$config", path: "./src/config", env: ctx.command }`

Options to configure the runtime config virtual module. By default, load runtime config from `src/config`, `src/config.*` and `src/config/**/*` according to the specified env with any supported format. See [confman](https://github.com/Houfeng/confman).

Examples:

In `./config.yml`

```yml
foo: abc
```

In `./src/test.ts`

```ts
import config from '$config';

console.log(config.foo); // output abc
```

#### `config.name`

Type: `string`<br>
Default: `"$config"`

The virtual module name.

#### `config.path`

Type: `string`<br>
Default: `"./src/config"`

The path where to search config files.

#### `config.env`

Type: `string`<br>
Default: `ctx.command`

The runtime environment of config files. By default, it depends on the current running command of dawn.

Examples:

```shell
$ dn d
```

will load `config.dev.yml` because the actual command is `"dev"`.

```shell
$ dn run my-cmd
```

will load `config.my-cmd.yml`.

#### `config.content`

Type: `any`<br>
Default:

Manually set the whole config content.

### `profile`

Type: `boolean`<br>
Default:

Also can be enabled by setting `process.env.WEBPACK_PROFILE` to any nullish value.

### `statsOpts`

Type: `string | object`<br>
Default: `"verbose"`

Options for `stats` in `webpack-stats-plugin`.

See [webpack docs](https://webpack.js.org/configuration/stats/)

### `analysis`

Type: `boolean | object`<br>
Default:

Options for `webpack-bundle-analyzer`. Set to `false` to disable it. Set to `true` to enable it and use default options (`{ analyzerMode: "server", openAnalyzer: true }`). Auto enabled if `profile` is on.

See [webpack-bundle-analyzer docs](https://github.com/webpack-contrib/webpack-bundle-analyzer#options-for-plugin).

### `watch`

Type: `boolean`<br>
Default:

Enable webpack's watch mode, unavailable in server mode.

### `watchOpts`

Type: `object`<br>
Default: `{ ignored: /node_modules/ }`

See [webpack docs](https://webpack.js.org/configuration/watch/#watchoptions).

### `server`

Type: `boolean`<br>
Default: _Depends on `env`_

Defaults to `true` if `env` is `"development"`, otherwise to `false`.

### `serverOpts`

Type: `object`<br>
Default: `{ host: "localhost", historyApiFallback: true, open: true, hot: true, quiet: true }`

Options for `webpack-dev-server`. Support custom server with `server.*` in current working directory, or with a directory `server/` and several config files.

Examples:

```yaml
# server.yml
host: 127.0.0.1
port: 8001
https: true
proxy:
  /api: https://localhost:3000
  /api2:
    target: https://localhost:3001
    pathRewrite:
      ^/api2: /v2
```

See [webpack docs](https://webpack.js.org/configuration/dev-server/#devserver).
