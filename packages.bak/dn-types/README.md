# @dawnjs/types

## 安装依赖

```bash
$ npm install --save-dev @dawnjs/types
```

## 使用方式

```typescript
// 中间件的 TS 入口文件
// src/index.ts

import * as Dawn from "@dawnjs/types";

interface IOptions {
  name?: string;
  age?: number;
}

const handler: Dawn.Handler<IOptions> = opts => {
  return async (next, ctx) => {
    ctx.console.log(`My name is ${opts.name}`);
    ctx.console.log(ctx.utils.isFunction(ctx.load));
    await next();
  };
};

export default handler;
```
