const path = require('path');

/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {

  opts.timeout = opts.timeout || 10000;
  opts.env = opts.env || 'browser';
  if (!opts.files) {
    opts.files = opts.env === 'typescript' ?
      './test/unit/**/*.ts' : './test/unit/**/*.js';
  }
  if (!opts.extension) {
    opts.extension = opts.env === 'typescript' ? '.ts' : '.js';
  }

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {

    //mocha 执行文件路径
    const nyc = this.utils.findCommand(__dirname, 'nyc');
    const mocha = this.utils.findCommand(__dirname, 'mocha');
    const setup = path.resolve(__dirname, `./setups/_${opts.env}.js`);

    const excludes = [
      '**/_*.js',
      'coverage/**',
      'test/**',
      'test{,-*}.js',
      '**/*.test.js',
      '**/__tests__/**',
      "**/*.spec.js",
      "build", "dist",
      '**/node_modules/**',
      '**/*.d.ts',
    ].map(item => `'${item}'`).join(' -x ');

    this.console.info('开始执行单元测试...');
    //tnpm i babel-runtime
    /* eslint-disable */
    await this.utils.exec(`
      ${nyc} -r html -r text -r json-summary -e ${opts.extension} -x ${excludes} ${mocha} -r ${setup} -t ${opts.timeout} -u bdd ${opts.files} 
      echo 
      echo ------------------------------------------------------------------------
      echo ./coverage/index.html
      echo ------------------------------------------------------------------------
      echo 
    `);
    /* eslint-enable */
    this.console.info('完成');

    next();

  };

};