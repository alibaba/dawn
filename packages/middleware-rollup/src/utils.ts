import { existsSync } from "fs";
import path from "path";
import resolve, { AsyncOpts } from "resolve";
import { isNil } from "lodash";
import type { AtImportOptions } from "postcss-import";
import type { PackageJson } from "@dawnjs/types";
import type { IBundleOptions } from "./types";

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
    const absFilePath = path.join(cwd, file);
    if (existsSync(absFilePath)) {
      return returnRelative ? file : absFilePath;
    }
  }
};

export const getFileName = (filePath: string): string => {
  if (!filePath) {
    return "";
  }
  return `${path.dirname(filePath)}/${path.basename(filePath, path.extname(filePath))}`;
};

const DEFAULT_OUTPUT_DIR: Record<string, string> = {
  esm: "esm",
  cjs: "lib",
  umd: "build",
  dts: "types",
};

// filename priority：specific module type file option > top level file option > pkg field value > basename of entry file
export const getOutputFile = (opts: {
  cwd: string;
  entry: string;
  type: "cjs" | "esm" | "umd" | "system" | "iife" | "dts";
  pkg: PackageJson;
  bundleOpts: IBundleOptions;
  minFile?: boolean;
  mjs?: boolean;
}): string => {
  const { cwd, entry, type, pkg, bundleOpts, minFile, mjs } = opts;
  const { outDir = DEFAULT_OUTPUT_DIR[type as string] || "build", esm, cjs, umd, system, iife } = bundleOpts;

  const isMultiEntry =
    (Array.isArray(bundleOpts.entry) && bundleOpts.entry.length > 1) ||
    (typeof bundleOpts.entry === "object" && Object.keys(bundleOpts.entry).length > 1);

  const name = path
    .relative(cwd, path.resolve(cwd, entry))
    .replace(/^src\//, "")
    .replace(path.extname(entry), "");

  let { file } = bundleOpts;
  if (isMultiEntry) {
    file = file || name;
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
      if (pkg.unpkg || pkg.browser) {
        if (minFile) {
          return `${getFileName(pkg.unpkg || pkg.browser)}.min.js`;
        }
        return pkg.unpkg || pkg.browser;
      }
      return `${outDir}/${name}.umd${minFile ? ".min" : ""}.js`;
    case "system":
      if (system && system.file) {
        return `${outDir}/${system.file}.js`;
      }
      if (file) {
        return `${outDir}/${file}.system.js`;
      }
      if (pkg.unpkg || pkg.browser) {
        return `${getFileName(pkg.unpkg || pkg.browser)}.system.js`;
      }
      return `${outDir}/${name}.system.js`;
    case "iife":
      if (iife && iife.file) {
        return `${outDir}/${iife.file}.js`;
      }
      if (file) {
        return `${outDir}/${file}.iife.js`;
      }
      if (pkg.unpkg || pkg.browser) {
        return `${getFileName(pkg.unpkg || pkg.browser)}.iife.js`;
      }
      return `${outDir}/${name}.iife.js`;
    case "dts":
      if (file) {
        return `${outDir}/${file}.d.ts`;
      }
      if (pkg.types || pkg.typings) {
        return pkg.types || pkg.typings;
      }
      return `${outDir}/${name}.d.ts`;
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

export const toArr = o => {
  if (isNil(o)) {
    return [];
  } else if (Array.isArray(o)) {
    return o;
  } else {
    return [o];
  }
};

function resolveModule(id: string, opts: AsyncOpts): Promise<string> {
  return new Promise((res, rej) => {
    resolve(id, opts, (err, p) => {
      if (err) {
        rej(err);
        return;
      }
      res(p);
    });
  });
}

export const resolveCss = (id: string, base: string, options: AtImportOptions) => {
  const paths = options.path;

  const resolveOpts: AsyncOpts = {
    basedir: base,
    moduleDirectory: ["web_modules", "node_modules"].concat(options.addModulesDirectories),
    paths,
    extensions: [".css"],
    packageFilter: pkg => {
      if (pkg.style) {
        pkg.main = pkg.style;
      } else if (!pkg.main || !/\.css$/.test(pkg.main)) {
        pkg.main = "index.css";
      }
      return pkg;
    },
    preserveSymlinks: false,
  };

  // 以 `~` 开头的路径，只从 moduleDirectory 中查找，用于兼容 webpack 的 css-loader 处理逻辑
  if (/^~/.test(id)) {
    return resolveModule(id.substring(1), resolveOpts).catch(() => {
      throw new Error(
        `Failed to find '${id.substring(1)}'
  in [
    ${toArr(paths).join(",\n        ")}
  ]`,
      );
    });
  } else {
    return resolveModule(`./${id}`, resolveOpts)
      .catch(() => resolveModule(id, resolveOpts))
      .catch(() => {
        const seekPath = toArr(paths);
        if (seekPath.indexOf(base) === -1) {
          seekPath.unshift(base);
        }

        throw new Error(
          `Failed to find '${id}'
  in [
    ${seekPath.join(",\n        ")}
  ]`,
        );
      });
  }
};
