/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const path = require('path');
const readFile = require('./common/readfile');
const writeFile = require('./common/writefile');
const fs = require('fs');
const store = require('./store');
const configs = require('./configs');
const debug = require('debug')('stamp');

class TimeStamp {

  constructor(name) {
    this.name = name.replace(/\//, '-');
    debug('constructor', name);
  }

  async getFileName() {
    debug('getFileName', this.name);
    let storeDir = await store.getPath('stamps');
    return path.normalize(`${storeDir}/${this.name}.stamp`);
  }

  async read() {
    let filename = await this.getFileName();
    debug('read', filename);
    if (!fs.existsSync(filename)) return 0;
    let buffer = await readFile(filename);
    return Number(buffer.toString());
  }

  async write() {
    let filename = await this.getFileName();
    debug('write', filename);
    return writeFile(filename, Date.now());
  }

  async isExpire() {
    debug('isExpire', this.name);
    let stamp = await this.read();
    let ttl = process.env.DN_NO_CACHE ?
      0 : Number(await configs.getRc('cacheTTL', { remote: false }));
    return Date.now() - stamp >= ttl;
  }

}

module.exports = TimeStamp;