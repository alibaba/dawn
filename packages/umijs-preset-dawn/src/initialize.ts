import { IApi } from "@umijs/types";
import generateFiles from "@umijs/preset-built-in/lib/plugins/commands/generateFiles";
import {
  cleanTmpPathExceptCache,
  // getBundleAndConfigs,
} from "@umijs/preset-built-in/lib/plugins/commands/buildDevUtils";

export default async function generate(api: IApi) {
  api.registerCommand({
    name: "initialize",
    description: "initialize runtime files",
    fn: async () => {
      cleanTmpPathExceptCache({ absTmpPath: api.paths.absTmpPath });
      const watch = process.env.WATCH !== "none";

      // generate files
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const unwatchGenerateFiles = await generateFiles({ api, watch });
    },
  });
}
