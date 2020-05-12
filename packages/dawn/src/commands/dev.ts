/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited.
 * @license MIT found in the LICENSE file at https://github.com/alibaba/dawn/blob/master/LICENSE
 * @author DawnTeam
 */

import Command, { flags } from "../command";
import RunCommand from "./run";

export default class Dev extends Command {
  static description = "Initialize a dawn project";
  static aliases = ["d"];

  static flags = {
    help: flags.help({ char: "h" }),
  };

  async run() {
    const options = this.parse(Dev);
    this.trace("options", options);
    await RunCommand.run(["dev"]);
  }
}
