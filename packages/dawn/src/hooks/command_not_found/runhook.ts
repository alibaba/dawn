/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited.
 * @license MIT found in the LICENSE file at https://github.com/alibaba/dawn/blob/master/LICENSE
 * @author DawnTeam
 */

import { Hook } from "@oclif/config";
import consola from "../../common/console";

const hook: Hook<"command_not_found"> = async function (opts) {
  consola.fatal(`Command "${opts.id}" not found.`);

  await this.config.runCommand("help");
  process.exit(1);
};

export default hook;
