const mock2easy = require('mock2easy');
const globby = require('globby');
const fs = require('fs');
const mkdirp = require('mkdirp');
const fetch = require('node-fetch');
const utils = require('ntils');
const path = require('path');

//start m2e
async function start() {
  return new Promise((resolve, reject) => {
    mock2easy({
      port: 39390,
      lazyLoadTime: 3000,
      database: 'mock2easy',
      doc: 'doc',
      ignoreField: [],
      interfaceSuffix: '.json',
      preferredLanguage: 'en'
    }, function (app) {
      app.listen(options.port, async (err) => {
        if (err) return reject(err);
        resolve(app);
      });
    });
  });
}

module.exports = async function (opts) {
  if (!opts || !opts.dir) return;

  //检查是否有转换源
  let m2Dir = path.resolve(process.cwd(), './mock2easy');
  if (!fs.existsSync(m2Dir)) return console.log('converted');

  //加载文件
  let files = await globby('./mock2easy/**/*.json');
  console.log(`Files`, files.length);

  //检查并创建 mock 目录
  let mockDir = path.resolve(process.cwd(), opts.dir);
  mkdirp.sync(mockDir);

  //读取文件配置
  let configItems = files.map(file => {
    let buffer = fs.readFileSync(file);
    let text = buffer.toString();
    try {
      return JSON.parse(text);
    } catch (err) {
      console.log(file);
      console.error(err.message);
      return null;
    }
  }).filter(item => !!item);
  console.log(`Read`, configItems.length);

  //启动 mock2easy
  let m2app = await start();
  console.log('Started');

  //转换为 faked 配置
  let dataItems = [];
  for (let i = 0; i < configItems.length; i++) {
    let item = configItems[i];
    if (!item.interfaceUrl) continue;
    console.log('Convert', item.interfaceUrl);
    let res = await fetch(`http://127.0.0.1:39390${item.interfaceUrl}`, {
      method: item.interfaceType
    });
    try {
      let data = await res.json()
      dataItems.push({
        id: utils.newGuid(),
        name: item.interfaceUrl.split('/').pop(),
        url: item.interfaceUrl,
        method: item.interfaceType,
        content: data,
        checked: true
      });
    } catch (err) {
      console.error(err.message);
    }
  }
  console.log(`Data`, dataItems.length);

  //写入 faked 配置
  let dataFile = `${mockDir}/gui.data.json`;
  let data = [];
  if (fs.existsSync(dataFile)) {
    let buffer = fs.readFileSync(dataFile);
    try {
      data = data.concat(JSON.parse(buffer.toString()));
    } catch (err) { }
  }
  data = data.concat(dataItems);
  fs.writeFileSync(dataFile, JSON.stringify(data, null, '  '));

  //stop m2 服务
  //m2app.stop();

  //重命名 m2 目录
  fs.rename(m2Dir, `${m2Dir}_backup`);

  console.log(`done`);

};