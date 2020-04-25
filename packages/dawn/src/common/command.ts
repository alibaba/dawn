import { Command } from "@oclif/command";
import * as debug from "debug";
import consola from "../common/console";

export * from "@oclif/command";

export default abstract class extends Command {
  // this.console.log("some log");
  // this.console.info("some info");
  console = consola;

  // this.trace("some debug info");
  trace(formatter: any, ...args: any[]) {
    const namespace = (this.constructor as any)?.id ?? "anonymous";
    debug(`dn:command:${namespace}`)(formatter, ...args);
  }

  // async init() {
  //   // do some initialization
  //   // const { flags } = this.parse(this.constructor);
  //   // this.flags = flags;
  // }
  // async catch(err: Error) {
  //   // handle any error from the command
  //   console.info("error", err);
  // }
  // async finally() {
  //   console.info("finally");
  //   // called after run and catch regardless of whether or not the command errored
  // }
}
