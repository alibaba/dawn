import path from "path";
import fs from "fs";
import tp from "tpjs";
import type { Handler } from "@dawnjs/types";
import type { IOpts } from "./types";

const handler: Handler<IOpts> = opts => {
  opts = {
    from: "./",
    to: "./",
    files: {},
    log: true,
    dot: true,
    ...opts,
  };

  return async (next, ctx) => {
    if (opts.log) {
      ctx.console.info("Copy files...");
    }

    const from = path.resolve(ctx.cwd, path.normalize(opts.from));
    const to = path.resolve(ctx.cwd, path.normalize(opts.to));

    const parseDstFile = (srcFile, dstExpr, srcExpr) => {
      const pathSpliter = path.normalize("/");
      if (dstExpr.endsWith(pathSpliter) || dstExpr.endsWith("/")) {
        const srcDir = srcExpr.slice(0, srcExpr.indexOf("*"));
        const trimedSrcFile = srcFile.replace(path.resolve(from, srcDir), "");
        const dstFile = path.normalize(`${dstExpr}${trimedSrcFile}`);
        return path.resolve(to, dstFile);
      } else {
        const srcPaths = srcFile.split(pathSpliter).reverse();
        const filename = srcPaths[0];
        srcPaths[0] = path.basename(filename, path.extname(filename));
        let dstFile = dstExpr.replace(/\((\d+)\)/g, (str, index) => {
          return srcPaths[index];
        });
        const extname = path.extname(srcFile).slice(1);
        dstFile = dstFile.replace(/\(ext\)/gi, extname);
        return path.normalize(path.resolve(to, dstFile));
      }
    };

    const filterContent = async buffer => {
      if (!buffer) {
        return buffer;
      }
      if (ctx.utils.isFunction(opts.filter)) {
        return opts.filter.call(ctx, buffer, ctx);
      } else if (ctx.utils.isString(opts.filter)) {
        const filterFile = path.resolve(ctx.cwd, opts.filter);
        return require(filterFile).call(ctx, buffer, ctx);
      } else if (opts.filter) {
        const text = buffer.toString();
        return tp.parse(text, ctx);
      } else {
        return buffer;
      }
    };

    const copyFile = async (srcFile, dstExpr, srcExpr) => {
      srcFile = path.normalize(srcFile);
      const dstFile = parseDstFile(srcFile, dstExpr, srcExpr);
      if (fs.existsSync(dstFile) && opts.override === false) {
        return;
      }
      const dstDir = path.dirname(dstFile);
      await ctx.utils.mkdirp(dstDir);
      const srcBuffer = await ctx.utils.readFile(srcFile);
      const dstBuffer = await filterContent(srcBuffer);
      await ctx.utils.writeFile(dstFile, dstBuffer);
      const trimPath = path.normalize(`${ctx.cwd}/`);
      if (opts.log) {
        ctx.console.log("copy:", [srcFile.replace(trimPath, ""), dstFile.replace(trimPath, "")].join(" -> "));
      }
    };

    const copyItem = async (srcExpr, dstExpr) => {
      // @ts-ignore
      const srcFiles = await ctx.utils.globby(srcExpr, { cwd: from, dot: opts.dot });
      return Promise.all(
        srcFiles.map(srcFile => {
          srcFile = path.resolve(from, srcFile);
          return copyFile(srcFile, dstExpr, srcExpr);
        }),
      );
    };

    const pendings = [];
    // @ts-ignore
    ctx.utils.each(opts.files, (dstExpr, srcExpr) => {
      if (opts.direction === "->") {
        pendings.push(copyItem(dstExpr, srcExpr));
      } else {
        pendings.push(copyItem(srcExpr, dstExpr));
      }
    });
    await Promise.all(pendings);

    if (opts.log) {
      ctx.console.info("Done");
    }
    next();
  };
};

export default handler;
