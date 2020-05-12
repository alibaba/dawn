/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited.
 * @license MIT found in the LICENSE file at https://github.com/alibaba/dawn/blob/master/LICENSE
 * @author DawnTeam
 */

import * as configs from "../common/config";

export interface IModuleOptions {
  /** Npm client name, such as: npm/cnpm/yarn etc. */
  client: string;
  /** Npm registry */
  registry?: string;
}

export interface IAddParams {
  packages?: string | string[];
  /**
   * Will force to fetch remote resources even if a local copy exists on disk.
   * @default false
   */
  force?: boolean;
  /**
   * Install the package globally rather than locally.
   * @default false
   */
  global?: boolean;
  /**
   * Control where and how they get saved with some additional flags.
   * @default prod
   * @todo support `exact` and `bundle` flag
   */
  save?: "no" | "dev" | "prod" | "optional";
  /**
   * Should generate `package-lock.json` or `yarn.lock` files
   * @default true
   */
  lock?: boolean;
  /**
   * Checks for known security issues with the installed packages.
   * @default false
   */
  audit?: boolean;
}

export interface IUpgradeParams {
  packages?: string | string[];
  /**
   * This command removes “extraneous” packages. If a package name is provided, then only packages matching one of the supplied names are removed.
   * @description npm prune/yarn autoclean
   * @default false
   */
  prune?: boolean;
  /**
   * Force upgrade will rm `node_modules` folder and `*lock*` file
   * @default false
   */
  force?: boolean;
}

export type ModuleVersion = string | "major" | "minor" | "patch" | "premajor" | "preminor" | "prepatch" | "prerelease";
export interface ModuleVersionOpts {
  preid?: "alpha" | "beta" | string;
}

export interface IModules extends IModuleOptions {
  // new (options?: IModuleOptions): IModules;
  /** Deprecated: Use `add` instead. */
  install(name?: string | string[], options?: any): Promise<void>;
  /** Deprecated: We no longer support `exec` */
  exec(cmd: string, opts?: any): Promise<void>;
  /** Deprecated: We no longer support `download` */
  download(name: string, prefix?: any): Promise<void>;
}

export abstract class AModules implements IModules {
  public client = "npm"; // npm by default
  public registry = "https://registry.npmjs.org/";

  constructor(options?: IModuleOptions) {
    Object.assign(this, options);
  }
  async install() {
    this.notImplemented("Install");
  }
  async exec(cmd: string, opts?: any) {
    const options = {
      cwd: process.cwd(),
      ...opts,
      flag: {
        registry: this.registry,
        ...opts?.flag,
      },
    };
    const flags = Object.entries(options?.flag).map(([name, value]) => {
      const flagName = (name.length > 1 ? "--" : "-") + name;
      const flagValue = typeof value === "string" ? `=${value}` : "";
      return `${flagName}${flagValue}`;
    });
    const npmBin = (await configs.getRc("npm")) || this.client;
    const script = `${npmBin} ${cmd || ""} ${flags.join(" ")}`;
    // debug("exec script", script);
    // TODO:
    // await exec(script, { cwd: opts.cwd });
  }
  async download() {
    this.notImplemented("Download");
  }

  private notImplemented(funcName?: string) {
    throw new Error(funcName ? `${funcName} not implemented.` : "Not implemented.");
  }

  /**
   * Add package(s) with flags
   */
  abstract add(params?: IAddParams): Promise<void>;
  /**
   * Upgrade package(s) with flags
   */
  abstract upgrade(params?: IUpgradeParams): Promise<void>;
  /**
   * Run npm scripts in `package.json`
   */
  abstract runScript(script: string, argv?: any): Promise<void>;
  /**
   * Bump a package version
   */
  abstract version(version: ModuleVersion, opts?: ModuleVersionOpts): Promise<void>;
}
