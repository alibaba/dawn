const path = require('path');
const { rmRcFiles, readAndForceWriteRc, eslintignore, editorconfig, getProjectInfo } = require('./core');
const pkg = require('../package.json');

// Change post-install hook CWD to project.
// May not work in some cases.
const projectCWD = process.env.INIT_CWD || process.cwd().replace(/\/node_modules\/.+$/, '');

(async () => {
  if (!projectCWD) return;
  const porjectPkg = require(path.join(projectCWD, './package.json'));
  const options = {
    // fake option
    realtime: false,
    autoFix: false,
    staged: false,
    prettier: false,
    cwd: projectCWD,
    project: porjectPkg,
  };
  // Project package.json
  options.info = await getProjectInfo(options);

  // Sync add .editorconfig and .eslintignore
  // Sync rm ununsed rc files
  // Sync add .eslintrc.yml and .prettierrc.js file
  await Promise.all([eslintignore(options), editorconfig(options), rmRcFiles(options), readAndForceWriteRc(options)]);
})();
