const fs = require('fs');
const path = require('path');
const getProjectInfo = require('./project');
const validateOpts = require('./option');
const defaultEditorConfig = require('./editorconfig');
const ruleMerge = require('./rules');
const pkg = require('../package.json');

const EDITOR_CONFIG_FILE_PATH = '.editorconfig';
const ESLINTRC_FILE_PATH = '.eslintrc.yml';
const ESLINTRC_FILE_CLEAN_PATHS = ['.eslintrc', '.eslintrc.*', '!.eslintrc.yml'];
const ESLINT_IGNORE_FILE_PATH = '.eslintignore';
const GIT_IGNORE_FILE_PATH = '.gitignore';
const PRETTIERRC_FILE_PATH = '.prettierrc.js';
const PRETTIERRC_FILE_CLEAN_PATHS = ['.prettierrc', '.prettierrc.*', '!.prettierrc.js'];
const PRETTIERRC_FILE_TEMPLATE = `/** !!DO NOT MODIFY THIS FILE!! */
module.exports = require('eslint-config-dawn/prettierrc');
`;

module.exports = opts => {
  const options = {
    realtime: opts.realtime === true, // default false
    autoFix: opts.autoFix !== false, // default true
  };
  return async (next, ctx) => {
    validateOpts(opts, ctx);
    ctx.emit('lint.opts', options);
    const { extend, isTypescript, ext } = await getProjectInfo(ctx);
    let eslintrc = ctx.utils.confman.load(path.join(ctx.cwd, ESLINTRC_FILE_PATH));

    // Sync add .eslintignore file
    if (!fs.existsSync(path.join(ctx.cwd, ESLINT_IGNORE_FILE_PATH))) {
      const ignoreText = (await ctx.utils.readFile(path.join(ctx.cwd, GIT_IGNORE_FILE_PATH))).toString();
      await ctx.utils.writeFile(path.join(ctx.cwd, ESLINT_IGNORE_FILE_PATH), ignoreText);
    }

    // Async add .editorconfig file
    if (!fs.existsSync(path.join(ctx.cwd, EDITOR_CONFIG_FILE_PATH))) {
      ctx.utils.writeFile(path.join(ctx.cwd, EDITOR_CONFIG_FILE_PATH), defaultEditorConfig);
    }

    const isInstalled = name => {
      return fs.existsSync(path.join(ctx.cwd, 'node_modules', name));
    };

    // Sync Install deps from peerDependencies
    await Promise.all(
      Object.entries(pkg.peerDependencies).map(([dep, ver]) => {
        if (isInstalled(dep)) return;
        return ctx.mod.install(`${dep}@${ver}`, { flag: { 'save-dev': true } });
      }),
    );

    // Async Remove unused .eslintrc files
    ctx.utils.del(ESLINTRC_FILE_CLEAN_PATHS, { gitignore: true }).then(eslintrcDeleteFiles => {
      if (eslintrcDeleteFiles && eslintrcDeleteFiles.length) {
        ctx.console.info(`Deleted ".eslintrc.*" files:`);
        eslintrcDeleteFiles.forEach(filename => ctx.console.info(' ', filename));
      }
    });

    // Async Remove unused .prettierrc files
    ctx.utils.del(PRETTIERRC_FILE_CLEAN_PATHS, { gitignore: true }).then(prettierrcDeleteFiles => {
      if (prettierrcDeleteFiles && prettierrcDeleteFiles.length) {
        ctx.console.info(`Deleted ".prettierrc.*" files:`);
        prettierrcDeleteFiles.forEach(filename => ctx.console.info(' ', filename));
      }
    });

    // Async overwrite .prettierrc.js file
    ctx.utils.writeFile(path.join(ctx.cwd, PRETTIERRC_FILE_PATH), PRETTIERRC_FILE_TEMPLATE);

    if (!eslintrc) eslintrc = { extends: extend };
    if (!eslintrc.extends || eslintrc.extends !== extend) {
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

    // will be deprecated soon
    ctx.emit('lint.rules', eslintrc.rules);
    ctx.emit('lint.config', eslintrc);

    // Sync Overwrite
    const eslintrcYaml = ctx.utils.yaml.stringify(eslintrc);
    await ctx.utils.writeFile(
      path.join(ctx.cwd, ESLINTRC_FILE_PATH),
      `# Do not modify "extends" & "rules".\n\n${eslintrcYaml}`,
    );

    const eslint = ctx.utils.findCommand(__dirname, 'eslint');
    const prettier = ctx.utils.findCommand(__dirname, 'prettier');

    if (options.realtime) {
      // TODO: wait for webpack/rollup.. pack middleware refactor
      // TODO: just set a symbol
      const testStr = ext
        .split(',')
        .map(k => `\\${k}`)
        .join('|');
      ctx.on('webpack.config', webpackConf => {
        const webpackVersion = webpackConf.module.rules ? 4 : 3;
        const eslintLoader = {
          test: new RegExp(`(${testStr})$`),
          include: path.resolve(ctx.cwd, 'src'),
          exclude: /node_modules/,
          enforce: 'pre',
          loader: [
            {
              loader: require.resolve('eslint-loader'),
              options: { cache: true, formatter: 'stylish' },
            },
          ],
        };
        const { module } = webpackConf;
        if (webpackVersion >= 4) {
          if (Array.isArray(module.rules)) {
            module.rules.unshift(eslintLoader);
          } else {
            // eslint-disable-next-line no-param-reassign
            module.rules = [eslintLoader];
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (Array.isArray(module.loaders)) {
            module.loaders.unshift(eslintLoader);
          } else {
            // eslint-disable-next-line no-param-reassign
            module.loaders = [eslintLoader];
          }
        }
      });
    } else {
      ctx.console.info(`Start linting${options.autoFix ? ' and auto fix' : ''}...`);
      if (options.autoFix) {
        await ctx.utils.exec([prettier, '--write', '.', '--loglevel', 'error'].join(' '));
      }
      await ctx.utils.exec([eslint, '.', '--ext', ext, options.autoFix ? '--fix' : ''].join(' '));
      ctx.console.info(`Lint completed.`);
    }

    next();
  };
};
