/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited.
 * @license MIT found in the LICENSE file at https://github.com/alibaba/dawn/blob/master/LICENSE
 * @author DawnTeam
 */

import * as fs from "fs";
import * as path from "path";
import * as dnDebug from "debug";
import * as utils from "./common/utils";
import * as config from "./common/config";
import * as store from "./common/store";

const debug = (namespace?: string) => dnDebug(`dn:stamp:${namespace ?? "anonymous"}`);
const DN_NO_CACHE = "DN_NO_CACHE";

export default class Stamp {
  readonly name: string;
  constructor(name: string) {
    this.name = name.replace(/\//, "-");
    debug("constructor")("name", name);
  }

  public getFileName() {
    debug("getFileName")("name", this.name);
    const storeDir = store.getPath("stamps");
    debug("getFileName")("storeDir", storeDir);
    const filename = path.normalize(`${storeDir}/${this.name}.stamp`);
    debug("getFileName")("filename", filename);
    return filename;
  }
  public async read() {
    const filename = this.getFileName();
    debug("read")("filename", filename);
    if (!fs.existsSync(filename)) return 0;
    const buffer = await utils.readFile(filename, "utf8");
    const timestamp = Number(buffer.toString());
    debug("read")("timestamp", timestamp);
    return timestamp;
  }
  public async write() {
    const filename = this.getFileName();
    debug("write")("filename", filename);
    const timestamp = Date.now();
    debug("write")("timestamp", timestamp);
    return utils.writeFile(filename, timestamp);
  }
  public async isExpire() {
    debug("isExpire")("name", this.name);
    const stamp = await this.read();
    debug("isExpire")("stamp", stamp);
    const ttl: number = process.env[DN_NO_CACHE] ? 0 : Number(await config.getRc("cache", { remote: false }));
    debug("isExpire")("ttl", ttl);
    return Date.now() - stamp >= ttl;
  }
}
