# @dawnjs/dn-middleware-i18n

[![npm](https://img.shields.io/npm/v/@dawnjs/dn-middleware-i18n)](https://www.npmjs.com/package/@dawnjs/dn-middleware-i18n)
[![npm](https://img.shields.io/npm/dw/@dawnjs/dn-middleware-i18n)](https://www.npmjs.com/package/@dawnjs/dn-middleware-i18n)

这是一个集成了「i18n」的前端多语言 dawn 中间件。

## 1. 添加 pipe 配置，启用 i18n

```yml
dev:
  - name: '@dawnjs/dn-middleware-i18n'
  - name: '@dawnjs/dn-middleware-webpack'
```

默认文案存放在根目录的 locales 下 (如果没有请新建)，每个语言一个文件，示例

```
zh-CN.yml
zh-HK.yml
en-US.yml
```

## 2. 在代码中使用多语言文案

```js
import i18n from '$i18n';

function App() {
  return <div>{i18n('hello')}</div>;
}
```

其中 `hello` 是在文案中的 `key`，同时还支持「文案占位符」和「文案默认值」，例如

有如下文案

```yml
hello: 你好，{name}
```

可以这样使用

```js
i18n('hello', { name: '张三' });
i18n('xxxx', null, '默认兜底文案');
i18n('xxxx', '默认兜底文案');
i18n('hello', { name: '张三' }, '默认兜底文案');
```

如果 `xxxx` 没有在文案中定义，将会显示「兜底文案」。

此外，还可在文案中包括「动态计算的表达式」，比如

```yml
info: There are {total} {total>1?'records':'record'}
```

那么，将会有如下的结果

```js
i18n('info', { total: 1 });
//将显示：There are 1 record

i18n('info', { total: 2 });
//将显示：There are 2 records
```

## 3. 启用 JSX 的支持

如果是 `React` 工程，还可开启 `JSX` 的支持，此时 `i18n` 返回的将不是普通字符串，而且是合法的 `ReactNode`

```yml
dev:
  - name: '@dawnjs/dn-middleware-i18n'
    jsx: true
  - name: '@dawnjs/dn-middleware-webpack'
```

那么，可在引用文案时，这样写

```jsx
i18n('key', {
  abc: <span>Hello</span>,
});
```

## 4. 如何识别对应的 language

因为场景多变，为了更通用，`i18n` 并不会自动侦测当前应用使用语言，需要在应用启动时告知 `i18n` 当前语言。

比如，在应用启用时加入如下代码，可以根据当前「浏览器语言设定」渲染界面

```js
import i18n from '$i18n';

i18n.init({
  language: navigator.language
  defaultLanguage: 'zh-CN'
});
```

同时，还可以通过 `defaultLanguage` 设定「默认语言」，当检查到的语言，当前应用并未支持时，会以「默认语言」显示。

## 5. 构建单独的语言包

默认情况下，语言文案将会和代码一并打在一个 bundle 中，如果想分离语言包，可通过 extract 选项，示例如下

```yml
dev:
  - name: '@dawnjs/dn-middleware-i18n'
    extract: ./build/locales
  - name: '@dawnjs/dn-middleware-webpack'
```

通过如上的配置，语言文案将会并分别打包并存放到 ./build/locales 目录，每种语言都会打成一个单独的语言包。
此时，只需要在页面中并在应用代码之前引用语言包文件就行了，引用哪个语言包，当前就会自动显示那种语言的文案。

注意：如果引用的一个其他方式生成的独立发布的「全量语言包」，全量包或包括了所有语言，类似如下格式

```json
{
  "zh-CN": {},
  "en-US": {}
}
```

此时，也是能正确工作的，i18n 也会自动根据 init 时指定的 lang 找到正确的语言文案。
