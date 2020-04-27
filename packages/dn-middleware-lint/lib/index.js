const fs = require('fs');
const path = require('path');
const getProjectInfo = require('./project');
const pkg = require('../package.json');

const ESLINTRC_FILE_PATH = '.eslintrc.yml';
const ESLINTRC_FILE_CLEAN_PATHS = ['.eslintrc.*', '!.eslintrc.yml'];
const PRETTIERRC_FILE_PATH = '.prettierrc.js';
const PRETTIERRC_FILE_CLEAN_PATHS = ['.prettierrc.*', '!.prettierrc.js'];
const PRETTIERRC_FILE_TEMPLATE = `/** !!DO NOT MODIFY THIS FILE!! */
module.exports = require('eslint-config-dawn/prettierrc');
`;

module.exports = opts => {
  const options = {
    realtime: opts.realtime === true, // default false
    autoFix: opts.autoFix !== false, // default true
  };
  return async (next, ctx) => {
    ctx.emit('lint.opts', options);
    const { extend, isTypescript, ext } = await getProjectInfo(ctx);
    let eslintrc = ctx.utils.confman.load(path.join(ctx.cwd, ESLINTRC_FILE_PATH));

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
    ctx.emit('lint.extends', eslintrc.extends);

    if (eslintrc.rules) {
      // TODO: some complex logic to merge
      delete eslintrc.rules;
    }
    ctx.emit('lint.rules', eslintrc.rules);
    ctx.emit('lint.env', eslintrc.env);
    ctx.emit('lint.globals', eslintrc.globals);
    ctx.emit('lint.plugins', eslintrc.plugins);
    if (isTypescript && (!eslintrc.parserOptions || !eslintrc.parserOptions.project)) {
      ctx.console.info('Typescript/TypescriptReact project needs "tsconfig.json".');
      ctx.console.info('Try `npx tsc --init` to generate.');
      eslintrc.parserOptions = {
        ...(eslintrc.parserOptions || {}),
        project: './tsconfig.json',
      };
    }
    ctx.emit('lint.parserOptions', eslintrc.parserOptions);

    // Sync Overwrite
    const eslintrcYaml = ctx.utils.yaml.stringify(eslintrc);
    await ctx.utils.writeFile(path.join(ctx.cwd, ESLINTRC_FILE_PATH), `# !!DO NOT MODIFY THIS FILE!!\n${eslintrcYaml}`);

    const eslint = ctx.utils.findCommand(__dirname, 'eslint');
    const prettier = ctx.utils.findCommand(__dirname, 'prettier');

    if (options.realtime) {
      // Do something
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
