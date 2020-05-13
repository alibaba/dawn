import * as execa from "execa";
import { AExecute, IExecOptions } from "./abstract";

export type ExecaOption = execa.CommonOptions<"utf8">;
export interface IExecaOptions extends IExecOptions, ExecaOption {}

export class ExecaExecute extends AExecute {
  public exec = async (script?: string, opts?: IExecaOptions) => {
    this.trace("exec")("script", script);
    if (!script) return;
    const options = this.getOptions(opts);
    this.trace("exec")("options", options);
    const execaChildProcess = execa.command(script, { ...options, stdio: "inherit" });
    if (opts?.onStart) opts.onStart.call(null, execaChildProcess);
    try {
      const cpResult = await execaChildProcess;
      if (opts?.onExit) opts.onExit.call(null, cpResult.exitCode, execaChildProcess);
    } catch (error) {
      const errMessage = error.shortMessage || error.message;
      this.trace("exec")("error", errMessage);
      throw new Error(errMessage);
    }
  };

  public execWithResult = async (script: string, opts?: IExecaOptions) => {
    this.trace("execWithResult")("script", script);
    if (!script) return "";
    const options = this.getOptions(opts);
    this.trace("execWithResult")("options", options);
    const execaChildProcess = execa.command(script, { ...options });
    try {
      const cpResult = await execaChildProcess;
      this.trace("execWithResult")("stdout", cpResult.stdout);
      this.trace("execWithResult")("stderr", cpResult.stderr);
      return cpResult.stdout;
    } catch (error) {
      const errMessage = error.shortMessage || error.message;
      this.trace("exec")("error", errMessage);
      throw new Error(errMessage);
    }
  };

  private getOptions = (opts?: IExecaOptions): ExecaOption => {
    this.trace("getOptions")("opts", opts);
    const cwd = opts?.cwd ?? process.cwd();
    return {
      // use `./node_modules/.bin/`
      preferLocal: true,
      shell: true,
      ...opts,
      cwd,
    };
  };
}
