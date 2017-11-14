const path = require('path');
const utils = require('ntils');
const globby = require('globby');
const mkdirp = require('mkdirp');
const tp = require('tpjs');

/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {

  opts.from = opts.from || './';
  opts.to = opts.to || './';
  opts.files = opts.files || {};

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {

    this.console.info('Copy files...');
    //初始位置
    let from = path.resolve(this.cwd, opts.from);
    let to = path.resolve(this.cwd, opts.to);

    //解析目标文件名
    let parseDstFile = (srcFile, dstExpr) => {
      let srcPaths = srcFile.split('/').reverse();
      let filename = srcPaths[0];
      srcPaths[0] = path.basename(filename, path.extname(filename));
      let dstPath = dstExpr.replace(/\((\d+)\)/g, (str, index) => {
        return srcPaths[index];
      });
      let extname = path.extname(srcFile).slice(1);
      dstPath = dstPath.replace(/\(ext\)/ig, extname);
      return path.normalize(`${to}/${dstPath}`);
    };

    let filterContent = async buffer => {
      if (!buffer) return buffer;
      if (utils.isString(opts.filter)) {
        let filterFile = path.resolve(this.cwd, opts.filter);
        return await require(filterFile).call(this, buffer, this);
      } else if (opts.filter) {
        let text = buffer.toString();
        return tp.parse(text, this);
      } else {
        return buffer;
      }
    };

    //复制一个文件
    let copyFile = async (srcFile, dstExpr) => {
      let dstFile = parseDstFile(srcFile, dstExpr);
      let dstDir = path.dirname(dstFile);
      await mkdirp(dstDir);
      let srcBuffer = await this.utils.readFile(srcFile);
      let dstBuffer = await filterContent(srcBuffer);
      await this.utils.writeFile(dstFile, dstBuffer);
      let trimPath = `${this.cwd}/`;
      this.console.log('copy:', [
        srcFile.replace(trimPath, ''),
        dstFile.replace(trimPath, '')
      ].join(' -> '));
    };

    //按单条规则 copy
    let copyItem = async (srcExpr, dstExpr) => {
      let srcFiles = await globby(srcExpr, { cwd: from });
      return Promise.all(srcFiles.map(srcFile => {
        srcFile = path.resolve(from, srcFile);
        return copyFile(srcFile, dstExpr);
      }));
    };

    //执行复制
    let pendings = [];
    utils.each(opts.files, (dstExpr, srcExpr) => {
      pendings.push(copyItem(srcExpr, dstExpr));
    });
    await Promise.all(pendings);

    this.console.info('Done');

    //next 触发后续执行
    //如果需要在后续中间件执行完成再做一些处理
    //还可以 await next(); 并在之后添加逻辑
    next();

  };

};
