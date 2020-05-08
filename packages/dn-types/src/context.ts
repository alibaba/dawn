import type { Inquirer } from "inquirer";
import type * as Events from "events";
import type { Pipeline } from "./pipeline";
import type { Configs } from "./config";
import type { MiddlewareUtils } from "./middleware";
import type { ModuleUtils } from "./module";
import type Utils from "./utils";

// TODO
export interface CommandLineCli {
  [key: string]: any;
}
export type ContextOptions<Opt, Res> = Partial<Pick<Context<Opt, Res>, "template" | "pipeline" | "command" | "env">>;

export type DefaultMiddlewareOpts = any;

export type Handler<MiddlewareOpts = DefaultMiddlewareOpts, MiddlewareRes = any> = (
  options: MiddlewareOpts,
  ctx: Context<MiddlewareOpts, MiddlewareRes>,
) => HandlerHOF<MiddlewareOpts, MiddlewareRes>;

export type HandlerHOF<MiddlewareOpts = DefaultMiddlewareOpts, MiddlewareRes = any> = (
  next: Function,
  ctx: Context<MiddlewareOpts>,
  args?: any,
) => Promise<MiddlewareRes | void>;

export interface Context<MiddlewareOpts = DefaultMiddlewareOpts, MiddlewareRes = any> extends Events.EventEmitter {
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
  inquirer: Inquirer;
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
  project: { name?: string };
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  new (cli: CommandLineCli, options?: ContextOptions<MiddlewareOpts, MiddlewareRes>): Context;
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
  load(options: MiddlewareOpts): HandlerHOF<MiddlewareOpts, MiddlewareRes>;
  /**
   * exec
   */
  exec(
    middlewares: Handler<MiddlewareOpts, MiddlewareRes> | Array<Handler<MiddlewareOpts, MiddlewareRes>>,
    initailArgs?: Partial<MiddlewareOpts>,
  ): Promise<MiddlewareRes>;
  /**
   * run
   */
  run(): Promise<MiddlewareRes>;
}
