/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited.
 * @license MIT found in the LICENSE file at https://github.com/alibaba/dawn/blob/master/LICENSE
 * @author DawnTeam
 */

import { AModules, IAddParams, IModules, IUpgradeParams, ModuleVersion, ModuleVersionOpts } from "./abstract";

export class NpmModules extends AModules implements IModules {
  private installFlagMap = {
    no: "no-save",
    dev: "save-dev",
    prod: "save",
    optional: "save-optional",
  };

  constructor(client?: string) {
    super({ client: client ?? "npm" });
    this.validate();
  }

  public add = async (params?: IAddParams) => {
    const debug = this.trace("add");
    debug("packages:", params?.packages);

    // eslint-disable-next-line no-nested-ternary
    const packages = !params?.packages ? [] : Array.isArray(params.packages) ? params.packages : [params.packages];

    if (params?.global && !packages.length) throw new Error("Add global package(s) cannot be empty");
    const flag: any = {
      force: params?.force ?? false,
      global: params?.global ?? false,
      "no-package-lock": !(params?.lock ?? true),
      "no-audit": !(params?.audit ?? true),
      [this.installFlagMap[params?.save ?? "prod"]]: !!packages.length,
      silent: params?.silent ?? false,
      "no-progress": params?.silent ?? false,
    };
    await this.exec(`install ${packages.join(" ")}`, { flag });
    debug("finish costs");
  };

  public upgrade = async (packages?: IUpgradeParams) => {
    const debug = this.trace("upgrade");
    debug("packages", packages);
    // eslint-disable-next-line no-nested-ternary
    const packagesStr = !packages ? "" : (Array.isArray(packages) ? packages : [packages]).join(" ");
    const cmd = `update ${packagesStr}`;
    debug("cmd", cmd);
    await this.exec(cmd);
    debug("finish costs");
  };

  public runScript = async (script: string, argv?: any) => {
    const debug = this.trace("runScript");
    const cmd = `${this.client} run ${script} -- ${this.stringify(argv ?? {})}`;
    debug("cmd", cmd);
    await this.shell.exec(cmd);
    debug("finish costs");
  };

  public version = async (version: ModuleVersion, opts?: ModuleVersionOpts) => {
    const debug = this.trace("version");
    debug("version", version, JSON.stringify(opts));
    const argv = version.startsWith("pre") ? ` --preid=${opts?.preid ?? "beta"}` : "";
    const cmd = `version ${version}${argv}`;
    debug("cmd", cmd);
    await this.exec(cmd);
    debug("finish costs");
  };

  public validate = async () => {
    const debug = this.trace("validate");
    const npmVersion = await this.shell.execWithResult(`${this.client} -v`);
    debug("npmVersion", npmVersion);
    if (!npmVersion) {
      throw new Error(`Your "npm" client cannot be used.`);
    }
  };
}
