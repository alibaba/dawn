import { Handler } from "@dawnjs/types";
import { Service } from "./Service";
import { IFrameworkOptions } from "./IFrameworkOptions";

const builtinPlugins: string[] = [
  // TODO: pick useful runtime-plugins
  require.resolve("@umijs/plugin-access"),
  require.resolve("@umijs/plugin-helmet"),
  // require.resolve("@umijs/plugin-request"),
];

const handler: Handler<IFrameworkOptions> = opts => {
  return async (next, ctx) => {
    const { plugins } = opts;
    // UmiJS Service Instance
    const service = new Service({
      ...opts,
      cwd: ctx.cwd,
      pkg: ctx.project,
      plugins: [...builtinPlugins, ...(plugins ?? [])],
    });

    process.env.WATCH = "none";
    process.env.UMI_VERSION = "3.0.0";
    process.env.UMI_DIR = "src/.runtime";

    // Initialize umijs service
    await service.init();

    // Generate runtime files
    await service.runCommand({ name: "initialize" });

    ctx.on("webpack.config", webpackConfig => {
      // TODO: merge part of umijs webpack config to dawn
      webpackConfig.resolve.alias.umi = process.env.UMI_DIR;
      // webpackConfig.entry = {
      //   index: "./src/.runtime/index.ts", // force rewrite entry
      // };
    });

    // execute next pipeline
    await next();
  };
};

export default handler;
