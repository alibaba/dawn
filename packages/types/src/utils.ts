import * as del from "del";
import * as globby from "globby";
import * as ntils from "ntils";
import fetch from "node-fetch";
import { Inquirer, QuestionCollection } from "inquirer";
import { ModuleUtils } from "./module";
import { Confman } from "./confman";

type JsYamlParse = (text: string) => any;
type JsYamlStringify = (obj: any) => string;

type Any2Any = (stream: any) => Promise<any>;

type Ntils = typeof ntils;

export default interface Utils extends Ntils {
  exec: ((script: string, opts?: any) => Promise<void>) & {
    withResult: (script: string, opts?: any) => Promise<string>;
  };
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
