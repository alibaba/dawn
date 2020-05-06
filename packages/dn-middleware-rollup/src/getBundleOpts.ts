import * as assert from "assert";
import { basename, join } from "path";
import { existsSync } from "fs";
import { camelCase, merge } from "lodash";
import { getExistFile, getPkgFile } from "./utils";
import { IBundleOptions, IDawnContext, IOpts } from "./types";

export const getBundleOpts = (opts: IOpts): IBundleOptions => {
  const { cwd, bundleOpts: userBundleOpts = {} } = opts;
  const entry = getExistFile({
    cwd,
    files: ["src/index.tsx", "src/index.ts", "src/index.jsx", "src/index.js"],
    returnRelative: true,
  });
  const pkg = getPkgFile({ cwd });
  const defaultBundleOpts: IBundleOptions = {
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
    },
  };

  const bundleOpts = merge({ entry }, defaultBundleOpts, userBundleOpts);

  return bundleOpts;
};

const isTypescriptFile = (filePath: string): boolean => {
  return filePath.endsWith(".ts") || filePath.endsWith(".tsx");
};

export const validateBundleOpts = (bundleOpts: IBundleOptions, opts: IOpts, ctx: IDawnContext): void => {
  const { cwd } = opts;
  if (bundleOpts.runtimeHelpers) {
    const pkg = getPkgFile({ cwd });
    assert.ok(
      (pkg.dependencies || {})["@babel/runtime"],
      "@babel/runtime dependency is required to use runtimeHelpers.",
    );
  }
  assert.ok(
    bundleOpts.esm || bundleOpts.cjs || bundleOpts.umd,
    "None format of cjs | esm | umd is configured, checkout guide for usage details.",
  );
  assert.ok(bundleOpts.entry, "No entry found, checkout guide for usage details.");
  const hasTypescript = Array.isArray(bundleOpts.entry)
    ? bundleOpts.entry.some(isTypescriptFile)
    : isTypescriptFile(bundleOpts.entry);
  if (hasTypescript) {
    assert.ok(existsSync(join(cwd, "tsconfig.json")), "Project using typescript but tsconfig.json not exists.");
  }
  if (bundleOpts.target === "browser") {
    if (!existsSync(join(cwd, ".browserslistrc"))) {
      ctx.console.warn("No .browserslistrc found for browser target.");
    }
  }
};
