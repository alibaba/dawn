/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited.
 * @license MIT found in the LICENSE file at https://github.com/alibaba/dawn/blob/master/LICENSE
 * @author DawnTeam
 */

import { Command } from "@oclif/command";
import * as debug from "debug";
import consola from "./common/console";
import Context from "./context";

export * from "@oclif/command";

export default abstract class extends Command {
  protected context = new Context(this);
  protected ctx = this.context;

  // this.console.log("some log");
  // this.console.info("some info");
  protected console = consola;

  async init() {
    // do some initialization
    // const { flags } = this.parse(this.constructor);
    // this.flags = flags;
    this.trace(`dn command init: ${this.id}`);
  }

  // this.trace("some debug info");
  protected trace(formatter: any, ...args: any[]) {
    const namespace = (this.constructor as any)?.id ?? "anonymous";
    debug(`dn:command:${namespace}`)(formatter, ...args);
  }
  // async catch(err: Error) {
  //   // handle any error from the command
  //   console.info("error", err);
  // }
  // async finally() {
  //   console.info("finally");
  //   // called after run and catch regardless of whether or not the command errored
  // }
}
