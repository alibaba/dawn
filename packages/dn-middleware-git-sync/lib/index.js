const fs = require('fs');

const DELAY = 2000;

/**
 * 这是一个标准的中间件工程模板
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function () {

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {

    //如果旧版本，没有 prompt 提示升及
    if (!this.utils.prompt) {
      return this.console.error('请通过 tnpm i @ali/dbl-next -g 升级 cli，才能继续发布');
    }

    //读取 json 文件
    let readJson = async(file) => {
      if (!fs.existsSync(file)) return {};
      let text = await this.utils.readFile(file);
      return JSON.parse(text);
    };

    let pkgFile = `${this.cwd}/package.json`;
    let pkg = await readJson(pkgFile);

    //执行 shell
    let exec = async(script) => {
      return await this.utils.exec(script, {
        params: pkg
      });
    };

    //获取版本信息
    let calcVersion = async() => {
      let result = await this.inquirer.prompt([{
        name: 'version',
        type: 'input',
        default: pkg.version,
        message: '请输入版本',
        validate: function (version) {
          return !!version;
        }
      }]);
      pkg.version = result.version;
      await this.utils.writeFile(pkgFile, JSON.stringify(pkg, null, '  '));
      return pkg.version;
    };

    //检查是否有变更
    let hasChangeFiles = async() => {
      let text = await exec('git status');
      return /(modified|new\s+file|deleted|Untracked\s+files)\:/ig.test(text);
    };

    //提交未提交的变更
    let commit = async(env, version) => {
      this.console.info('提交变更文件...');
      let message = `[${env}] ${version}`;
      let result = await this.inquirer.prompt([{
        name: 'message',
        type: 'input',
        default: message,
        message: '请输入提交信息',
        validate: function (message) {
          return !!message;
        }
      }]);
      await exec(`
        set -e
        git add .
        git commit -m '${result.message}'
      `);
    };

    //同步当前分支
    let syncFiles = async() => {
      this.console.info('同步当前分支...');
      await exec(`
        set -e
        git config --global push.default simple
        git pull --rebase origin master 
        current=\`git branch | grep \\* | cut -d ' ' -f2\`
        git push -u -f origin $current:$current
      `);
    };

    //发到预发
    let prepub = async() => {
      this.console.info('发布到预发...');
      let branch = `daily/${pkg.version}`;
      await exec(`
        set -e
        current=\`git branch | grep \\* | cut -d ' ' -f2\`
        git push -f origin $current:${branch}
      `, {
        template: false
      });
    };

    //发到线上
    let release = async() => {
      // this.console.warn('注意事项:');
      // this.console.warn(`请确认已经发布了同版本号的 daily 版本，否则前端资源发布平台会失败`);
      // let result = await this.inquirer.prompt([{
      //   name: 'confirm',
      //   type: 'input',
      //   default: 'yes',
      //   message: '请确认以注意事项'
      // }]);
      // if (result.confirm != 'yes') return;
      this.console.info('发布到线上...');
      let tag = `publish/${pkg.version}`;
      await exec(`
        set -e
        git tag ${tag}
        git push -f origin ${tag}
        git tag -d ${tag}
      `);
    };

    //获取参数传递或用户选择的环境
    let env = this.env || await this.utils.prompt.pick({
      message: '请选择发布环境',
      items: [{
        name: '日常环境',
        value: 'prepub'
      }, {
        name: '线上环境',
        value: 'release'
      }]
    });

    let version = await calcVersion();
    if (await hasChangeFiles()) await commit(env, version);
    await syncFiles();

    switch (env) {
      case 'prepub':
      case 'daily':
      case 'dev':
        await prepub();
        break;
      case 'release':
      case 'prod':
      case 'production':
        this.console.info('发布线时版本时，将自动同时发到预发');
        await prepub();
        await this.utils.sleep(5000);
        await release();
        break;
      default:
        this.console.warn('没有指定任何发布环境');
    }

    this.console.info('完成');
    next();

  };

};