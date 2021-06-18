import fs from "fs";
import path from "path";
import type { Handler } from "@dawnjs/types";
import type { IOpts } from "./types";

const handler: Handler<IOpts> = opts => {
  const envOpts = JSON.parse(decodeURIComponent(process.env.DN_ARGV || "{}"));
  const pkgEnv = envOpts.pkginfo || {};

  // 是否为静默模式
  const silenceMode = !!pkgEnv.silence;

  return async (next, ctx) => {
    if (!ctx.inquirer) {
      throw new Error("Please upgrade dawn.");
    }
    const prefix = (opts && opts.prefix) || "";
    const defaultPkgName = prefix + path.basename(ctx.cwd);

    opts.items = opts.items || [
      {
        name: "name",
        type: "input",
        message: "Please enter the project name",
        default: defaultPkgName,
        validate(name) {
          const reg = new RegExp(`^${prefix}`);
          return reg.test(name);
        },
      },
      {
        name: "version",
        type: "input",
        message: "Please enter initial version",
        default: "1.0.0",
        validate(version) {
          return !!version;
        },
      },
      {
        name: "description",
        type: "input",
        message: "Please enter the project description",
      },
    ];

    const pkgFile = `${ctx.cwd}/package.json`;
    if (fs.existsSync(pkgFile)) {
      ctx.console.info("Setting pkginfo...");
      const pkg = require(pkgFile);
      let result = {};
      if (!silenceMode) {
        result = await ctx.inquirer.prompt(opts.items);
      } else {
        ctx.console.info("Silence mode...", JSON.stringify(pkgEnv));
        opts.items.forEach(({ name, default: defaultValue }) => {
          result[name] = pkgEnv[name] || defaultValue || "";
        });
      }
      Object.assign(pkg, result);
      await ctx.utils.writeFile(pkgFile, JSON.stringify(pkg, null, "  "));
      ctx.console.info("Done");
    }
    next();
  };
};

export default handler;
