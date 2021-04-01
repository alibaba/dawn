import { Handler } from "@dawnjs/types";
import { getOpts, validateOpts } from "./opts";
import { run } from "./babel";
import { INextArgs, IOpts } from "./types";

const handler: Handler<IOpts, INextArgs> = options => {
  return async (next, ctx) => {
    const opts = getOpts(options, ctx);
    if (ctx.emit) {
      ctx.emit("babel.opts", opts);
      await ctx.utils.sleep(100);
    }

    await validateOpts(opts, ctx);

    const babelOpts = await run(opts, ctx);

    await next({ babelOpts });
  };
};

export default handler;
