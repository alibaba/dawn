import lintStaged from "lint-staged";
import { validateOpts } from "./opts";
import { ESLINT_IGNORE_FILE_PATH } from "./constants";
import {
  editorconfig,
  eslintignore,
  execLint,
  getProjectInfo,
  prepareDeps,
  readAndForceWriteRc,
  rmRcFiles,
} from "./core";
import { debug } from "./utils";
import type { Handler } from "./types";

const handler: Handler = opts => {
  debug("opts", opts);

  return async (next, ctx) => {
    validateOpts(opts, ctx);

    const options = {
      noEmit: opts.noEmit === true,
      realtime: opts.realtime === true, // default false
      autoFix: opts.autoFix !== false, // default true
      lintStaged: opts.staged === true, // default false
      prettier: opts.prettier === true, // default false
      cache: opts.cache !== false, // default true
    };
    debug("options", options);

    const projectInfo = await getProjectInfo(ctx.cwd);
    debug("projectInfo", projectInfo);

    await eslintignore(ctx.cwd);
    await editorconfig(ctx.cwd);

    // Async Remove unused .eslintrc files
    // Async Remove unused .prettierrc files
    await rmRcFiles({ console: ctx.console, cwd: ctx.cwd });

    // Async overwrite .prettierrc.js file
    await readAndForceWriteRc({ console: ctx.console, cwd: ctx.cwd, projectInfo });

    await prepareDeps(ctx, projectInfo);

    if (options.lintStaged) {
      // Support LintStaged
      // Before all logic, simple and fast
      const lintStagedConfig = {
        config: {
          "**/*.{js,jsx,ts,tsx}": `eslint --ignore-path ${ESLINT_IGNORE_FILE_PATH} --quiet --color${
            options.autoFix ? " --fix" : ""
          }`,
        },
      };
      if (options.prettier) {
        lintStagedConfig.config["**/*.{json,css,sass,scss,less,html,gql,graphql,md,yml,yaml}"] = "prettier --check";
      }
      const success = await lintStaged(lintStagedConfig);
      if (!success) {
        process.exit(1);
      }
      return next();
    }

    if (!options.realtime && !options.noEmit) {
      await execLint({ autoFix: options.autoFix, cache: options.cache, prettier: options.prettier, projectInfo }, ctx);
    }

    return next();
  };
};

export default handler;
