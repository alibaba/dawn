import * as dnDebug from "debug";
import * as path from "path";
import * as del from "del";
import * as mkdirp from "mkdirp";
import { paths } from "./config";

const debug = (namespace?: string) => dnDebug(`dn:store:${namespace ?? "anonymous"}`);

export const getPath = (name: string) => {
  const { storePath } = paths;
  debug("getPath")("storePath", storePath);
  const storeItemPath = path.normalize(`${storePath}/${name || ""}`);
  debug("getPath")("storeItemPath", storeItemPath);
  const madePath = mkdirp.sync(storeItemPath);
  debug("getPath")("madePath", madePath);
  return storeItemPath;
};

export const clean = async (name?: string) => {
  const { storePath } = paths;
  debug("clean")("storePath", storePath);
  const cleanPath = name ? path.join(storePath, name) : storePath;
  await del([`${cleanPath}/**/*.*`], {
    force: true,
  });
};
