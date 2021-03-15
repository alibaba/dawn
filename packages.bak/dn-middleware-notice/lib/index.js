const os = require('os');

/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {
  opts = Object.assign({
    title: '重要提示：',
    type: 'warn',
    message: [],
    confirm: false,
  }, opts);
  return async function (next, ctx) {
    const { title, message = [], type, confirm } = opts;
    if (!message || message.length < 1) return next();
    const buffer = ['', title];
    message.forEach(item => buffer.push(`● ${item}`));
    buffer.push('');
    ctx.console[type](buffer.join(os.EOL));
    next();
  };

};