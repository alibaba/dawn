/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited.
 * @license MIT found in the LICENSE file at https://github.com/alibaba/dawn/blob/master/LICENSE
 * @author DawnTeam
 */

import Command, { flags } from "../command";

export default class RunCommand extends Command {
  static description = "describe the command here";

  static examples = [
    `$ dn hello
hello world from ./src/hello.ts!
`,
  ];

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [{ name: "cmd", required: true, description: "cmd name" }];

  async run() {
    const options = this.parse(RunCommand);
    this.trace("options", options);
    const { cmd } = options.args;
    this.context.cmd = cmd;
    await this.ctx.run();
  }
}
