import semver from "semver";
import type { Handler } from "@dawnjs/types";
import type { IOpts } from "./types";

const handler: Handler<IOpts, string> = opts => {
  return async (next, ctx) => {
    const envOpts = JSON.parse(decodeURIComponent(process.env.DN_ARGV || "{}"));
    const versionEnv = envOpts.version || {};
    const silenceMode = !!versionEnv.silence;

    const currentVersion = ctx.project.version;

    const questions = [
      {
        name: "version",
        type: "list",
        message: "请确认将要发布的版本",
        default: currentVersion,
        choices: [
          { name: `使用当前版本(${currentVersion})`, value: currentVersion },
          { name: `新的修订版本(${semver.inc(currentVersion, "patch")})`, value: "patch" },
          { name: `新的次要版本(${semver.inc(currentVersion, "minor")})`, value: "minor" },
          { name: `新的主要版本(${semver.inc(currentVersion, "major")})`, value: "major" },
          { name: `新的预发行版本(${semver.inc(currentVersion, "prerelease")})`, value: "prerelease" },
          { name: `新的预发行修订版本(${semver.inc(currentVersion, "prepatch")})`, value: "prepatch" },
          { name: `新的预发行次要版本(${semver.inc(currentVersion, "preminor")})`, value: "preminor" },
          { name: `新的预发行主要版本(${semver.inc(currentVersion, "premajor")})`, value: "premajor" },
          new ctx.inquirer.Separator(),
          { name: "手动输入版本", value: "input" },
        ],
      },
      {
        name: "inputVersion",
        type: "input",
        message: "请输入将要发布的版本",
        when({ version }) {
          return version === "input";
        },
        filter(input) {
          return input?.trim();
        },
        validate(input) {
          if (!semver.valid(input)) {
            return "新版本号不合法";
          }
          if (semver.lt(input, currentVersion)) {
            return "新版本号不能小于当前版本号";
          }
          return true;
        },
      },
      {
        name: "preid",
        type: "input",
        message: "请输入预发行版本前缀",
        default: "alpha",
        when({ version }) {
          return ["prerelease", "prepatch", "preminor", "premajor"].includes(version);
        },
        validate(input) {
          if (!/^[a-z0-9]*$/i.test(input)) {
            return "预发行版本前缀只能包含英文字母和数字";
          }
          return true;
        },
      },
    ];

    let answers: { version?: string; inputVersion?: string; preid?: string } = {};
    if (silenceMode) {
      ctx.console.info("静默模式...", JSON.stringify(versionEnv));
      questions.forEach(({ name, default: defaultValue }) => {
        answers[name] = versionEnv[name] || defaultValue;
      });
    } else {
      answers = await ctx.inquirer.prompt(questions);
    }
    const version = answers.inputVersion || answers.version;

    if (version !== ctx.project.version) {
      const command = [`npm version ${version}`, "--allow-same-version"];
      if (opts.noGitTagVersion) {
        command.push("--no-git-tag-version");
      }
      if (opts.skitCommitHooks) {
        command.push("--no-commit-hooks");
      }
      if (answers.preid) {
        command.push(`--preid ${answers.preid}`);
      }
      await ctx.utils.exec(command.join(" "));
    }

    ctx.version = ctx.project.version;
    ctx.console.warn("版本已更新为:", ctx.project.version);

    next(ctx.project.version);
  };
};

export default handler;
