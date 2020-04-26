import * as fs from "fs";
import * as path from "path";
import * as EventEmitter from "events";
import * as dnDebug from "debug";
import consola from "./common/console";
import * as utils from "./common/utils";
import * as config from "./common/config";
import * as middleware from "./common/middleware";
import type Command from "./command";

const debug = (namespace?: string) => dnDebug(`dn:context:builtin:${namespace ?? "anonymous"}`);

type MiddlewareItem = {
  name: string;
  [params: string]: Json;
};

export default class Context extends EventEmitter {
  readonly console = consola;
  readonly command: Command;
  readonly cmd: string = "";
  readonly cwd = process.cwd();
  readonly project = this.getProjectPackageJson();
  readonly conf = config;
  readonly configName = config.configName;
  readonly configPath = config.configPath;

  constructor(command: Command) {
    super();
    this.command = command;
    // console.log(command, opts);

    // opts = opts || {};
    // utils.copy(opts, this);
    // utils.copy(cli.params, this);
    // this.cli = cli;
    // this.cli.pkg = pkg;
    // this.middlewareMgr = middleware;
    // this.templateMgr = template;
    // this.pipeline = opts.pipeline || [];
    // this.command = this.cli.get("command");
    // this.cwd = process.cwd();
    // this.console = console;
    // this.utils = utils;
    // this.inquirer = utils.inquirer;
    // this.configName = `./.${pkg.name}`;
    // this.configPath = path.resolve(this.cwd, this.configName);
    // this.conf = configs;
    // this.mod = mod;
  }
  /**
   * run command
   */
  public async run() {
    // console.log("run");
  }

  public get cli() {
    this.console.warn("[] this.cli/ctx.cli.");
    this.trace("cli");
    return this.command;
  }

  /**
   * configIsExists
   * Check if the configuration under the project exists
   * @implement
   * @return {boolean} is exists
   */
  public async configIsExists() {
    this.trace("config name", this.configName);
    const files = await utils.globby([`${this.configName}/**/*.*`, `${this.configName}.*`]);
    this.trace("config files", files);
    return files.length > 0;
  }

  /**
   * loadLocalConfigs
   * @implement
   * @return {any} local config
   */
  public loadLocalConfigs(): { [key: string]: Json } {
    const localConfigs = utils.confman.load(this.configPath);
    this.trace("localConfigsKeys", Object.keys(localConfigs));
    this.trace("localConfigs", localConfigs);
    return localConfigs || {};
  }

  public async loadPipeline(cmd?: string) {
    const cmdName = cmd || this.cmd;
    const list = (await this.loadLocalePipeline(cmdName)) as any[];
    return this.mergeRemotePipeline(cmdName, list || []);
  }

  public async load(opts?: Function | MiddlewareItem) {
    debug("load")("opts", opts);
    if (typeof opts === "function") return opts;
    if (!opts?.name) {
      throw new Error("Invalid pipeline config");
    }
    const options = this.parseOpts(opts);
    const modFactory = options.location
      ? require(path.resolve(this.conf.cwd, options.location as string))
      : await middleware.acquire(options.name, this.conf.cwd);

    debug("load")("modFactory", modFactory);
    if (!utils.isFunction(modFactory)) {
      throw new Error(`Invalid middleware '${options.name}'`);
    }
    return modFactory.call(this, options, this);
  }

  /**
   * exec
   * @param {string} middlewares middleware
   * @param {any} initailArgs initailArgs
   */
  public async exec(middlewares: MiddlewareItem[] | MiddlewareItem, initailArgs?: any) {
    if (!Array.isArray(middlewares)) middlewares = [middlewares]; // eslint-disable-line no-param-reassign
    this.console.log("exec", middleware);
  }

  protected parseOpts(opts: MiddlewareItem) {
    const options: MiddlewareItem = { name: "" };
    debug("parseOpts")("opts", opts);
    Object.entries(opts).forEach(([name, value]) => {
      const newName = utils.isString(name) ? utils.unescapeExpr(utils.stp(name)(this) || name) : name;
      if (utils.isString(value)) {
        options[newName] = utils.unescapeExpr(utils.stp(value as string)(this));
      } else if (utils.isObject(value)) {
        options[newName] = this.parseOpts(value as MiddlewareItem);
      } else {
        options[newName] = value;
      }
    });
    debug("parseOpts")("options", options);
    return options;
  }

  protected async mergeRemotePipeline(cmd: string, list: any[]) {
    const remotePipe = (await config.getRemoteConf("pipe")) || {};
    const pipe = {
      ...remotePipe,
      before: remotePipe.before || [],
      after: remotePipe.after || [],
    };
    debug("mergeRemotePipeline")("pipe.before", pipe.before);
    debug("mergeRemotePipeline")("pipe.after", pipe.after);

    const beforeList = pipe.before[cmd] || [];
    beforeList.reverse();
    beforeList.forEach((item: any) => {
      if (list.some(i => i.name === item.name && !item.force)) {
        debug("mergeRemotePipeline")("pipe.before.duplicate", item);
        return;
      }
      list.unshift(item);
    });
    const afterList = pipe.after[cmd] || [];
    afterList.forEach((item: any) => {
      if (list.some(i => i.name === item.name && !item.force)) {
        debug("mergeRemotePipeline")("pipe.after.duplicate", item);
        return;
      }
      list.push(item);
    });
    return list;
  }

  protected loadLocalAllPipeline() {
    const localConfigs = this.loadLocalConfigs();
    debug("loadLocalAllPipeline")("localConfigsPipe", localConfigs.pipe ?? {});
    return (localConfigs.pipe ?? {}) as { [key: string]: Json };
  }

  protected async loadLocalePipeline(cmd?: string) {
    const cmdName = cmd || this.cmd;
    debug("loadLocalePipeline")("cmdName", cmdName);
    if (!(await this.configIsExists())) return [];
    const pipelines = this.loadLocalAllPipeline();
    const pipeline = pipelines?.[cmdName] ?? [];
    debug("loadLocalePipeline")("return", pipeline);
    return pipeline;
  }

  // this.trace("some debug info");
  protected trace(formatter: any, ...args: any[]) {
    const namespace = (this.constructor as any)?.id ?? "anonymous";
    dnDebug(`dn:context:${namespace}`)(formatter, ...args);
  }
  protected getProjectPackageJson(): Json {
    const pkgFile = path.normalize(`${this.cwd}/package.json`);
    debug("getProjectPackageJson")("pkgFile", pkgFile);
    if (!fs.existsSync(pkgFile)) return {};
    const text = fs.readFileSync(pkgFile).toString();
    return JSON.parse(text);
  }
}
