const path = require('path');
const lintStaged = require('lint-staged');
const validateOpts = require('./option');
const { ESLINT_IGNORE_FILE_PATH } = require('./constants');
const { rmRcFiles, readAndForceWriteRc, execLint, getProjectInfo } = require('./core');

module.exports = opts => {
  const options = {
    realtime: opts.realtime === true, // default false
    autoFix: opts.autoFix !== false, // default true
    lintStaged: opts.staged === true, // default false
    prettier: opts.staged === true, // default false
    cache: opts.cache === true, // default false
  };
  return async (next, ctx) => {
    validateOpts(opts, ctx);
    options.cwd = ctx.cwd;
    options.project = ctx.project;
    // eslint-disable-next-line require-atomic-updates
    options.info = await getProjectInfo(options, ctx);
    ctx.emit('lint.opts', options); // will be deprecated soon
    if (options.lintStaged) {
      // Support LintStaged
      // Before all logic, simple and fast
      const success = await lintStaged({
        config: {
          '**/*.{js,jsx,ts,tsx}': `eslint --ignore-path ${ESLINT_IGNORE_FILE_PATH} --quiet --color`,
          '**/*.{json,css,sass,scss,less,html,gql,graphql,md,yml,yaml}': 'prettier --check',
        },
      });
      if (!success) process.exit(1);
      return next();
    }

    // Async Remove unused .eslintrc files
    // Async Remove unused .prettierrc files
    rmRcFiles(options, ctx);

    // Async overwrite .prettierrc.js file
    await readAndForceWriteRc(options, ctx);

    if (options.realtime) {
      const { ext } = await getProjectInfo(options, ctx);
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
      // Sync exec lint
      await execLint(options, ctx);
    }

    return next();
  };
};
