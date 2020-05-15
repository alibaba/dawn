module.exports = async ctx => {
  return { get: true, qs: ctx.query, qss: ctx.querystring };
};
