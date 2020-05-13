import * as dnDebug from "debug";
import { ChildProcess } from "child_process";

import consola from "../common/console";

const debug = (namespace?: string) => dnDebug(`dn:execute:${namespace ?? "anonymous"}`);

export interface IExecute {}

export interface IExecOptions {
  onStart?: (cp: ChildProcess) => Promise<void>;
  onExit?: (exitCode: number, cp: ChildProcess) => Promise<void>;
}

export abstract class AExecute implements IExecute {
  /** Platform. Possible values: https://nodejs.org/api/process.html#process_process_platform */
  public os = process.platform;
  /** Is current on windows */
  public isWin = this.os === "win32";
  public console = consola;
  public withResult = this.execWithResult;
  protected trace = debug;

  /** Exec a command script */
  abstract exec(script: string, options?: IExecOptions): void;
  /** Exec a command script with result */
  abstract execWithResult(script: string, options?: IExecOptions): Promise<string>;
}
