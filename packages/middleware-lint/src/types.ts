import * as Dawn from "@dawnjs/types";

export interface IOpts {
  /** @deprecated Please use features in webpack/rollup/vite middleware instead */
  realtime: boolean;
  /** Only prepare configuration */
  noEmit: boolean;
  /** Enable auto-fix for eslint, default is true */
  autoFix: boolean;
  /** Enable staged mode with lint-staged, usually run in precommit hook, default is false */
  staged: boolean;
  /** Enable prettier check for other format files except JS & TS in staged mode and use prettier write in auto-fix mode, default is false */
  prettier: boolean;
  /** Enable eslint cache mode, default is true */
  cache: boolean;
  /** @deprecated Please set in `.eslintrc.yml` file instead */
  env: Record<string, boolean>;
  /** @deprecated Please set in `.eslintrc.yml` file instead */
  global: Record<string, "writable" | "readonly" | "off" | "readable" | boolean>;
  /** @deprecated Please set in `.eslintignore` file instead */
  ignore: string[];
  /** @deprecated */
  source: string[];
  /** @deprecated */
  ext: string;
}

export type Handler = Dawn.Handler<Partial<IOpts>>;
export type Context = Dawn.Context<Partial<IOpts>>;

export interface IProjectInfo {
  isReact: boolean;
  isTypescript: boolean;
  extend: string | string[];
  ext: string;
}
