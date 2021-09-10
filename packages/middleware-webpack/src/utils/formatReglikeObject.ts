import path from "path";
import globby from "globby";
import type { FileInfo } from "../types";

// ./src/foo.js => foo
const getFilenameByPath = (f: string) => path.basename(f).split(".")[0];

// format entry and template
export default function (params: Record<string, string> | string[] | string) {
  const paramsMap: Record<string, string> = {};
  if (typeof params === "string") {
    paramsMap[getFilenameByPath(params)] = params;
  } else if (Array.isArray(params)) {
    params.forEach(f => {
      paramsMap[getFilenameByPath(f)] = f;
    });
  } else {
    Object.assign(paramsMap, params);
  }
  const nameFileList: FileInfo[] = [];
  Object.entries(paramsMap).forEach(([nameExpr, fileExpr]) => {
    const files = globby.sync(fileExpr);
    files.forEach(file => {
      const paths = file.split("/").reverse()?.map(getFilenameByPath);
      const name = nameExpr.replace(/\((\d+)\)/g, (_, index) => {
        return paths[index];
      });
      nameFileList.push({ name, file });
    });
  });
  return nameFileList;
}
