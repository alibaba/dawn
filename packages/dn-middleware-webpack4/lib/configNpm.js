/*
 * @File: XXX
 * @Author: 沣睿
 * @Date: 2019-07-11
*/



const dependencyMap = {
  useEslint: 'eslint-loader',
  supportTS: 'ts-loader',
}


function getDependcies(opts) {
  const initDependencies = opts.useSass === false ? [] : ['fast-sass-loader', 'node-sass']; // sass单独先提出来，由于默认是安装的
  let dependencies = [];
  Object.keys(opts).length > 0 && Object.keys(opts).forEach((item, index) => {
    if (dependencyMap[item] && !!opts[item]) {
      dependencies.push(dependencyMap[item]);
    }
  });
  return initDependencies.concat(dependencies);
}

module.exports = {
  getDependcies
}
