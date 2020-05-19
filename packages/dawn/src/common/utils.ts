/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited.
 * @license MIT found in the LICENSE file at https://github.com/alibaba/dawn/blob/master/LICENSE
 * @author DawnTeam
 */

/* eslint-disable no-param-reassign */
import * as fs from "fs";
import * as path from "path";
import * as util from "util";
import * as jsYaml from "js-yaml";
import * as nodeFetch from "node-fetch";
import * as _del from "del";
import * as _stp from "stp";

import executes from "../executes";

const DEFAULT_TIMEOUT = -1;

export const del = _del;

export function trim(str: string, char?: string) {
  if (!str) return str;
  while (str[0] === char) {
    str = str.substr(1);
  }
  while (str[str.length - 1] === char) {
    str = str.substr(0, str.length - 1);
  }
  return str;
}

export function isString(value: any) {
  return typeof value === "string";
}
export function isObject(value: any) {
  return value !== null && typeof value === "object";
}
export function isFunction(value: any) {
  return typeof value === "function";
}

export const readFile = util.promisify(fs.readFile);
export const writeFile = util.promisify(fs.writeFile);

export const yaml = {
  parse: (yamlText: string | null) => jsYaml.safeLoad(yamlText ?? ""),
  stringify: (json: Json | null) => jsYaml.safeDump(json ?? {}),
};

export const fetch = (url: string, opts: RequestInit & { timeout?: number }): Promise<Response> => {
  url = decodeURIComponent(url.trim());
  opts = Object.assign({}, opts);
  opts.timeout = opts.timeout || DEFAULT_TIMEOUT;
  return new Promise((resolve, reject) => {
    const timer =
      (opts?.timeout ?? 0) > -1
        ? setTimeout(() => {
            reject(new Error(`Request '${url}' timeout`));
          }, opts.timeout)
        : null;
    const wrapper = (fn: Function) => {
      return (...args: any) => {
        if (timer) clearTimeout(timer);
        return fn(...args);
      };
    };
    delete opts.timeout;
    const innerFetch = ((fetch as any).filter ? (fetch as any).filter(url, opts) : nodeFetch) || nodeFetch;
    innerFetch(url, opts).then(wrapper(resolve)).catch(wrapper(reject));
  });
};

export * as globby from "globby";
export * as confman from "confman";
export const stp = _stp;

export const unescapeExpr = (str?: string): string => {
  if (!str) return str ?? "";
  return str.replace(/\\\{/, "{").replace("/\\}/", "}");
};

export const { exec, execWithResult, withResult } = executes;

export function findCommand(dirname: string, command: string): string {
  const commandPath = path.normalize(`${dirname}/node_modules/.bin/${command}`);
  if (fs.existsSync(commandPath)) return commandPath;
  if (dirname === "/" || dirname === "." || /^[a-z]:\/\/$/i.test(dirname)) {
    return "";
  }
  return findCommand(path.dirname(dirname), command);
}
