/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited.
 * @license MIT found in the LICENSE file at https://github.com/alibaba/dawn/blob/master/LICENSE
 * @author DawnTeam
 */

import * as dnDebug from "debug";
import shell from "../executes";
import consola from "../common/console";
import * as utils from "../common/utils";

const debugFn = (namespace?: string) => dnDebug(`dn:module:${namespace ?? "anonymous"}`);

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
   * @default true
   */
  audit?: boolean;
  /**
   * Add package(s) with fewer logs.
   * @default false
   */
  silent?: boolean;
}

/**
 * Upgrade local package(s).
 */
export type IUpgradeParams = string | string[] | undefined;

export type ModuleVersion = string | "major" | "minor" | "patch" | "premajor" | "preminor" | "prepatch" | "prerelease";
export interface ModuleVersionOpts {
  preid?: "alpha" | "beta" | string;
}

export interface IModules extends IModuleOptions {
  // new (options?: IModuleOptions): IModules;
  /** Deprecated: Use `add` instead. */
  install(name?: string | string[], options?: any): Promise<void>;
  /**
   * Execute npm/yarn/... command.
   * For developers with dawn middleware, we do not recommend that you use
   * the exec method to execute commands. Unless you can ensure that the command
   * will work well under multiple clients.
   *
   * @deprecated We no longer support `exec`
   */
  exec(cmd: string, opts?: any): Promise<void>;
  /**
   * Deprecated: We no longer support `download`
   *
   * Execute npm/yarn/... command.
   * For developers with dawn middleware, we do not recommend that you use
   * the exec method to execute commands. Unless you can ensure that the command
   * will work well under multiple clients.
   * @deprecated We no longer support `download`
   */
  download(name: string, prefix?: any): Promise<void>;
}

export abstract class AModules implements IModules {
  public client = "npm"; // npm by default
  public registry = "https://registry.npmjs.org/";

  protected trace = debugFn;
  protected shell = shell;
  protected utils = utils;
  protected console = consola;

  constructor(options?: IModuleOptions) {
    Object.assign(this, options);
    const debug = this.trace("constructor");
    debug("client", this.client);
    debug("registry", this.registry);
  }
  public stringify = (argvObj?: Record<string, string | number | boolean>): string[] => {
    if (!argvObj) return [];
    return Object.entries(argvObj)
      .map(([name, value]) => {
        if (value === false) return "";
        const flagName = (name.length > 1 ? "--" : "-") + name;
        const flagValue = typeof value !== "boolean" ? `=${value}` : "";
        return `${flagName}${flagValue}`;
      })
      .filter(flag => !!flag);
  };
  install = async () => {
    this.notImplemented("Install");
  };

  async exec(cmd: string, opts?: any) {
    const debug = this.trace("exec");
    const options = {
      cwd: process.cwd(),
      ...opts,
      flag: {
        registry: this.registry,
        ...opts?.flag,
      },
    };
    debug("options:", JSON.stringify(options));
    const flags = this.stringify(options?.flag);
    debug("flags:", flags.join());
    const script = `${this.client} ${cmd || ""} ${flags.join(" ")}`;
    debug("script:", script);
    await this.shell.exec(script, options);
    debug("finish costs");
  }
  download = async () => {
    this.notImplemented("Download");
  };
  /**
   * Validate client is ok for binName, version, etc.
   */
  validate = async () => {
    this.notImplemented("Validate");
  };

  private notImplemented(funcName?: string) {
    throw new Error(
      funcName ? `${funcName} is not implemented or no longger support.` : "Not implemented or no longger support..",
    );
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
