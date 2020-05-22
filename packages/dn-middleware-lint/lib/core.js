const fs = require('fs');
const util = require('util');
const path = require('path');
const globby = require('globby');
const yaml = require('js-yaml');
const del = require('del');
const confman = require('confman');
const { CLIEngine } = require('eslint');
// const formatter = require('eslint-formatter-pretty');
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
  let isReact = true; // TODO: find out how to judge a project is using React/Rax/JSX.
  if (project && project.name) {
    const pkg = project;
    if (pkg.dependencies && pkg.dependencies.react) isReact = true;
    if (pkg.devDependencies && pkg.devDependencies.react) isReact = true;
    if (pkg.peerDependencies && pkg.peerDependencies.react) isReact = true;
  } else {
    isReact = true;
  }
  let isTypescript = false;
  const tsFiles = await globby(['./**/*.ts', './**/*.tsx', '!./**/*.d.ts', '!**/node_modules'], {
    onlyFiles: true,
    gitignore: true,
    cwd: options.cwd,
  });
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
module.exports.eslintignore = async options => {
  if (!fs.existsSync(path.join(options.cwd, ESLINT_IGNORE_FILE_PATH))) {
    let ignoreText = ESLINT_IGNORE_FILE_TEMPLATE;
    if (fs.existsSync(path.join(options.cwd, GIT_IGNORE_FILE_PATH))) {
      ignoreText = (await util.promisify(fs.readFile)(path.join(options.cwd, GIT_IGNORE_FILE_PATH), 'utf8')).toString();
    }
    await util.promisify(fs.writeFile)(path.join(options.cwd, ESLINT_IGNORE_FILE_PATH), ignoreText, 'utf8');
  }
};

// Sync add .editorconfig file
module.exports.editorconfig = async options => {
  if (!fs.existsSync(path.join(options.cwd, EDITOR_CONFIG_FILE_PATH))) {
    await util.promisify(fs.writeFile)(
      path.join(options.cwd, EDITOR_CONFIG_FILE_PATH),
      EDITOR_CONFIG_FILE_TEMPLATE,
      'utf8',
    );
  }
};

// ctx is not reqired
module.exports.rmRcFiles = async (options, ctx) => {
  const logger = ctx && ctx.console ? ctx.console : console;
  const opts = { gitignore: true, cwd: options.cwd };
  await del(ESLINTRC_FILE_CLEAN_PATHS, opts).then(eslintrcDeleteFiles => {
    if (eslintrcDeleteFiles && eslintrcDeleteFiles.length) {
      logger.info(`Deleted ".eslintrc.*" files:`);
      eslintrcDeleteFiles.forEach(filename => logger.info(' ', filename));
    }
  });
  await del(PRETTIERRC_FILE_CLEAN_PATHS, opts).then(prettierrcDeleteFiles => {
    if (prettierrcDeleteFiles && prettierrcDeleteFiles.length) {
      logger.info(`Deleted ".prettierrc.*" files:`);
      prettierrcDeleteFiles.forEach(filename => logger.info(' ', filename));
    }
  });
};

module.exports.readAndForceWriteRc = async (options, ctx) => {
  const { extend, isTypescript } = options.info;
  const logger = ctx && ctx.console ? ctx.console : console;
  let eslintrc = await confman.load(path.join(options.cwd, ESLINTRC_FILE_PATH));
  // Async overwrite .prettierrc.js file
  util.promisify(fs.writeFile)(path.join(options.cwd, PRETTIERRC_FILE_PATH), PRETTIERRC_FILE_TEMPLATE, 'utf8');
  if (!eslintrc) eslintrc = { extends: extend };
  eslintrc.extends = extend; // Force rewrite extends

  if (eslintrc.rules) {
    const mergedRule = ruleMerge(eslintrc.rules, ctx);
    if (mergedRule) eslintrc.rules = mergedRule;
  }
  if (isTypescript && (!eslintrc.parserOptions || !eslintrc.parserOptions.project)) {
    if (!fs.existsSync(path.join(options.cwd, 'tsconfig.json'))) {
      logger.info('Typescript/TypescriptReact project needs "tsconfig.json".');
      logger.info('Try `npx tsc --init` to generate.');
    }
    eslintrc.parserOptions = {
      ...(eslintrc.parserOptions || {}),
      project: './tsconfig.json',
    };
  }

  if (ctx && ctx.emit) {
    ctx.emit('lint.rules', eslintrc.rules); // will be deprecated soon
    ctx.emit('lint.config', eslintrc);
  }

  // Sync Overwrite
  const eslintrcYaml = await yaml.safeDump(eslintrc);
  await util.promisify(fs.writeFile)(
    path.join(options.cwd, ESLINTRC_FILE_PATH),
    `# Do not modify "extends" & "rules".\n\n${eslintrcYaml}`,
    'utf8',
  );
};

module.exports.execLint = async (options, ctx) => {
  const { ext } = options.info;
  const eslint = ctx.utils.findCommand(__dirname, 'eslint');
  const prettier = ctx.utils.findCommand(__dirname, 'prettier');
  ctx.console.info(`Start linting${options.autoFix ? ' and auto fix' : ''}${options.cache ? ' with cache' : ''}...`);
  const ignorePath = path.join(options.cwd, ESLINT_IGNORE_FILE_PATH);
  const prettierCmd = [prettier, '--write', options.cwd, '--loglevel', 'error', '--ignore-path', ignorePath].join(' ');
  if (options.autoFix && options.prettier) {
    await ctx.utils.exec(prettierCmd);
  }
  const eslintCmd = [
    eslint,
    options.cwd,
    '--ext',
    ext,
    options.autoFix ? '--fix' : '',
    '--ignore-path',
    ignorePath,
    '--format',
    require.resolve('eslint-formatter-pretty'),
    `--cache-location ${path.join(options.cwd, 'node_modules/.cache/.eslintcache')}`,
    options.cache ? '--cache' : '',
  ].join(' ');
  // await ctx.utils.exec(eslintCmd);
  // const cli = new CLIEngine({
  //   cwd: options.cwd,
  //   fix: options.autoFix,
  //   useEslintrc: true,
  //   extensions: ext.split(','),
  //   baseConfig: {
  //     parserOptions: {
  //       // fix @typescript-eslint cwd
  //       tsconfigRootDir: options.cwd,
  //     },
  //   },
  // });
  if (CLIEngine.version) {
    const [major] = CLIEngine.version.split('.');
    if (Number(major) < 6) throw new Error(`ESLint version not supported(${CLIEngine.version}), need >=6.`);
  }
  await ctx.utils.exec(eslintCmd);
  // const report = cli.executeOnFiles([options.cwd]);
  // console.log(formatter(report.results)); // eslint-disable-line no-console
  // if (report && report.errorCount && report.errorCount > 0) process.exit(1);
  ctx.console.info(`Lint completed.`);
};
