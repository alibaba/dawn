const path = require('path');
const lintStaged = require('lint-staged');
const ESLintPlugin = require('eslint-webpack-plugin');
const eslintRollup = require('rollup-plugin-eslint').eslint;
const formatterPretty = require('eslint-formatter-pretty');
const validateOpts = require('./option');
const { ESLINT_IGNORE_FILE_PATH } = require('./constants');
const { rmRcFiles, readAndForceWriteRc, execLint, getProjectInfo } = require('./core');
const debug = require('debug')('dn:middleware:lint');
// const heapdump = require('heapdump');

// heapdump.writeSnapshot('/var/local/' + Date.now() + '.heapsnapshot');
// heapdump.writeSnapshot(function (err, filename) {
//   console.log('dump written to', filename);
// });

module.exports = opts => {
  debug('opts', opts);
  const options = {
    realtime: opts.realtime === true, // default false
    autoFix: opts.autoFix !== false, // default true
    lintStaged: opts.staged === true, // default false
    prettier: opts.prettier === true, // default false
    cache: opts.cache === true, // default false
  };
  debug('options', options);
  return async (next, ctx) => {
    validateOpts(opts, ctx);
    options.cwd = ctx.cwd;
    options.project = ctx.project;
    // eslint-disable-next-line require-atomic-updates
    options.info = await getProjectInfo({ ...options });
    debug('options.info', options.info);
    ctx.emit('lint.opts', options); // will be deprecated soon
    if (options.lintStaged) {
      // Support LintStaged
      // Before all logic, simple and fast
      const lintStagedConfig = {
        config: {
          '**/*.{js,jsx,ts,tsx}': `eslint --ignore-path ${ESLINT_IGNORE_FILE_PATH} --quiet --color`,
        },
      };
      if (options.prettier) {
        lintStagedConfig.config['**/*.{json,css,sass,scss,less,html,gql,graphql,md,yml,yaml}'] = 'prettier --check';
      }
      const success = await lintStaged(lintStagedConfig);
      if (!success) process.exit(1);
      return next();
    }

    // Async Remove unused .eslintrc files
    // Async Remove unused .prettierrc files
    await rmRcFiles(options, ctx);

    // Async overwrite .prettierrc.js file
    await readAndForceWriteRc(options, ctx);

    if (options.realtime) {
      const { ext } = options.info || {};
      // TODO: wait for webpack/rollup.. pack middleware refactor
      ctx.on('webpack.config', webpackConf => {
        webpackConf.plugins.push(
          new ESLintPlugin({
            fix: options.autoFix,
            failOnError: false,
            failOnWarning: false,
            extensions: ext,
            formatter: formatterPretty,
          }),
        );
      });
      ctx.on('rollup.config', rollupConfig => {
        if (!Array.isArray(rollupConfig.plugins)) return;
        rollupConfig.plugins.unshift(
          eslintRollup({
            fix: options.autoFix,
            throwOnError: false,
            throwOnWarning: false,
            include: ext.split(',').map(suffix => path.resolve(ctx.cwd, 'src', `**/*${suffix}`)),
            formatter: formatterPretty,
          }),
        );
      });
    } else {
      // Sync exec lint
      await execLint(options, ctx);
    }

    return next();
  };
};
