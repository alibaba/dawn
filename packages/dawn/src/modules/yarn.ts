/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited.
 * @license MIT found in the LICENSE file at https://github.com/alibaba/dawn/blob/master/LICENSE
 * @author DawnTeam
 */

import { AModules, IAddParams, IModules, IUpgradeParams, ModuleVersion, ModuleVersionOpts } from "./abstract";

export class YarnModules extends AModules implements IModules {
  private installFlagMap = {
    no: "no-save",
    dev: "dev",
    prod: "production",
    optional: "optional",
  };

  private versionFlagMap: any = {
    major: "--major",
    minor: "--minor",
    patch: "--patch",
    premajor: "--premajor",
    preminor: "--preminor",
    prepatch: "--prepatch",
    prerelease: "--prerelease",
  };

  constructor(client?: string) {
    super({ client: client ?? "yarn" });
    this.validate();
  }

  public add = async (params?: IAddParams) => {
    const debug = this.trace("add");
    debug("packages:", params?.packages);

    // eslint-disable-next-line no-nested-ternary
    const packages = !params?.packages ? [] : Array.isArray(params.packages) ? params.packages : [params.packages];

    if (params?.global && !packages.length) throw new Error("Add global package(s) cannot be empty");
    if (params?.save === "no") this.console.warn("Add package(s) but no-save is not supported with yarn client.");

    let cmdBase = params?.global ? "global add" : "add";
    if (!packages.length) cmdBase = "install";

    const flag: any = {
      force: params?.force ?? false,
      "no-lockfile": !(params?.lock ?? true),
      audit: params?.audit ?? true,
      [this.installFlagMap[params?.save ?? "prod"]]: !!packages.length,
      silent: params?.silent ?? false,
      "no-progress": params?.silent ?? false,
    };
    await this.exec(`${cmdBase} ${packages.join(" ")}`, { flag });
    debug("finish costs");
  };

  public upgrade = async (packages?: IUpgradeParams) => {
    const debug = this.trace("upgrade");
    debug("packages", packages);
    // eslint-disable-next-line no-nested-ternary
    const packagesStr = !packages ? "" : (Array.isArray(packages) ? packages : [packages]).join(" ");
    const cmd = `upgrade ${packagesStr}`;
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
    const versionArgv = this.versionFlagMap[version] ?? `--new-version ${version}`;
    const cmd = `version ${versionArgv}${argv}`;
    debug("cmd", cmd);
    await this.exec(cmd);
    debug("finish costs");
  };

  public validate = async () => {
    const debug = this.trace("validate");
    const yarnVersion = await this.shell.execWithResult(`${this.client} -v`);
    debug("yarnVersion", yarnVersion);
    if (!yarnVersion) {
      throw new Error(`You donot have "${this.client}" command in your PATH.`);
    }
  };
}
