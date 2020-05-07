import * as assert from "assert";
import { existsSync } from "fs";
import { join } from "path";
import { merge } from "lodash";
import { IDawnContext, IOpts } from "./types";

export const getOpts = (opts: IOpts, ctx: IDawnContext): IOpts => {
  return merge({ cwd: ctx.cwd } as IOpts, opts);
};

export const validateOpts = (opts: IOpts, ctx: IDawnContext): void => {
  const { cwd, runtimeHelpers, target, noEmit, watch } = opts;
  if (runtimeHelpers) {
    const pkg = ctx.project;
    assert.ok(
      (pkg.dependencies || {})["@babel/runtime"],
      "@babel/runtime dependency is required to use runtimeHelpers.",
    );
  }
  if (target === "browser") {
    if (!existsSync(join(cwd, ".browserslistrc"))) {
      ctx.console.warn("No .browserslistrc found for browser target.");
    }
  }
  if (noEmit) {
    if (watch) {
      ctx.console.warn("Watch mode would not start with noEmit.");
    }
  }
};
