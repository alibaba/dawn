import os from "os";
import path from "path";
import type { Handler } from "@dawnjs/types";
import type { IOpts } from "./types";

const isWin = os.platform() == "win32";

const handler: Handler<IOpts> = opts => {
  const script = (isWin && opts.wscript ? opts.wscript : opts.script) || [];
  return async (next, ctx) => {
    ctx.console.info("Execute script...");
    const env = Object.assign({}, process.env);
    const bin = path.normalize(`${ctx.cwd}/node_modules/.bin`);
    env.PATH = `${bin}${isWin ? ";" : ":"}${env.PATH}`;
    const pending = ctx.utils.exec(script.join(os.EOL), { env });
    if (!opts.async) {
      await pending;
    }
    ctx.console.info("Done");
    next();
  };
};

export default handler;
