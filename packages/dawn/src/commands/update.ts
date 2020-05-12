/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited.
 * @license MIT found in the LICENSE file at https://github.com/alibaba/dawn/blob/master/LICENSE
 * @author DawnTeam
 */

import Command, { flags } from "../command";

export default class Update extends Command {
  static description = "describe the command here";
  static aliases = ["u"];

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
  };

  async run() {
    this.trace("where am i");
  }
}
