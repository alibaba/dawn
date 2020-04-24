const core = require('../');
const Context = core.Context;

module.exports = async function exec() {
  const cmd = this.get('command');
  const middleware = this.get('$1');
  let context = new Context(this, { cmd });
  await context.exec([{ name: middleware }]);
};
