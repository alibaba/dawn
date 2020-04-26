import * as fs from "fs";
import * as path from "path";
import * as EventEmitter from "events";
import * as debug from "debug";
import consola from "./common/console";
import type Command from "./command";

type PackageJson = string | number | boolean | null | { [property: string]: PackageJson } | PackageJson[];

export default class Context extends EventEmitter {
  readonly console = consola;
  readonly command: Command;
  readonly cmd: Command;
  readonly cwd = process.cwd();
  readonly project = this.getProjectPackageJson();
  readonly configName = `./.${this.cmd.config.name}`;

  constructor(command: Command) {
    super();
    this.command = command;
    this.cmd = command;
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
  /**
   * exec
   * @param {string} middleware middleware
   */
  public async exec(middleware: any) {
    this.console.log("exec", middleware);
  }
  public get cli() {
    this.console.warn("[] this.cli/ctx.cli.");
    this.trace("cli");
    return this.command;
  }

  // this.trace("some debug info");
  protected trace(formatter: any, ...args: any[]) {
    const namespace = (this.constructor as any)?.id ?? "anonymous";
    debug(`dn:context:${namespace}`)(formatter, ...args);
  }
  protected getProjectPackageJson(): PackageJson {
    const pkgFile = path.normalize(`${this.cwd}/package.json`);
    if (!fs.existsSync(pkgFile)) return {};
    const text = fs.readFileSync(pkgFile).toString();
    return JSON.parse(text);
  }
}
