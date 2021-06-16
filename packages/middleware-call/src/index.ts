import type { Handler } from "@dawnjs/types";
import type { IOpts } from "./types";

const toArr = arr => {
  if (!arr) {
    return [];
  }
  if (Array.isArray(arr)) {
    return arr;
  }
  return [arr];
};

const handler: Handler<IOpts> = opts => {
  return async (next, ctx) => {
    if (!opts.pipe && !opts.when) {
      return next();
    }

    const call = async pipes => {
      for (let i = 0; i < pipes.length; i++) {
        const pipename = pipes[i];
        const pipe = await ctx.loadPipeline(pipename);
        // @ts-ignore TS2365
        if (!pipe || pipe.length < 1) {
          continue;
        }
        ctx.console.info(`Calling '${pipename}'`);
        await ctx.exec(pipe);
      }
    };

    const compileCache = {};
    const compile = expr => {
      if (!compileCache[expr]) {
        // eslint-disable-next-line no-new-func,@typescript-eslint/no-implied-eval
        compileCache[expr] = new Function(`with(this){return (${expr})}`);
      }
      return compileCache[expr];
    };

    const list = toArr(opts.pipe);

    Object.keys(opts.when || {}).forEach(expr => {
      const func = compile(expr);
      if (func.call(ctx)) {
        list.push(opts.when[expr]);
      }
    });

    await call(list);

    next();
  };
};

export default handler;
