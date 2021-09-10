const fs = require('fs');
const console = require('console');

module.exports = function (filename) {
  try {
    return JSON.parse(fs.readFileSync(filename).toString('utf-8'));
  } catch (e) {
    console.error(e);
    return {};
  }
};
