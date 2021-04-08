import { existsSync } from "fs";
import { basename, dirname, extname, join } from "path";
import { PackageJson } from "@dawnjs/types";
import { IBundleOptions } from "./types";

export const getExistFile = ({
  cwd,
  files,
  returnRelative,
}: {
  cwd: string;
  files: string[];
  returnRelative: boolean;
}) => {
  for (const file of files) {
    const absFilePath = join(cwd, file);
    if (existsSync(absFilePath)) {
      return returnRelative ? file : absFilePath;
    }
  }
};

export const isTypescriptFile = (filePath: string): boolean => {
  return filePath.endsWith(".ts") || filePath.endsWith(".tsx");
};

export const getFileName = (filePath: string): string => {
  if (!filePath) {
    return "";
  }
  return `${dirname(filePath)}/${basename(filePath, extname(filePath))}`;
};

const DEFAULT_OUTPUT_DIR: Record<string, string> = {
  esm: "esm",
  cjs: "lib",
  umd: "build",
};

// filename priority：specific module type file option > top level file option > pkg field value > basename of entry file
export const getOutputFile = (opts: {
  entry: string;
  type: "cjs" | "esm" | "umd" | "system" | "iife";
  pkg: PackageJson;
  bundleOpts: IBundleOptions;
  minFile?: boolean;
  mjs?: boolean;
}): string => {
  const { entry, type, pkg, bundleOpts, minFile, mjs } = opts;
  const { outDir = DEFAULT_OUTPUT_DIR[type as string] || "build", esm, cjs, umd, system, iife } = bundleOpts;
  let { file } = bundleOpts;

  let name = basename(entry, extname(entry));
  if (typeof file === "object") {
    name = file[entry] || name;
    file = undefined;
  }

  switch (type) {
    case "esm":
      if (esm && esm.file) {
        return `${outDir}/${esm.file}${mjs ? ".mjs" : ".js"}`;
      }
      if (file) {
        return `${outDir}/${file}${mjs ? ".mjs" : ".esm.js"}`;
      }
      if (pkg.module) {
        if (mjs) {
          return `${getFileName(pkg.module)}.mjs`;
        } else {
          return pkg.module;
        }
      }
      return `${outDir}/${name}${mjs ? ".mjs" : ".js"}`;
    case "cjs":
      if (cjs && cjs.file) {
        return `${outDir}/${cjs.file}.js`;
      }
      if (file) {
        return `${outDir}/${file}.js`;
      }
      if (pkg.main) {
        return pkg.main;
      }
      return `${outDir}/${name}.js`;
    case "umd":
      if (umd && umd.file) {
        return `${outDir}/${umd.file}${minFile ? ".min" : ""}.js`;
      }
      if (file) {
        return `${outDir}/${file}.umd${minFile ? ".min" : ""}.js`;
      }
      if (pkg.browser) {
        if (minFile) {
          return `${getFileName(pkg.browser)}.min.js`;
        }
        return pkg.browser;
      }
      return `${outDir}/${name}${minFile ? ".min" : ""}.js`;
    case "system":
      if (system && system.file) {
        return `${outDir}/${system.file}.js`;
      }
      if (file) {
        return `${outDir}/${file}.system.js`;
      }
      if (pkg.browser) {
        return `${getFileName(pkg.browser)}.system.js`;
      }
      return `${outDir}/${name}.system.js`;
    case "iife":
      if (iife && iife.file) {
        return `${outDir}/${iife.file}.js`;
      }
      if (file) {
        return `${outDir}/${file}.iife.js`;
      }
      if (pkg.browser) {
        return `${getFileName(pkg.browser)}.iife.js`;
      }
      return `${outDir}/${name}.iife.js`;
    default:
      throw new Error(`Unsupported type ${type}`);
  }
};

const getPkgNameByid = (id: string): string => {
  const splitted = id.split("/");
  // @，@tmp 和 @local 是为了兼容项目本地路径的别名
  if (id.charAt(0) === "@" && splitted[0] !== "@" && splitted[0] !== "@tmp" && splitted[0] !== "@local") {
    return splitted.slice(0, 2).join("/");
  } else {
    return splitted[0];
  }
};

export const testExternal = (pkgs: Set<string>, excludes: string[], id: string): boolean => {
  if (excludes.includes(id)) {
    return false;
  }
  return pkgs.has(getPkgNameByid(id));
};

export const testGlobalExternal = (pkgs: Set<string>, excludes: string[], id: string): boolean => {
  if (excludes.includes(id)) {
    return false;
  }
  return pkgs.has(id);
};

export const hasJsxRuntime = () => {
  try {
    require.resolve("react/jsx-runtime");
    return true;
  } catch (e) {
    return false;
  }
};
