import { editorconfig, eslintignore, getProjectInfo, prepareDeps, readAndForceWriteRc, rmRcFiles } from "./core";

// Change post-install hook CWD to project.
// May not work in some cases.
const cwd = process.env.INIT_CWD || process.cwd().replace(/\/node_modules\/.+$/, "");

(async () => {
  if (!cwd) {
    return;
  }
  // Project package.json
  const projectInfo = await getProjectInfo(cwd);

  // Sync add .editorconfig and .eslintignore
  // Sync rm ununsed rc files
  // Sync add .eslintrc.yml and .prettierrc.js file
  await Promise.all([
    eslintignore(cwd),
    editorconfig(cwd),
    rmRcFiles({ console, cwd }),
    readAndForceWriteRc({ console, cwd, projectInfo }),
    prepareDeps({ cwd, projectInfo }),
  ]);
})();
