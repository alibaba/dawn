const fs = require('fs');
const readfile = require('./readfile');

module.exports = async function (filename) {
  const buffer = await readfile(filename);
  try {
    return JSON.parse(buffer.toString('utf-8'));
  } catch (e) {
    return {};
  }
};
