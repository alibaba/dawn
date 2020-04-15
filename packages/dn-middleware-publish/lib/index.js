module.exports = function (opts) {

  opts = Object.assign({
    client: 'npm',
    registry: 'http://registry.npmjs.org',
  }, opts);

  return async function (next, ctx) {

    const { client, registry } = opts;
    await ctx.exec({ name: 'version' });
    await ctx.utils.exec(`${client} publish --registry='${registry}'`);
    next();

  };

};