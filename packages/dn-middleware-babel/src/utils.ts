import { join } from "path";
import { readFileSync } from "fs";
import * as ts from "typescript";
import { IPkg } from "./types";

export const getPkgFile = ({ cwd }: { cwd: string }): IPkg => {
  let pkg = {} as IPkg;
  try {
    pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf-8"));
  } catch (e) {
    // do nothing
  }

  return pkg;
};

export const parseTSConfig = (path: string) => {
  const result = ts.readConfigFile(path, file => readFileSync(file, "utf-8"));
  if (result.error) {
    return;
  }
  return result.config;
};

export const getTSConfigCompilerOptions = (path: string) => {
  const config = parseTSConfig(path);
  return config ? config.compilerOptions : undefined;
};

export const isTransform = (path: string, regexp: RegExp): boolean => {
  return regexp.test(path) && !path.endsWith(".d.ts");
};
