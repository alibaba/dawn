import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import del from "del";
import semver from "semver";
import ruleMerge from "./rules";
import { debug } from "./utils";
import {
  EDITOR_CONFIG_FILE_PATH,
  EDITOR_CONFIG_FILE_TEMPLATE,
  ESLINT_IGNORE_FILE_PATH,
  ESLINT_IGNORE_FILE_TEMPLATE,
  ESLINTRC_FILE_CLEAN_PATHS,
  ESLINTRC_FILE_PATH,
  GIT_IGNORE_FILE_PATH,
  PRETTIERRC_FILE_CLEAN_PATHS,
  PRETTIERRC_FILE_PATH,
  PRETTIERRC_FILE_TEMPLATE,
} from "./constants";
import type { Context, IProjectInfo } from "./types";

const { access, readFile, writeFile } = fs.promises;

export const getProjectInfo = async (cwd: string): Promise<IProjectInfo> => {
  // const { project = {} } = options;
  let extend = "@dawnjs/eslint-config-dawn/standard";
  let ext = ".js,.jsx";
  let isTypescript = false;
  try {
    await access(path.join(cwd, "tsconfig.json"));
    isTypescript = true;
  } catch (e) {
    // do nothing
  }
  debug("getProjectInfo.isTypescript", isTypescript);
  const isReact = true;
  // TODO: find out how to judge a project is using React/Rax/JSX.
  // if (project && project.name) {
  //   const pkg = project;
  //   if (pkg.dependencies && pkg.dependencies.react) isReact = true;
  //   if (pkg.devDependencies && pkg.devDependencies.react) isReact = true;
  //   if (pkg.peerDependencies && pkg.peerDependencies.react) isReact = true;
  // } else {
  //   isReact = true;
  // }
  debug("getProjectInfo.isReact", isReact);
  if (isTypescript) {
    extend = isReact ? "@dawnjs/eslint-config-dawn/typescript-react" : "@dawnjs/eslint-config-dawn/typescript";
    ext = ".js,.jsx,.ts,.tsx";
  } else {
    extend = isReact ? "@dawnjs/eslint-config-dawn" : "@dawnjs/eslint-config-dawn/standard";
  }
  debug("getProjectInfo.extend", extend);
  debug("getProjectInfo.ext", ext);

  return {
    isReact,
    isTypescript,
    extend,
    ext,
  };
};

// Sync add .eslintignore file
export const eslintignore = async (cwd: string) => {
  const eslintIgnoreFilePath = path.join(cwd, ESLINT_IGNORE_FILE_PATH);
  const gitIgnoreFilePath = path.join(cwd, GIT_IGNORE_FILE_PATH);
  try {
    await access(eslintIgnoreFilePath);
  } catch (e) {
    let ignoreText: string;
    try {
      await access(gitIgnoreFilePath, fs.constants.R_OK);
      ignoreText = await readFile(gitIgnoreFilePath, "utf8");
    } catch (e2) {
      ignoreText = ESLINT_IGNORE_FILE_TEMPLATE;
    }
    debug("eslintignore.ignoreText", ignoreText);
    await writeFile(eslintIgnoreFilePath, ignoreText, "utf-8");
  }
};

// Sync add .editorconfig file
export const editorconfig = async (cwd: string) => {
  const editorConfigFilePath = path.join(cwd, EDITOR_CONFIG_FILE_PATH);
  try {
    await access(editorConfigFilePath);
  } catch (e) {
    await writeFile(editorConfigFilePath, EDITOR_CONFIG_FILE_TEMPLATE, "utf-8");
  }
};

export const rmRcFiles = async (options: { console: Console; cwd: string }) => {
  const logger = options.console;
  const eslintrcDeleteFiles = await del(ESLINTRC_FILE_CLEAN_PATHS.map(p => path.join(options.cwd, p)));
  if (eslintrcDeleteFiles && eslintrcDeleteFiles.length) {
    logger.info(`Deleted ".eslintrc.*" files:`);
    eslintrcDeleteFiles.forEach(filename => logger.info(" ", filename));
  }
  const prettierrcDeleteFiles = await del(PRETTIERRC_FILE_CLEAN_PATHS.map(p => path.join(options.cwd, p)));
  if (prettierrcDeleteFiles && prettierrcDeleteFiles.length) {
    logger.info(`Deleted ".prettierrc.*" files:`);
    prettierrcDeleteFiles.forEach(filename => logger.info(" ", filename));
  }
};

export const readAndForceWriteRc = async (options: { console: Console; cwd: string; projectInfo: IProjectInfo }) => {
  const { extend, isTypescript } = options.projectInfo;

  // Overwrite .prettierrc.js file
  await writeFile(path.join(options.cwd, PRETTIERRC_FILE_PATH), PRETTIERRC_FILE_TEMPLATE, "utf8");

  let eslintrc: any;
  try {
    const eslintrcYaml = await readFile(path.join(options.cwd, ESLINTRC_FILE_PATH), "utf-8");
    eslintrc = await yaml.load(eslintrcYaml);
  } catch (e) {
    // do nothing
  }

  debug("readAndForceWriteRc.eslintrc.source", eslintrc);

  if (!eslintrc) {
    eslintrc = { extends: extend };
  } else {
    eslintrc.extends = extend; // Force rewrite extends
  }

  eslintrc.root = true;

  if (eslintrc.rules) {
    const mergedRule = ruleMerge(eslintrc.rules, { console: options.console });
    if (mergedRule) {
      eslintrc.rules = mergedRule;
    }
  }
  if (isTypescript && (!eslintrc.parserOptions || !eslintrc.parserOptions.project)) {
    eslintrc.parserOptions = {
      ...(eslintrc.parserOptions || {}),
      project: "./tsconfig.json",
    };
  }
  debug("readAndForceWriteRc.eslintrc.modify", eslintrc);

  // Overwrite .eslintrc.yml
  const resultEslintrcYaml = await yaml.dump(eslintrc);
  await writeFile(
    path.join(options.cwd, ESLINTRC_FILE_PATH),
    `# Do not modify "extends" & "rules".\n\n${resultEslintrcYaml}`,
    "utf8",
  );
};

export const execESLint = async (
  ctx: Context,
  options: {
    autoFix: boolean;
    cache: boolean;
    projectInfo: IProjectInfo;
  },
) => {
  const eslint = ctx.utils.findCommand(__dirname, "eslint");
  debug("execLint.cmd.eslint", eslint);
  const ignorePath = path.join(ctx.cwd, ESLINT_IGNORE_FILE_PATH);
  const eslintCmd = [
    eslint,
    ctx.cwd,
    "--ext",
    options.projectInfo.ext,
    options.autoFix ? "--fix" : "",
    "--ignore-path",
    ignorePath,
    "--format",
    require.resolve("eslint-formatter-pretty"),
    "--cache-location",
    path.join(ctx.cwd, "node_modules/.cache/.eslintcache"),
    options.cache ? "--cache" : "",
  ].join(" ");
  debug("execLint.eslint", eslintCmd);

  await ctx.utils.exec(eslintCmd);
};

export const execPrettier = async (ctx: Context) => {
  const prettier = ctx.utils.findCommand(__dirname, "prettier");
  debug("execLint.cmd.prettier", prettier);

  const ignorePath = path.join(ctx.cwd, ESLINT_IGNORE_FILE_PATH);
  const prettierCmd = [prettier, "--write", ctx.cwd, "--loglevel", "error", "--ignore-path", ignorePath].join(" ");
  debug("execLint.prettier", prettierCmd);
  await ctx.utils.exec(prettierCmd);
};

export const execLint = async (
  options: { autoFix: boolean; cache: boolean; prettier: boolean; projectInfo: IProjectInfo },
  ctx: Context,
) => {
  ctx.console.info(`Start linting${options.autoFix ? " and auto fix" : ""}${options.cache ? " with cache" : ""}...`);
  await execESLint(ctx, { autoFix: options.autoFix, cache: options.cache, projectInfo: options.projectInfo });

  if (options.autoFix && options.prettier) {
    await execPrettier(ctx);
  }
  // const report = cli.executeOnFiles([options.cwd]);
  // console.log(formatter(report.results)); // eslint-disable-line no-console
  // if (report && report.errorCount && report.errorCount > 0) process.exit(1);
  ctx.console.info(`Lint completed.`);
  debug("execLint.finish");
};

export const prepareDeps = async (ctx: Context, projectInfo: IProjectInfo) => {
  const deps = [
    { name: "eslint", version: "^8.0.0" },
    { name: "prettier", version: "^2.4.0" },
    { name: "eslint-plugin-import", version: "^2.25.0" },
    { name: "eslint-plugin-prettier", version: "^4.0.0" },
    { name: "@babel/eslint-parser", version: "^7.16.0" },
  ];
  if (projectInfo.isTypescript) {
    deps.push(
      { name: "@typescript-eslint/eslint-plugin", version: "^5.0.0" },
      { name: "@typescript-eslint/parser", version: "^5.0.0" },
    );
  }
  if (projectInfo.isReact) {
    deps.push(
      { name: "eslint-plugin-react", version: "^7.27.0" },
      { name: "eslint-plugin-react-hooks", version: "^4.3.0" },
      { name: "eslint-plugin-jsx-a11y", version: "^6.5.0" },
    );
  }
  const projectDeps = ctx.project.dependencies;
  const projectDevDeps = ctx.project.devDependencies;

  const needInstallDeps = deps
    .filter(dep => {
      const projectDepVersion = projectDeps?.[dep.name] || projectDevDeps?.[dep.name];
      if (!projectDepVersion) {
        ctx.console.warn(`${dep.name} not installed in project.`);
        return true;
      }

      if (!semver.satisfies(semver.minVersion(projectDepVersion), dep.version)) {
        ctx.console.warn(
          `${dep.name} installed in project does not satisfy requirement. Installed version ${projectDepVersion}, required version ${dep.version}`,
        );
        return true;
      }
      return false;
    })
    .map(dep => `${dep.name}@${dep.version}`);

  if (needInstallDeps.length > 0) {
    ctx.console.log(`Installing missing deps: ${needInstallDeps.join(" ")}`);
    await ctx.mod.exec(`i ${needInstallDeps.join(" ")}`, { flag: { "save-dev": true } });
  }
};
