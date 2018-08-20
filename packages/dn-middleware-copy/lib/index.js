const path = require('path');
const utils = require('ntils');
const globby = require('globby');
const tp = require('tpjs');
const fs = require('fs');

/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {

  opts.from = opts.from || './';
  opts.to = opts.to || './';
  opts.files = opts.files || {};
  opts.log = opts.log !== false;

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {

    if (opts.log) this.console.info('Copy files...');
    //初始位置
    const from = path.resolve(this.cwd, path.normalize(opts.from));
    const to = path.resolve(this.cwd, path.normalize(opts.to));

    //解析目标文件名
    const parseDstFile = (srcFile, dstExpr, srcExpr) => {
      const pathSpliter = path.normalize('/');
      if (dstExpr.endsWith(pathSpliter)) {
        const srcDir = srcExpr.slice(0, srcExpr.indexOf('*'));
        const trimedSrcFile = srcFile.replace(path.resolve(from, srcDir), '');
        const dstFile = path.normalize(`${dstExpr}${trimedSrcFile}`);
        return path.resolve(to, dstFile);
      } else {
        let srcPaths = srcFile.split(pathSpliter).reverse();
        let filename = srcPaths[0];
        srcPaths[0] = path.basename(filename, path.extname(filename));
        let dstFile = dstExpr.replace(/\((\d+)\)/g, (str, index) => {
          return srcPaths[index];
        });
        let extname = path.extname(srcFile).slice(1);
        dstFile = dstFile.replace(/\(ext\)/ig, extname);
        return path.normalize(path.resolve(to, dstFile));
      }
    };

    const filterContent = async buffer => {
      if (!buffer) return buffer;
      if (utils.isString(opts.filter)) {
        const filterFile = path.resolve(this.cwd, opts.filter);
        return await require(filterFile).call(this, buffer, this);
      } else if (opts.filter) {
        const text = buffer.toString();
        return tp.parse(text, this);
      } else {
        return buffer;
      }
    };

    //复制一个文件
    const copyFile = async (srcFile, dstExpr, srcExpr) => {
      srcFile = path.normalize(srcFile);
      let dstFile = parseDstFile(srcFile, dstExpr, srcExpr);
      if (fs.existsSync(dstFile) && opts.override === false) return;
      let dstDir = path.dirname(dstFile);
      await this.utils.mkdirp(dstDir);
      let srcBuffer = await this.utils.readFile(srcFile);
      let dstBuffer = await filterContent(srcBuffer);
      await this.utils.writeFile(dstFile, dstBuffer);
      let trimPath = path.normalize(`${this.cwd}/`);
      if (opts.log) this.console.log('copy:', [
        srcFile.replace(trimPath, ''),
        dstFile.replace(trimPath, '')
      ].join(' -> '));
    };

    //按单条规则 copy
    const copyItem = async (srcExpr, dstExpr) => {
      const srcFiles = await globby(srcExpr, { cwd: from });
      return Promise.all(srcFiles.map(srcFile => {
        srcFile = path.resolve(from, srcFile);
        return copyFile(srcFile, dstExpr, srcExpr);
      }));
    };

    //执行复制，因为需兼容老版本，默认方向是 <-
    const pendings = [];
    utils.each(opts.files, (dstExpr, srcExpr) => {
      if (opts.direction == '->') {
        pendings.push(copyItem(dstExpr, srcExpr));
      } else {
        pendings.push(copyItem(srcExpr, dstExpr));
      }
    });
    await Promise.all(pendings);

    if (opts.log) this.console.info('Done');
    next();
  };
};