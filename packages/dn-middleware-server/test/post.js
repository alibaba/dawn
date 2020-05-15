module.exports = async ctx => {
  return { post: true, body: ctx.request.body };
};
