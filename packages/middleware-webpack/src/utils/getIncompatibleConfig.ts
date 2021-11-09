/* eslint-disable @typescript-eslint/no-require-imports */

interface IIncompatiblePkgsMap {
  [key: string]: {
    [version: string]: {
      version: string;
      reason: string;
    };
  };
}

export default function getIncompatibleConfig() {
  const pkgsMap: IIncompatiblePkgsMap = require("es5-imcompatible-versions");
  const pkgsRegList = Object.keys(pkgsMap).map(pkgs => new RegExp(pkgs));
  return pkgsRegList;
}
