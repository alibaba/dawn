import { readFileSync } from "fs";
import * as ts from "typescript";

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

export const hasJsxRuntime = () => {
  try {
    require.resolve("react/jsx-runtime");
    return true;
  } catch (e) {
    return false;
  }
};
