const path = require('path');

module.exports = function (opts) {

  opts.target = opts.target || './src/components';

  return async function (next) {
    let templateDir = path.resolve(__dirname, '../template');
    this.exec([
      {
        name: 'inquirer',
        questions: [
          {
            type: 'input',
            name: 'name',
            message: '请输入组件名称'
          }
        ]
      }, {
        name: 'copy',
        filter: true,
        override: false,
        files: {
          [opts.target+'/${answers.name}/(0)']: `${templateDir}/*.*`
        }
      }
    ]);
    next();
  };

};