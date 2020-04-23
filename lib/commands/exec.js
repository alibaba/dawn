const core = require('../');
const Context = core.Context;

module.exports = async function exec() {
  const cmd = 'exec';
  process.env.DN_CMD = cmd;
  console.log(this.get('command'));
  console.log(this.get('$1'));
  console.log(this.get('$2'));
  console.log(this);
  let context = new Context(this, { cmd });
  await context.exec([{ name: 'shell', script: ['echo 1'] }]);
};
