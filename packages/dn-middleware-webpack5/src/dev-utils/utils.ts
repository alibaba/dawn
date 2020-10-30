import * as fs from "fs";
import * as path from "path";
import * as Dawn from "@dawnjs/types";
import globby from "globby";
import getPublicUrlOrPath from "react-dev-utils/getPublicUrlOrPath";
import { FileInfo } from "../types";
import type { Stats } from "webpack/types";

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
    if (fs.existsSync(absFilePath)) {
      return returnRelative ? file : absFilePath;
    }
  }
};


// We use `PUBLIC_URL` enviroinfernment variable or "homepage" field to
// "public path" at which the app is served.
// webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
export const getPublicPath = (ctx: Dawn.Context) => (ctx.publicPath || ctx.publicPath === "") ? ctx.publicPath : getPublicUrlOrPath(process.env.NODE_ENV === "development", process.env.PUBLIC_URL, "");

// ./src/foo.js => foo
const getFilenameByPath = (f: string) => path.basename(f).split(".")[0];

// format entry and template
export const formatReglikeObject = (params: Record<string, string>) => {
  const paramsMap: Record<string, string> = {};
  if (typeof params === "string") {
    paramsMap[getFilenameByPath(params)] = params;
  } else if (Array.isArray(params)) {
    params.forEach((e: any) => {
      paramsMap[getFilenameByPath(e)] = e;
    });
  } else {
    Object.assign(paramsMap, params);
  }
  const nameFileList: Array<FileInfo> = [];
  Object.entries(paramsMap).forEach(([nameExpr, fileExpr]) => {
    const files = globby.sync(fileExpr);
    files.forEach(file => {
      const paths = file.split("/").reverse().map(getFilenameByPath);
      const name = nameExpr.replace(/\((\d+)\)/g, (_, index) => {
        return paths[index];
      });
      nameFileList.push({ name, file });
    });
  });
  return nameFileList;
};

export function formatNullStringToList<T = string>(params?: T | T[] | null): T[] {
  if (!params) return [];
  else if (Array.isArray(params)) {
    return params;
  }
  return [params];
}

export function formatWebpackMessages({
  warnings,
  errors
}: {
  warnings?: any[],
  errors?: any[]
}) {
  return {
    errors: Array.isArray(errors) ? errors?.map(e => e.message) : [],
    warnings: Array.isArray(warnings) ? warnings?.map(e => e.message) : [],
  }
}

/**
 * @param {number} size the size in bytes
 * @returns {string} the formatted size
 */
export function formatSize(size: number) {
	if (typeof size !== "number" || Number.isNaN(size) === true) {
		return "unknown size";
	}

	if (size <= 0) {
		return "0 bytes";
	}

	const abbreviations = ["bytes", "KiB", "MiB", "GiB"];
	const index = Math.floor(Math.log(size) / Math.log(1024));

	return `${+(size / Math.pow(1024, index)).toPrecision(3)} ${
		abbreviations[index]
	}`;
};

export function makeRow(a: string, b: string): string {
  return ` ${a}\t       ${b}`;
}

export function printError(stats: Stats, ctx: Dawn.Context) {
  // const info = stats.toJson();

  // // Compilation errors (missing modules, syntax errors, etc)
  // if (stats.hasErrors()) {

  //   ctx.console.error("error");
  //   ctx.console.error(info.errors);
  // }

  // // Compilation warnings
  // if (stats.hasWarnings()) {
  //   ctx.console.error("warning");
  //   ctx.console.warn(info.warnings);
  // }
}
