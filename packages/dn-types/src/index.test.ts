import * as Dawn from "./index";

const handler: Dawn.Handler<{ foo?: string }> = options => {
  return async (next, ctx) => {
    console.log(ctx.project, options);
    ctx.fooasdf = 1234;
    await ctx.utils.fetch("asdf");

    ctx.utils.yaml.parse("");
    ctx.utils.yaml("");
    ctx.utils.yaml.stringify({});

    ctx.utils.confman.load("");

    ctx.utils.globby([]);

    ctx.console.log(ctx.project);

    ctx.utils.isFunction({});

    return next();
  };
};

export default handler;
