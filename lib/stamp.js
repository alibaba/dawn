/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 */

const path = require('path');
const readFile = require('./common/readfile');
const writeFile = require('./common/writefile');
const fs = require('fs');
const store = require('./common/store');
const configs = require('./configs');

class TimeStamp {

  constructor(name) {
    this.name = name.replace(/\//, '-');
  }

  async getFileName() {
    let storeDir = await store.getPath('stamps');
    return path.normalize(`${storeDir}/${this.name}.stamp`);
  }

  async read() {
    let filename = await this.getFileName();
    if (!fs.existsSync(filename)) return 0;
    let buffer = await readFile(filename);
    return Number(buffer.toString());
  }

  async write() {
    let filename = await this.getFileName();
    return writeFile(filename, Date.now());
  }

  async isExpire() {
    let stamp = await this.read();
    let ttl = process.env.DN_NO_CACHE ?
      0 : Number(await configs.getRc('cacheTTL'));
    return Date.now() - stamp >= ttl;
  }

}

module.exports = TimeStamp;