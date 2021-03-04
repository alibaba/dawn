import { IApi } from "@umijs/types";
import { DIR_NAME_IN_TMP } from "./constants";
import getRequestContent from "./utils/getRequestContent";

export default (api: IApi) => {
  api.onGenerateFiles(() => {
    api.writeTmpFile({
      path: `${DIR_NAME_IN_TMP}/request.ts`,
      content: getRequestContent(),
    });
  });

  api.addUmiExports(() => [
    { source: `../${DIR_NAME_IN_TMP}/request`, exportAll: true },
    { source: `../${DIR_NAME_IN_TMP}/request`, specifiers: [{ local: "instance", exported: "axios" }] },
  ]);
};
