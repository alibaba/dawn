require('babel-core/register')({
  babelrc: true,
  presets: [
    require.resolve('babel-preset-es2015'),
    require.resolve('babel-preset-stage-0')
  ],
  plugins: [
    require.resolve('babel-plugin-add-module-exports'),
    require.resolve('babel-plugin-typecheck'),
    require.resolve('babel-plugin-transform-decorators-legacy')
  ]
});
require('babel-polyfill');

//--------------------------

const utils = require('ntils');
const webdriver = require('selenium-webdriver');
const phantomjs = require('phantomjs-prebuilt');
//const chromedriver = require('chromedriver');
const fs = require('fs');
const chai = require('chai');
const assert = require('assert');

const BROWSER = process.env.WEB_DRIVER_BROWSER;
let driver;

if (BROWSER && BROWSER != 'none') {
  require('selenium-webdriver/chrome')
  require('chromedriver')
  driver = new webdriver.Builder().
    withCapabilities(webdriver.Capabilities.chrome()).
    build();
} else {
  let capabilities = webdriver.Capabilities.phantomjs();
  capabilities.set('phantomjs.binary.path', phantomjs.path);
  driver = new webdriver.Builder().
    withCapabilities(capabilities).
    build();
}

driver.manage().window().maximize();

global.driver = driver;
global.by = webdriver.By;
global.By = global.by;
global.until = webdriver.until;
global.open = driver.get.bind(driver);
global.findElement = driver.findElement.bind(driver);
global.wait = driver.wait.bind(driver);

by.text = function (text) {
  return by.xpath(`//*[text()="${text}"]`);
};

global.assert = assert;
global.chai = chai;
global.expect = chai.expect;
global.utils = utils;

function writeFile(filename, buffer, encodeing) {
  return new Promise((resolve, reject) => {
    require('fs').writeFile(filename, buffer, encodeing, function (err) {
      if (err) return reject(err);
      resolve(filename);
    });
  });
}

driver.writeFile = writeFile;
driver.saveScreenshot = async function (filename) {
  let image = await driver.takeScreenshot();
  await writeFile(filename, image, 'base64');
};