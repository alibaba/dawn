/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited.
 * @license MIT found in the LICENSE file at https://github.com/alibaba/dawn/blob/master/LICENSE
 * @author DawnTeam
 */

import { NpmModules } from "./npm";
import { IModuleOptions, IModules } from "./abstract";

export class XNpmModules extends NpmModules implements IModules {
  constructor(options: Required<Pick<IModuleOptions, "client">>) {
    super(options.client);
  }
}
