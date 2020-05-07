export default (opts: Record<string, any>) => {
  return async (next: Function, ctx: any) => {
    // 在这里处理你的逻辑
    ctx.console.log("This is an example");
    ctx.console.log("opts", JSON.stringify(opts));

    // 触发后续执行
    await next();

    // 在这里添加后续执行完成后的逻辑
  };
};
