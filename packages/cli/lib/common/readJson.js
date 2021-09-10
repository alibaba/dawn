const fs = require('fs');
const readfile = require('./readfile');

module.exports = async function (filename) {
  try {
    const buffer = await readfile(filename);
    return JSON.parse(buffer.toString('utf-8'));
  } catch (e) {
    return {};
  }
};
