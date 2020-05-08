import * as npm from "@npm/types";

export interface PackageJson extends npm.PackageJson {
  [prop: string]: any;
  name: string;
  version: string;
  description?: string;
  main?: string;
  module?: string;
  browser?: string;
  "jsnext:main"?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}
