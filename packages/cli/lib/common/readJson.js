const readfile = require('./readfile');
const console = require('./console');

module.exports = async function (filename) {
  try {
    const buffer = await readfile(filename);
    return JSON.parse(buffer.toString('utf-8'));
  } catch (e) {
    console.error(e);
    return {};
  }
};
