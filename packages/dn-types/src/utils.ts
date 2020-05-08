import * as del from "del";
import * as globby from "globby";
import fetch from "node-fetch";
import type { Inquirer, QuestionCollection } from "inquirer";
import type { ModuleUtils } from "./module";
import type { Confman } from "./confman";

type JsYamlParse = (text: string) => any;
type JsYamlStringify = (obj: any) => string;

type Any2Any = (stream: any) => Promise<any>;

interface Ntils {
  clone(src: any, igonres: any): any;
  copy(src: any, dst: any, igonres: any): any;
  deepEqual(a: any, b: any): any;
  each(list: any, handler: any, scope: any): any;
  escapeRegExp(str: any): any;
  firstUpper(str: any): any;
  formatDate(value: any, format: any, dict: any): any;
  fromTo(from: any, to: any, handler: any, step: any): void;
  getByPath(obj: any, path: any, filter: any): any;
  getFunctionArgumentNames(fn: any): any;
  getType(obj: any): any;
  htmlPrefilter(html: any): any;
  isArray(obj: any): any;
  isAsyncFunction(obj: any): any;
  isBoolean(obj: any): any;
  isDate(val: any): any;
  isElement(obj: any): any;
  isFunction(obj: any): any;
  isFunctionString(str: any): any;
  isGeneratorFunction(obj: any): any;
  isNull(obj: any): any;
  isNumber(obj: any): any;
  isObject(obj: any): any;
  isRegExp(val: any): any;
  isString(obj: any): any;
  isText(obj: any): any;
  isTypedArray(obj: any): any;
  mix(dst: any, src: any, igonres: any, mode: any, igonreNull: any): any;
  newGuid(): any;
  noop(): void;
  parseHTML(str: any): any;
  replace(str: any, from: any, to: any): any;
  setByPath(obj: any, path: any, value: any): void;
  toArray(array: any): any;
  toCamelCase(str: any, mode: any): any;
  toDate(val: any): any;
  toFunction(str: any): any;
  toSplitCase(str: any): any;
  toString(obj: any): any;
}

export default interface Utils extends Ntils {
  exec: (script: string, opts?: any) => Promise<void>;
  writeFile: (filename: string, content: any) => Promise<string>;
  readFile: <Content = any>(filename: string) => Promise<Content>;
  del: typeof del;
  mkdirp: (path: string) => Promise<string>;
  download: (url: string) => Promise<any>;
  sleep: (delay: number) => Promise<void>;
  prompt: {
    pick: (opts: QuestionCollection<{}>) => Promise<any>;
  };
  npm: ModuleUtils;
  mod: ModuleUtils;
  open: (url: string) => boolean;
  oneport: () => Promise<number>;
  fetch: typeof fetch;
  stp: (strTmpl: string, data?: any) => string;
  yaml: { parse: JsYamlParse; stringify: JsYamlStringify } & JsYamlParse;
  trim: (str: string, char?: string) => string;
  inquirer: Inquirer;
  globby: typeof globby;
  glob: typeof globby;
  files: typeof globby;
  confman: Confman;
  config: Confman;
  streamToBuffer: Any2Any;
  bufferToStream: Any2Any;
  stream2buffer: Any2Any;
  buffer2stream: Any2Any;
  copydir: (src: string, dst: string) => Promise<string>;
  findCommand: (dirname: string, command: string) => string;
  shorten: (str: string, max?: number) => string;
}
