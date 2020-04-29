const fs = require('fs');
const path = require('path');
const globby = require('globby');
const { CLIEngine } = require('eslint');
const formatter = require('eslint-formatter-pretty');
const ruleMerge = require('./rules');
const {
  EDITOR_CONFIG_FILE_PATH,
  ESLINTRC_FILE_PATH,
  ESLINTRC_FILE_CLEAN_PATHS,
  ESLINT_IGNORE_FILE_PATH,
  GIT_IGNORE_FILE_PATH,
  PRETTIERRC_FILE_PATH,
  PRETTIERRC_FILE_CLEAN_PATHS,
  PRETTIERRC_FILE_TEMPLATE,
  ESLINT_IGNORE_FILE_TEMPLATE,
  EDITOR_CONFIG_FILE_TEMPLATE,
} = require('./constants');

module.exports.getProjectInfo = async options => {
  const { project = {} } = options;
  let extend = 'dawn/standard';
  let ext = '.js,.jsx';
  let isReact = false;
  if (project && project.version) {
    const pkg = project;
    if (pkg.dependencies && pkg.dependencies.react) isReact = true;
    if (pkg.devDependencies && pkg.devDependencies.react) isReact = true;
    if (pkg.peerDependencies && pkg.peerDependencies.react) isReact = true;
  } else {
    isReact = true;
  }
  let isTypescript = false;
  const tsFiles = await globby(
    [path.join(options.cwd, './**/*.ts'), path.join(options.cwd, './**/*.tsx'), '!./**/*.d.ts', '!node_modules'],
    {
      onlyFiles: true,
      gitignore: true,
      cwd: options.cwd,
    },
  );
  if (tsFiles && tsFiles.length > 0) isTypescript = true; // TS Project

  if (isTypescript) {
    extend = isReact ? 'dawn/typescript-react' : 'dawn/typescript';
    ext = '.js,.jsx,.ts,.tsx';
  } else {
    extend = isReact ? 'dawn' : 'dawn/standard';
  }

  return {
    isReact,
    isTypescript,
    extend,
    ext,
  };
};

// Sync add .eslintignore file
module.exports.eslintignore = async (options, ctx) => {
  if (!fs.existsSync(path.join(options.cwd, ESLINT_IGNORE_FILE_PATH))) {
    let ignoreText = ESLINT_IGNORE_FILE_TEMPLATE;
    if (fs.existsSync(path.join(options.cwd, GIT_IGNORE_FILE_PATH))) {
      ignoreText = (await ctx.utils.readFile(path.join(options.cwd, GIT_IGNORE_FILE_PATH))).toString();
    }
    await ctx.utils.writeFile(path.join(options.cwd, ESLINT_IGNORE_FILE_PATH), ignoreText);
  }
};

// Sync add .editorconfig file
module.exports.editorconfig = async (options, ctx) => {
  if (!fs.existsSync(path.join(options.cwd, EDITOR_CONFIG_FILE_PATH))) {
    await ctx.utils.writeFile(path.join(options.cwd, EDITOR_CONFIG_FILE_PATH), EDITOR_CONFIG_FILE_TEMPLATE);
  }
};

module.exports.rmRcFiles = async (options, ctx) => {
  await ctx.utils.del(ESLINTRC_FILE_CLEAN_PATHS, { gitignore: true }).then(eslintrcDeleteFiles => {
    if (eslintrcDeleteFiles && eslintrcDeleteFiles.length) {
      ctx.console.info(`Deleted ".eslintrc.*" files:`);
      eslintrcDeleteFiles.forEach(filename => ctx.console.info(' ', filename));
    }
  });
  await ctx.utils.del(PRETTIERRC_FILE_CLEAN_PATHS, { gitignore: true }).then(prettierrcDeleteFiles => {
    if (prettierrcDeleteFiles && prettierrcDeleteFiles.length) {
      ctx.console.info(`Deleted ".prettierrc.*" files:`);
      prettierrcDeleteFiles.forEach(filename => ctx.console.info(' ', filename));
    }
  });
};

module.exports.readAndForceWriteRc = async (options, ctx) => {
  const { extend, isTypescript } = options.info;
  let eslintrc = ctx.utils.confman.load(path.join(options.cwd, ESLINTRC_FILE_PATH));
  // Async overwrite .prettierrc.js file
  ctx.utils.writeFile(path.join(options.cwd, PRETTIERRC_FILE_PATH), PRETTIERRC_FILE_TEMPLATE);
  if (!eslintrc) eslintrc = { extends: extend };
  if (eslintrc.extends !== extend) {
    // Force rewrite extends
    eslintrc.extends = extend;
  }

  if (eslintrc.rules) {
    const mergedRule = ruleMerge(eslintrc.rules, ctx);
    if (mergedRule) eslintrc.rules = mergedRule;
  }
  if (isTypescript && (!eslintrc.parserOptions || !eslintrc.parserOptions.project)) {
    ctx.console.info('Typescript/TypescriptReact project needs "tsconfig.json".');
    ctx.console.info('Try `npx tsc --init` to generate.');
    eslintrc.parserOptions = {
      ...(eslintrc.parserOptions || {}),
      project: './tsconfig.json',
    };
  }

  ctx.emit('lint.rules', eslintrc.rules); // will be deprecated soon
  ctx.emit('lint.config', eslintrc);

  // Sync Overwrite
  const eslintrcYaml = ctx.utils.yaml.stringify(eslintrc);
  await ctx.utils.writeFile(
    path.join(options.cwd, ESLINTRC_FILE_PATH),
    `# Do not modify "extends" & "rules".\n\n${eslintrcYaml}`,
  );
};

module.exports.execLint = async (options, ctx) => {
  const { ext } = options.info;
  // const eslint = ctx.utils.findCommand(__dirname, 'eslint');
  const prettier = ctx.utils.findCommand(__dirname, 'prettier');
  ctx.console.info(`Start linting${options.autoFix ? ' and auto fix' : ''}...`);
  const ignorePath = path.join(options.cwd, ESLINT_IGNORE_FILE_PATH);
  const prettierCmd = [prettier, '--write', options.cwd, '--loglevel', 'error', '--ignore-path', ignorePath].join(' ');
  if (options.autoFix) {
    await ctx.utils.exec(prettierCmd);
  }
  // await ctx.utils.exec(eslintCmd);
  const cli = new CLIEngine({
    cwd: options.cwd,
    fix: options.autoFix,
    useEslintrc: true,
    extensions: ext.split(','),
    baseConfig: {
      parserOptions: {
        // fix @typescript-eslint cwd
        tsconfigRootDir: options.cwd,
      },
    },
  });
  const report = cli.executeOnFiles(['.']);
  console.log(formatter(report.results)); // eslint-disable-line no-console
  if (report && report.errorCount && report.errorCount > 0 && options.interrupt) process.exit(1);
  ctx.console.info(`Lint completed.`);
};
