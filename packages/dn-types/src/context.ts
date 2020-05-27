import * as Inquirer from "inquirer";
import * as Events from "events";
import { Pipeline } from "./pipeline";
import { PackageJson } from "./package";
import { Configs } from "./config";
import { MiddlewareUtils } from "./middleware";
import { ModuleUtils } from "./module";
import Utils from "./utils";

// TODO
export interface CommandLineCli {
  [key: string]: any;
}

export type ContextOptions<Opt, NextArgs> = Partial<
  Pick<Context<Opt, NextArgs>, "template" | "pipeline" | "command" | "env">
>;

export type DefaultMiddlewareOpts = any;

export type Handler<MiddlewareOpts = DefaultMiddlewareOpts, MiddlewareNextArgs = undefined> = (
  options: MiddlewareOpts,
  ctx: Context<MiddlewareOpts, MiddlewareNextArgs>,
) => HandlerHOF<MiddlewareOpts, MiddlewareNextArgs>;

export type HandlerHOF<MiddlewareOpts = DefaultMiddlewareOpts, MiddlewareNextArgs = undefined> = (
  next: (nextArgs?: MiddlewareNextArgs) => Promise<void>,
  ctx: Context<MiddlewareOpts, MiddlewareNextArgs>,
  args?: any,
) => Promise<void>;

export interface Context<MiddlewareOpts = DefaultMiddlewareOpts, MiddlewareNextArgs = undefined>
  extends Events.EventEmitter {
  [manualProps: string]: any;
  /**
   * Cmdline cli instance
   */
  cli: CommandLineCli;
  /**
   * Pipeline
   */
  pipeline: Pipeline;
  /**
   * Such as dn-template-foo/bar
   */
  template: string;
  middlewareMgr: MiddlewareUtils;
  templateMgr: any;
  /**
   * Cmd name: dev/init/publish...
   */
  command: string;
  /**
   * Alias for command
   */
  cmd: string;
  /**
   * env
   */
  env: string;
  /**
   * Current workspace dir
   */
  cwd: string;
  /**
   * utils
   */
  utils: Utils;
  /**
   * inquirer
   */
  inquirer: Inquirer.Inquirer;
  console: typeof console;
  /**
   * @default `./.dawn`
   */
  configName: string;
  /**
   * @default `${cwd}/.dawn`
   */
  configPath: string;
  /**
   * TODO:
   */
  conf: any;
  /**
   * mod
   */
  mod: ModuleUtils;
  //

  /**
   * Current workspace `package.json` content, which based on `cwd`.
   */
  project: PackageJson;
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  new (cli: CommandLineCli, options?: ContextOptions<MiddlewareOpts, MiddlewareNextArgs>): Context;
  /**
   * check if config exists
   */
  configIsExists(): Promise<boolean>;
  /**
   * loadLocalConfigs
   */
  loadLocalConfigs(): Promise<Configs>;
  /**
   * loadPipeline
   */
  loadPipeline(command: string): Promise<Pipeline>;
  unescapeExpr(str: string): string;
  /**
   * load
   */
  load(options: MiddlewareOpts): HandlerHOF<MiddlewareOpts, MiddlewareNextArgs>;
  /**
   * exec
   */
  exec(middlewares: any, initailArgs?: any): Promise<any>;
  /**
   * run
   */
  run(): Promise<any>;
}
