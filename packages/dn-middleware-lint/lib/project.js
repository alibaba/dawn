const globby = require('globby');

const getProjectInfo = async ctx => {
  let extend = 'dawn/standard';
  let ext = '.js,.jsx';
  let isReact = false;
  if (ctx.project && ctx.project.version) {
    const pkg = ctx.project;
    if (pkg.dependencies && pkg.dependencies.react) isReact = true;
    if (pkg.devDependencies && pkg.devDependencies.react) isReact = true;
    if (pkg.peerDependencies && pkg.peerDependencies.react) isReact = true;
  } else {
    isReact = true;
  }
  let isTypescript = false;
  const tsFiles = await globby(['./**/*.ts', './**/*.tsx', '!./**/*.d.ts', '!node_modules'], {
    onlyFiles: true,
    gitignore: true,
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

module.exports = getProjectInfo;
