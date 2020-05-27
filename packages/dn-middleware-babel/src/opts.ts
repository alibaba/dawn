import { existsSync } from "fs";
import { join } from "path";
import { merge } from "lodash";
import { IDawnContext, IOpts } from "./types";

export const getOpts = (opts: IOpts, ctx: IDawnContext): IOpts => {
  return merge({ cwd: ctx.cwd, useBuiltIns: "usage", corejs: { version: 3, proposals: true } } as IOpts, opts);
};

export const validateOpts = async (opts: IOpts, ctx: IDawnContext): Promise<void> => {
  const { cwd, useBuiltIns, runtimeHelpers, corejs, target, noEmit, watch } = opts;
  const pkg = ctx.project;

  if (useBuiltIns && runtimeHelpers) {
    ctx.console.warn(
      "Do not use @babel/preset-env's useBuiltIns option together with @babel/plugin-transform-runtime. runtimeHelpers ignored",
    );
  }

  if (useBuiltIns) {
    if (!pkg.dependencies?.["core-js"]) {
      ctx.console.warn(
        `Enable @babel/preset-env's useBuiltIns options but core-js is not installed. Installing it with version ${
          corejs?.version || corejs || 3
        }...`,
      );
      await ctx.mod.install(`core-js@${corejs?.version || corejs || 3}`); // default use core-js@3
    }
  } else if (runtimeHelpers) {
    if (!corejs) {
      if (!pkg.dependencies?.["@babel/runtime"]) {
        ctx.console.warn(
          `Use @babel/plugin-transform-runtime but @babel/runtime is not installed. Installing it${
            typeof runtimeHelpers === "string" ? ` with version ${runtimeHelpers}` : ""
          }...`,
        );
        await ctx.mod.install(`@babel/runtime${typeof runtimeHelpers === "string" ? `@${runtimeHelpers}` : ""}`);
      }
    } else if (corejs === 2 || corejs.version === 2) {
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
    } else if (corejs === 3 || corejs.version === 3) {
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
