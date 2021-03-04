import { IApi } from "@umijs/types";
import { DIR_NAME_IN_TMP } from "./constants";
import getUseImmerContent from "./utils/getUseImmerContent";
import getCreateModelContent from "./utils/getCreateModelContent";

export default (api: IApi) => {
  api.onGenerateFiles(() => {
    api.writeTmpFile({
      path: `${DIR_NAME_IN_TMP}/useImmer.ts`,
      content: getUseImmerContent(),
    });
    api.writeTmpFile({
      path: `${DIR_NAME_IN_TMP}/createModel.ts`,
      content: getCreateModelContent(),
    });
  });

  api.addUmiExports(() => [{ source: `../${DIR_NAME_IN_TMP}/createModel`, exportAll: true }]);
};
