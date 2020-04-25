import * as EventEmitter from "events";

export default class Context extends EventEmitter {
  constructor(cli: any, opts: any) {
    super();
    // console.log(cli, opts);
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
    // console.log("exec", middleware);
  }
}
