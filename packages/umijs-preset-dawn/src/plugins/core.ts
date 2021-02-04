import { readFileSync } from "fs";
import { dirname, join } from "path";
import { IApi } from "@umijs/types";
import { winPath } from "@umijs/utils";
import { importsToStr } from "@umijs/preset-built-in/lib/plugins/generateFiles/umi";
import { renderReactPath, runtimePath } from "@umijs/preset-built-in/lib/plugins/generateFiles/constants";

export default function core(api: IApi) {
  const {
    utils: { Mustache },
  } = api;

  api.addDepInfo(() => {
    return [
      {
        name: "@umijs/runtime",
        range: "3",
        alias: [runtimePath],
      },
      {
        name: "@umijs/renderer-react",
        range: "3",
        alias: [renderReactPath],
      },
    ];
  });

  api.onGenerateFiles(async () => {
    const umiTpl = readFileSync(
      join(dirname(require.resolve("@umijs/preset-built-in/lib/plugins/generateFiles/umi")), "umi.tpl"),
      "utf-8",
    );
    const umiRuntime = require.resolve("@umijs/runtime");
    const rendererPath = await api.applyPlugins({
      key: "modifyRendererPath",
      type: api.ApplyPluginsType.modify,
      initialValue: renderReactPath,
    });
    api.writeTmpFile({
      path: "index.ts",
      content: Mustache.render(umiTpl, {
        // @ts-ignore
        enableTitle: api.config.title !== false,
        defaultTitle: api.config.title || "",
        rendererPath: winPath(rendererPath),
        runtimePath,
        rootElement: api.config.mountElementId,
        enableSSR: !!api.config.ssr,
        dynamicImport: !!api.config.dynamicImport,
        entryCode: (
          await api.applyPlugins({
            key: "addEntryCode",
            type: api.ApplyPluginsType.add,
            initialValue: [`export * from "${umiRuntime}";`, 'export * from "./core/umiExports";'],
          })
        ).join("\r\n"),
        entryCodeAhead: (
          await api.applyPlugins({
            key: "addEntryCodeAhead",
            type: api.ApplyPluginsType.add,
            initialValue: [],
          })
        ).join("\r\n"),
        polyfillImports: importsToStr(
          await api.applyPlugins({
            key: "addPolyfillImports",
            type: api.ApplyPluginsType.add,
            initialValue: [],
          }),
        ).join("\r\n"),
        importsAhead: importsToStr(
          await api.applyPlugins({
            key: "addEntryImportsAhead",
            type: api.ApplyPluginsType.add,
            initialValue: [],
          }),
        ).join("\r\n"),
        imports: importsToStr(
          await api.applyPlugins({
            key: "addEntryImports",
            type: api.ApplyPluginsType.add,
            initialValue: [],
          }),
        ).join("\r\n"),
      }),
    });
  });
}
