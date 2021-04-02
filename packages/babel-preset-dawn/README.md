# @dawnjs/babel-preset-dawn

[![npm](https://img.shields.io/npm/v/@dawnjs/babel-preset-dawn)](https://www.npmjs.com/package/@dawnjs/babel-preset-dawn)
[![npm](https://img.shields.io/npm/dw/@dawnjs/babel-preset-dawn)](<(https://www.npmjs.com/package/@dawnjs/babel-preset-dawn)>)

## Usage

In `.babelrc` :
```json
{
  "presets": [
    [
      "@dawnjs/babel-preset-dawn",
      {
        "typescript": true,
        "react": {
          "development": true
        }
      }
    ]
  ]
}
```
## Options

| Name | Type | Description |
| --- | --- | --- |
| typescript | `boolean` | Whether support typescript or not |
| env | `object` | Options pass to `@babel/preset-env` |
| react | <code>boolean &#124; object</code> | Whether support react or not. If pass object, it's options pass to `@babel/preset-react` |
| reactRequire | `boolean` | Whether include `babel-plugin-react-require` or not |
| transformRuntime | `object` | Options pass to `@babel/plugin-transform-runtime`, disabled if not set it |
