import simpleGit from "simple-git";
import type { Handler } from "@dawnjs/types";
import type { IOpts } from "./types";

const handler: Handler<IOpts> = opts => {
  return async (next, ctx) => {
    const git = simpleGit({ baseDir: ctx.cwd });

    ctx.console.log("更新默认远程仓库信息...");
    await git.fetch(["--prune"]);

    ctx.console.log("检查已改变未提交的文件...");
    const statusResult = await git.status();

    if (statusResult.isClean()) {
      ctx.console.log("无文件变更");
    } else {
      ctx.console.info(`发现 ${statusResult.files.length} 个文件变更:`);
      ctx.console.table(
        statusResult.files.map(file => ({
          type: file.working_dir,
          file: file.path,
        })),
      );
      const answer = opts.silence
        ? {
            message: opts.message || opts.silence,
          }
        : await ctx.inquirer.prompt([
            {
              name: "message",
              type: "input",
              message: "请输入提交信息",
              validate: value => !!value,
            },
          ]);
      await git.add(".");
      await git.commit(answer.message);
    }

    if (statusResult.tracking && statusResult.behind) {
      ctx.console.log(`落后 ${statusResult.tracking} 分支共 ${statusResult.behind} 个提交，拉取最新提交...`);
      await git.pull({ "--rebase": "true" });
    }
    ctx.console.log("合并远程主干");
    await git.pull("origin", "master");
    if (statusResult.tracking) {
      ctx.console.log(`推送到当前分支对应的远程分支 ${statusResult.tracking}`);
      await git.push(["-u"]);
    } else {
      ctx.console.log(`创建并推送到远程分支 origin ${statusResult.current}`);
      await git.push(["-u", "origin", statusResult.current]);
    }

    next();
  };
};

export default handler;
