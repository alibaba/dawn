/* eslint-disable no-param-reassign */
import * as fs from "fs";
import * as util from "util";
import * as jsYaml from "js-yaml";
import * as nodeFetch from "node-fetch";

const DEFAULT_TIMEOUT = -1;

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
