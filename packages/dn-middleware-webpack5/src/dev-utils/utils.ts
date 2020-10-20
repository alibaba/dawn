import * as fs from "fs";
import * as path from "path";
import globby from "globby";
import getPublicUrlOrPath from "react-dev-utils/getPublicUrlOrPath";

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


// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
export const getPublicPath = () => getPublicUrlOrPath(process.env.NODE_ENV === "development", process.env.PUBLIC_URL, "/");

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
  const nameFileList: Array<{ name: string; file: string }> = [];
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
