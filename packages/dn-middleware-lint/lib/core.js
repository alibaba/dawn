const fs = require('fs');
const path = require('path');
const getProjectInfo = require('./project');
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
  const { extend, isTypescript } = await getProjectInfo(ctx.project);
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
  const { ext } = await getProjectInfo(ctx.project);
  const eslint = ctx.utils.findCommand(__dirname, 'eslint');
  const prettier = ctx.utils.findCommand(__dirname, 'prettier');
  ctx.console.info(`Start linting${options.autoFix ? ' and auto fix' : ''}...`);
  const ignorePath = path.join(options.cwd, ESLINT_IGNORE_FILE_PATH);
  const prettierCmd = [prettier, '--write', options.cwd, '--loglevel', 'error', '--ignore-path', ignorePath].join(' ');
  const eslintCmd = [
    eslint,
    options.cwd,
    '--ext',
    ext,
    options.autoFix ? '--fix' : '',
    '--ignore-path',
    ignorePath,
  ].join(' ');
  // console.log('prettierCmd', prettierCmd);
  // console.log('eslintCmd', eslintCmd);
  if (options.autoFix) {
    await ctx.utils.exec(prettierCmd);
  }
  await ctx.utils.exec(eslintCmd);
  ctx.console.info(`Lint completed.`);
};
