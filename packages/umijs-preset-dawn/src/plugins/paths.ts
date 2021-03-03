import * as path from "path";
import { IApi } from "@umijs/types";

// static and donot modify
const runtimeDir = ".runtime";

export default function pathsPlugin(api: IApi) {
  api.modifyPaths(paths => ({
    ...paths,
    absTmpPath: path.join(path.dirname(paths.absTmpPath), runtimeDir),
  }));
  api.modifyConfig(memo => {
    memo.mountElementId = "root";
    return memo;
  });
}
