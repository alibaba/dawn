import * as assert from "assert";
import { basename, join } from "path";
import { existsSync } from "fs";
import { camelCase, merge } from "lodash";
import { Context } from "@dawnjs/types";
import { getExistFile, isTypescriptFile } from "./utils";
import { IOpts } from "./types";

export const getOpts = (opts: IOpts, ctx: Context<IOpts>): IOpts => {
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
    outDir: "build",
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
  };

  return merge({ cwd: ctx.cwd, entry }, defaultOpts, opts);
};

export const validateOpts = (opts: IOpts, ctx: Context<IOpts>): void => {
  if (opts.runtimeHelpers) {
    const pkg = ctx.project;
    assert.ok(
      (pkg.dependencies || {})["@babel/runtime"],
      "@babel/runtime dependency is required to use runtimeHelpers.",
    );
  }

  assert.ok(
    opts.esm || opts.cjs || opts.umd,
    "None format of cjs | esm | umd is configured, checkout guide for usage details.",
  );

  assert.ok(opts.entry, "No entry found, checkout guide for usage details.");

  const hasTypescript = Array.isArray(opts.entry) ? opts.entry.some(isTypescriptFile) : isTypescriptFile(opts.entry);
  if (hasTypescript) {
    assert.ok(existsSync(join(opts.cwd, "tsconfig.json")), "Project using typescript but tsconfig.json not exists.");
  }

  if (opts.target === "browser") {
    if (!existsSync(join(opts.cwd, ".browserslistrc"))) {
      ctx.console.warn("No .browserslistrc found for browser target.");
    }
  }
};
