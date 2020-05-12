/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited.
 * @license MIT found in the LICENSE file at https://github.com/alibaba/dawn/blob/master/LICENSE
 * @author DawnTeam
 */

import Command, { flags } from "../command";
// import RunCommand from "./run";

export default class Init extends Command {
  static description = "Initialize a dawn project";
  static aliases = ["i"];

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    template: flags.string({ char: "t", description: "Specify the template name for the init command" }),
  };

  async run() {
    const options = this.parse(Init);
    this.trace("options", options);
    // const { template } = options.flags;

    const res = await this.ctx.utils.execWithResult("npm -v");
    this.console.log("npm version", res);
    // await RunCommand.run(["init"]);
  }
}
