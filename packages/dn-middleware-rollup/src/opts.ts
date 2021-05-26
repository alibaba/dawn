import * as assert from "assert";
import { basename, join } from "path";
import { existsSync } from "fs";
import { camelCase, merge } from "lodash";
import { getExistFile, isTypescriptFile } from "./utils";
import { IDawnContext, IOpts } from "./types";

export const getOpts = (opts: IOpts, ctx: IDawnContext): IOpts => {
  const { cwd, fullCustom } = opts;

  // Support custom options without any default
  if (fullCustom) {
    return merge({ cwd: ctx.cwd }, opts);
  }

  const entry = getExistFile({
    cwd: cwd || ctx.cwd,
    files: ["src/index.tsx", "src/index.ts", "src/index.jsx", "src/index.js"],
    returnRelative: true,
  });
  const pkg = ctx.project;
  const defaultOpts: IOpts = {
    target: "browser",
    runtimeHelpers: true,
    corejs: false,
    esm: {
      minify: false,
      mjs: false,
    },
    cjs: {
      minify: false,
    },
    umd: {
      sourcemap: false,
      minFile: true,
      name: pkg.name && camelCase(basename(pkg.name)),
      template: "./src/assets/index.html",
    },
    system: false,
    iife: false,
  };

  const watchDefaultOpts: IOpts = {
    esm: false,
    cjs: false,
    umd: {
      minFile: false,
    },
  };

  return merge({ cwd: ctx.cwd, entry }, defaultOpts, opts.watch ? watchDefaultOpts : {}, opts);
};

export const validateOpts = async (opts: IOpts, ctx: IDawnContext): Promise<void> => {
  assert.ok(
    opts.esm || opts.cjs || opts.umd || opts.system || opts.iife,
    "None format of cjs | esm | umd | system | iife is configured, checkout guide for usage details.",
  );

  assert.ok(opts.entry, "No entry found, checkout guide for usage details.");

  const hasTypescript = Array.isArray(opts.entry) ? opts.entry.some(isTypescriptFile) : isTypescriptFile(opts.entry);
  if (hasTypescript) {
    if (!existsSync(join(opts.cwd, "tsconfig.json"))) {
      ctx.console.warn("Project using typescript but tsconfig.json not exists. Using default...");
      await ctx.utils.writeFile(
        join(opts.cwd, "tsconfig.json"),
        await ctx.utils.readFile(join(__dirname, "../template/tsconfig.json")),
      );
    }
  }

  if (opts.target === "browser") {
    if (!existsSync(join(opts.cwd, ".browserslistrc"))) {
      ctx.console.warn("No .browserslistrc found for browser target. Using default...");
      await ctx.utils.writeFile(
        join(opts.cwd, ".browserslistrc"),
        await ctx.utils.readFile(join(__dirname, "../template/.browserslistrc")),
      );
    }
  }
};
