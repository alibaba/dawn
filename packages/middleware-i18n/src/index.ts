import path from "path";
import fs from "fs";
import VModulePlugin from "vmodule-webpack-plugin";
import type { Handler } from "@dawnjs/types";
import type { IOpts } from "./types";

const handler: Handler<IOpts> = opts => {
  opts = {
    key: "__locale",
    dir: "./locales",
    extract: null,
    ...opts,
  };

  return async (next, ctx) => {
    const localesPath = path.normalize(`${path.resolve(ctx.cwd, opts.dir)}/`);

    const extractBuild = async () => {
      const extractPath = path.resolve(ctx.cwd, opts.extract);
      await ctx.utils.mkdirp(extractPath);
      const locales = ctx.utils.confman.load(localesPath);
      // @ts-ignore
      ctx.utils.each(locales, (name, locale) => {
        locale.__name__ = name;
        const localeFile = path.normalize(`${extractPath}/${name}.js`);
        const localeCode = `window['${opts.key}']=${JSON.stringify(locale)};`;
        fs.writeFileSync(localeFile, localeCode);
      });
    };

    const addLocales = conf => {
      conf.plugins.push(
        new VModulePlugin({
          name: "$locales",
          content: ctx.utils.confman.load(localesPath),
        }),
      );
    };

    const addI18N = conf => {
      conf.plugins.push(
        new VModulePlugin({
          name: "$i18n",
          file: path.resolve(__dirname, "../i18n.ts"),
        }),
      );
    };

    const addOpts = conf => {
      const { key } = opts;
      const jsx = opts.jsx || opts.react;
      conf.plugins.push(
        new VModulePlugin({
          name: "$i18n_opts",
          content: { key, jsx },
        }),
      );
    };

    const applyToWebpack = () => {
      ctx.on("webpack.config", conf => {
        addOpts(conf);
        addLocales(conf);
        addI18N(conf);
      });
    };

    const copyDefaultFiles = async () => {
      if (fs.existsSync(localesPath)) {
        return;
      }
      const templateFiles = path.resolve(__dirname, "../template/**/*.*");
      await ctx.exec({
        name: "@dawnjs/dn-middleware-copy",
        files: {
          [localesPath]: templateFiles,
        },
      });
    };

    ctx.console.info("Enable i18n...");
    await copyDefaultFiles();
    if (opts.extract) {
      await extractBuild();
    }
    await applyToWebpack();
    ctx.console.info("Done");

    next();
  };
};

export default handler;
