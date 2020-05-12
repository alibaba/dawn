/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited.
 * @license MIT found in the LICENSE file at https://github.com/alibaba/dawn/blob/master/LICENSE
 * @author DawnTeam
 */

import * as fs from "fs";
import * as path from "path";
import * as dnDebug from "debug";
import * as utils from "./utils";
import * as store from "./store";
import Stamp from "../stamp";

const debug = (namespace?: string) => dnDebug(`dn:cache:${namespace ?? "anonymous"}`);

export const getFile = (name: string) => {
  const cacheDir = store.getPath("caches");
  debug("getFile")("cacheDir", cacheDir);
  const cacheFile = path.normalize(`${cacheDir}/${name}.cache`);
  debug("getFile")("cacheFile", cacheFile);
  return cacheFile;
};

export const getStamp = (name: string) => {
  return new Stamp(`${name}.cache`);
};

export const get = async (name: string) => {
  debug("get")("name", name);
  const stamp = getStamp(name);
  const filename = getFile(name);
  debug("get")("stamp", stamp);
  debug("get")("filename", filename);
  const isExists = fs.existsSync(filename);
  debug("get")("isExists", isExists);
  const isExpire = await stamp.isExpire();
  debug("get")("isExpire", isExpire);
  const value = isExists ? (await utils.readFile(filename)).toString() : null;
  debug("get")("value", value);
  return { isExists, isExpire, value };
};

export const set = async (name: string, value?: any) => {
  debug("set")("name", name);
  const stamp = getStamp(name);
  debug("set")("stamp", stamp);
  const filename = getFile(name);
  debug("set")("filename", filename);
  await Promise.all([utils.writeFile(filename, value), stamp.write()]);
};
