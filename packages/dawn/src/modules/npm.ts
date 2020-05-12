/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited.
 * @license MIT found in the LICENSE file at https://github.com/alibaba/dawn/blob/master/LICENSE
 * @author DawnTeam
 */

import { AModules, IModules, IAddParams, IUpgradeParams, ModuleVersion, ModuleVersionOpts } from "./abstract";

export class NpmModules extends AModules implements IModules {
  public client = "npm";
  public registry = "https://registry.npmjs.org/";

  public add = async (params?: IAddParams) => {
    // TODO
  };
  public upgrade = async (params?: IUpgradeParams) => {
    // TODO
  };
  public runScript = async (script: string, argv?: any) => {
    // TODO
  };
  public version = async (version: ModuleVersion, opts?: ModuleVersionOpts) => {
    // TODO
  };
}
