import * as dnDebug from "debug";
import * as fs from "fs";
import * as path from "path";

import * as pkg from "pjson";
import * as utils from "./utils";
import * as cache from "./cache";
import * as store from "./store";

import consola from "./console";

export * from "pjson";

const debug = (namespace?: string) => dnDebug(`dn:config:${namespace ?? "anonymous"}`);
const FETCH_TIMEOUT = 30000;

export const cwd = process.cwd();

const ENV = process.env;
const homePath = ENV.HOME || ENV.USERPROFILE || (ENV?.HOMEDRIVE ?? "/") + ENV?.HOMEPATH;
const dataPath = ENV.HOME || ENV.APPDATA || ENV.LOCALAPPDATA || ENV.TMPDIR || ENV.TEMP;
export const paths = {
  homePath, // /Users/admin
  dataPath, // /Users/admin
  storePath: path.normalize(`${dataPath}/.${pkg.name}`), // /Users/admin/.dawn
  rcPath: `${homePath}/.${pkg.name}rc`, // /Users/admin/.dawnrc
};

/**
 * ./.dawn
 */
export const configName = `./.${pkg.name}`;
export const configPath = path.resolve(cwd, configName);

export const pkgConfig = (pkg as any)[pkg.name ?? "dawn"];

utils.confman.loaders.push({
  // .dawnrc extname is blank: ""
  extname: "",
  loader: ".yaml",
});

export const getProjectRc = (name?: string) => {
  const configsPath = path.resolve(cwd, configName);
  debug("getProjectRc")("configs", configsPath);
  const configs: any = utils.confman.load(configsPath);
  debug("getProjectRc")("configs", configs);
  const rcObject = configs?.rc || {};
  const value = name ? rcObject[name] || "" : rcObject;
  debug("getProjectRc")(name || "all", value || "<null>");
  return utils.isString(value) ? value.trim() : value;
};

export const getLocalRc = (name?: string) => {
  const rcFilePath = paths.rcPath;
  debug("getLocalRc")("rc", rcFilePath);
  if (!fs.existsSync(rcFilePath)) return name ? "" : {};
  const rcObject: any = utils.confman.load(rcFilePath);
  debug("getLocalRc")("rc", rcObject);
  const value = name ? rcObject[name] || "" : rcObject;
  debug("getLocalRc")(name || "all", value || "<null>");
  return utils.isString(value) ? value.trim() : value;
};

export const setLocalRc = async (name: string, value: any) => {
  const rcObject = {
    ...getLocalRc(),
    [name]: value,
  };
  debug("setLocalRc")("name", name);
  debug("setLocalRc")("value", value);
  const text = utils.yaml.stringify(rcObject);
  const rcFilePath = paths.rcPath;
  debug("setLocalRc")("rcFilePath", rcFilePath);
  await utils.writeFile(rcFilePath, text);
};

export const getLocalConf = async (name: string, defaultValue = {}) => {
  debug("getLocalConf")("name", name);
  const localStoreDir = store.getPath("configs");
  debug("getLocalConf")("localStoreDir", localStoreDir);
  const filename = path.normalize(`${localStoreDir}/${name}.json`);
  if (!fs.existsSync(filename)) return defaultValue;
  const text = (await utils.readFile(filename)).toString();
  debug("getLocalConf")("text", text);
  return JSON.parse(text);
};

export const setLocalConf = async (name: string, value: any) => {
  debug("setLocalConf")("name", name);
  debug("setLocalConf")("value", value);
  const localStoreDir = store.getPath("configs");
  debug("setLocalConf")("localStoreDir", localStoreDir);
  const filename = path.normalize(`${localStoreDir}/${name}.json`);
  debug("setLocalConf")("filename", filename);
  const text = JSON.stringify(value);
  debug("setLocalConf")("text", text);
  await utils.writeFile(filename, text);
};

export const getRemoteRc = async (name: string) => {
  debug("getRemoteRc")("remoteRCConf");
  const remoteRCConf = (await getRemoteConf("rc")) || {};
  debug("getRemoteRc")("remoteRCConf", remoteRCConf);
  const value = name ? remoteRCConf[name] || "" : remoteRCConf;
  debug("getRemoteRc")("remoteRCConfValue", value);
  return utils.isString(value) ? value.trim() : value;
};

export const getRc = async (name: string, opts?: { remote?: boolean }) => {
  const value =
    getProjectRc(name) ||
    getLocalRc(name) ||
    (opts?.remote !== false && (await getRemoteRc(name))) ||
    pkgConfig[name] ||
    "";
  return utils.isString(value) ? value.trim() : value;
};

export const getServerUri = function () {
  const defaultUri = (pkg as any)?.[pkg.name ?? "dawn"].server || "";
  const serverUri = getProjectRc("server") || getLocalRc("server") || defaultUri;
  debug("getServerUri")("serverUri", serverUri);
  return utils.isString(serverUri) ? utils.trim(serverUri.trim(), "/") : "";
};

export const getRemoteConf = async (name: string, defaultValue = {}) => {
  const serverUri = getServerUri();
  const url = `${serverUri}/${name}.yml`;
  debug("getRemoteConf")("url", url);
  const cacheInfo = await cache.get(name);
  debug("getRemoteConf")("cacheInfo", cacheInfo);
  if (cacheInfo.isExists && !cacheInfo.isExpire) {
    return utils.yaml.parse(cacheInfo.value) || defaultValue;
  }
  let res;
  try {
    res = await utils.fetch(url, { timeout: FETCH_TIMEOUT });
  } catch (err) {
    consola.warn(err.message);
    return cacheInfo.isExists ? utils.yaml.parse(cacheInfo.value) : defaultValue;
  }
  if (res.status < 200 || res.status > 299) {
    return cacheInfo.isExists ? utils.yaml.parse(cacheInfo.value) : defaultValue;
  }
  const text = await res.text();
  debug("getRemoteConf")("text", text);
  await cache.set(name, text);
  return utils.yaml.parse(text) || defaultValue;
};
