import type { Handler } from "@dawnjs/types";
import type { IOpts } from "./types";

const handler: Handler<IOpts> = opts => {
  return async (next, ctx) => {
    ctx.console.info("Cleaning files...");
    // @ts-ignore TS2349
    await ctx.utils.del(opts.target || ["./build/", "./dist/"]);
    ctx.console.info("Done.");
    next();
  };
};

export default handler;
