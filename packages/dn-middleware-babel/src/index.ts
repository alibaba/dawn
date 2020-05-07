import { IDawnContext, IOpts } from "./types";
import { getOpts, validateOpts } from "./opts";
import { run } from "./babel";

export default (options: IOpts) => {
  return async (next: Function, ctx: IDawnContext) => {
    ctx.console.log("Babel transform starting...");

    const opts = getOpts(options, ctx);
    if (ctx.emit) {
      ctx.emit("babel.opts", opts);
      await ctx.utils.sleep(100);
    }

    validateOpts(opts, ctx);

    await run(opts, ctx);

    await next();
  };
};
