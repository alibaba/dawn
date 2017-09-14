const Stamp = require('./stamp');
const store = require('./store');
const readFile = require('./common/readfile');
const writeFile = require('./common/writefile');
const path = require('path');
const fs = require('fs');

exports.getFile = async function (name) {
  let cacheDir = await store.getPath('caches');
  return path.normalize(`${cacheDir}/${name}.cache`);
};

exports.getStamp = async function (name) {
  return new Stamp(`${name}.cache`);
};

exports.get = async function (name) {
  let stamp = await this.getStamp(name);
  let filename = await this.getFile(name);
  let isExists = fs.existsSync(filename);
  let isExpire = await stamp.isExpire();
  let value = isExists ? await readFile(filename) : null;
  return { isExists, isExpire, value };
};

exports.set = async function (name, value) {
  let stamp = await this.getStamp(name);
  let filename = await this.getFile(name);
  await Promise.all([
    writeFile(filename, value),
    stamp.write()
  ]);
};