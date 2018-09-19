module.exports = function (opts) {
  return async function (next) {
    const doc = this.utils.findCommand(__dirname, 'doczilla');
    opts = Object.assign({ mode: process.env.DN_CMD || 'build' }, opts);
    const command = `${doc} ${opts.mode}`;
    await this.utils.exec(command);
    next();
  };
};