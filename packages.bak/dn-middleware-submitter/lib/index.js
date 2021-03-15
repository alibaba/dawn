const simpleGit = require('simple-git/promise');

module.exports = function (opts) {

  opts = Object.assign({ silence: false }, opts);

  async function checkChanges(ctx) {
    ctx.console.log('检查已改变未提交的文件');
    const git = simpleGit(ctx.cwd);
    const status = await git.status();
    const checked = status.files.length > 0;
    if (checked && !opts.silence) {
      ctx.console.info(`发现 ${status.files.length} 个文件变更:`);
      ctx.console.table(status.files.map(file => ({
        type: file.working_dir,
        file: file.path
      })));
    }
    return checked;
  }

  async function commitChanges(ctx) {
    const answer = opts.silence ? {
      message: opts.message || opts.silence
    } : await ctx.inquirer.prompt([{
      name: 'message', type: 'input',
      message: '请输入提交信息([类型] 提交信息)',
      validate: value => !!value
    }]);
    const git = simpleGit(ctx.cwd);
    await git.add('.');
    await git.commit(answer.message);
  }

  async function syncChanges(ctx) {
    const git = simpleGit(ctx.cwd);
    ctx.console.log('拉取当前分支对应的远程分支');
    await git.pull();
    ctx.console.log('拉取远程主干分支');
    await git.pull('origin', 'master');
    ctx.console.log('同步到当前分支对应的远程分支');
    await git.push(['-u']);
  }

  async function checkAnySync(ctx, alwaysSync) {
    const checked = await checkChanges(ctx);
    if (checked) await commitChanges(ctx);
    if (checked || alwaysSync) await syncChanges(ctx);
  }

  return async function (next, ctx) {
    await checkAnySync(ctx, true);
    await checkAnySync(ctx, false);
    next();
  };

};