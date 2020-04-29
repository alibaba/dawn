const { rmRcFiles, readAndForceWriteRc, execLint, eslintignore, editorconfig } = require('./core');

module.exports = () => {
  const options = {
    realtime: false,
    autoFix: true,
    staged: false,
  };
  return async (next, ctx) => {
    // Sync add .editorconfig and .eslintignore
    // Sync rm ununsed rc files
    // Sync add .eslintrc.yml and .prettierrc.js file
    await Promise.all([
      eslintignore(options, ctx),
      editorconfig(options, ctx),
      rmRcFiles(options, ctx),
      readAndForceWriteRc(options, ctx),
    ]);
    await next();
    // Execute lint
    await execLint(options, ctx);
  };
};
