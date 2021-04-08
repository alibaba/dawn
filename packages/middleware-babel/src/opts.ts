import { existsSync } from "fs";
import { join } from "path";
import { merge } from "lodash";
import { IDawnContext, IOpts } from "./types";

export const getOpts = (opts: IOpts, ctx: IDawnContext): IOpts => {
  return merge({ cwd: ctx.cwd, env: process.env.NODE_ENV }, opts);
};

export const validateOpts = async (opts: IOpts, ctx: IDawnContext): Promise<void> => {
  const { cwd, runtimeHelpers, corejs, target, noEmit, watch } = opts;
  const pkg = ctx.project;

  if (runtimeHelpers) {
    if (!corejs) {
      if (!pkg.dependencies?.["@babel/runtime"]) {
        ctx.console.warn(
          `Use @babel/plugin-transform-runtime but @babel/runtime is not installed. Installing it${
            typeof runtimeHelpers === "string" ? ` with version ${runtimeHelpers}` : ""
          }...`,
        );
        await ctx.mod.install(`@babel/runtime${typeof runtimeHelpers === "string" ? `@${runtimeHelpers}` : ""}`);
      }
    } else if (corejs === 2 || (corejs as any).version === 2) {
      if (!pkg.dependencies?.["@babel/runtime-corejs2"]) {
        ctx.console.warn(
          `Use @babel/plugin-transform-runtime and enable its corejs option with version 2, but @babel/runtime-corejs2 is not installed. Installing it${
            typeof runtimeHelpers === "string" ? ` with version ${runtimeHelpers}` : ""
          }...`,
        );
        await ctx.mod.install(
          `@babel/runtime-corejs2${typeof runtimeHelpers === "string" ? `@${runtimeHelpers}` : ""}`,
        );
      }
    } else if (corejs === 3 || (corejs as any).version === 3) {
      if (!pkg.dependencies?.["@babel/runtime-corejs3"]) {
        ctx.console.warn(
          `Use @babel/plugin-transform-runtime and enable its corejs option with version 3, but @babel/runtime-corejs3 is not installed. Installing it${
            typeof runtimeHelpers === "string" ? ` with version ${runtimeHelpers}` : ""
          }...`,
        );
        await ctx.mod.install(
          `@babel/runtime-corejs3${typeof runtimeHelpers === "string" ? `@${runtimeHelpers}` : ""}`,
        );
      }
    }
  }

  if (target === "browser") {
    if (!existsSync(join(cwd, ".browserslistrc"))) {
      ctx.console.warn("No .browserslistrc found for browser target. Using default...");
      await ctx.utils.writeFile(
        join(cwd, ".browserslistrc"),
        await ctx.utils.readFile(join(__dirname, "../template/browserslistrc")),
      );
    }
  }

  if (noEmit) {
    if (watch) {
      ctx.console.warn("Watch mode would not start with noEmit.");
    }
  }
};
