module.exports = function (opts) {
  return async function (next, ctx) {
    opts = Object.assign({ mode: process.env.DN_CMD || 'build' }, opts);
    const { utils, console } = ctx;
    const { mode } = opts;
    console.info('dumi starting ...');

    const docz = utils.findCommand(__dirname, 'dumi');
    utils.exec(`${docz} ${mode}`);
    next();
  };
};