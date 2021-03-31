/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const configs = require('../configs');
const console = require('../common/console');
const prompt = require('../common/prompt');
const inquirer = require('inquirer');
const pkg = require('../../package');
const debug = require('debug')('cmd:config');
const store = require('../store');

const SUPPORTED_CONFIG_NAMES = [{
  value: 'server',
  name: 'server   : remote config server URL'
}, {
  value: 'registry',
  name: 'registry : NPM registry URL'
}, {
  value: 'npm',
  name: 'npm      : NPM CLI (npm/cnpm)'
}, {
  value: 'cache',
  name: 'cache    : Maximum cache milliseconds'
}];

const MAX_HISTORY_NUM = 10;

async function inputValue() {
  const result = await inquirer.prompt([{
    name: 'value',
    type: 'input',
    message: 'Please enter the config value:'
  }]);
  return result && result.value;
}

async function getValues(name) {
  const currentValue = await configs.getLocalRc(name);
  const defaultValue = pkg.configs[name];
  let list = [{
    name: 'Enter a new config value',
    value: '#'
  }, {
    name: `current : ${currentValue}`,
    value: currentValue
  }];
  if (defaultValue !== currentValue) {
    list.push({
      name: `default : ${defaultValue}`,
      value: defaultValue
    });
  }
  const historyValues = (await configs.getLocalConf(name, []))
    .filter(value => value !== currentValue && value !== defaultValue)
    .map(value => ({ value: value, name: `history : ${value}` }));
  list = list.concat(historyValues);
  debug('values', name, list);
  return list;
}

async function pickValue(name) {
  const list = await getValues(name);
  let result = await prompt.pick({
    message: 'Please enter or select config value',
    choices: list
  });
  if (result == '#') result = await inputValue();
  return result;
}

async function pickName() {
  return await prompt.pick({
    message: 'Please select the config name',
    choices: SUPPORTED_CONFIG_NAMES
  });
}

async function saveHistory(name, value) {
  let historys = await configs.getLocalConf(name, []);
  historys = historys.filter(item => item && item !== value);
  if (value) historys.unshift(value);
  if (historys.length > MAX_HISTORY_NUM) historys.pop();
  configs.setLocalConf(name, historys);
}

module.exports = async function () {
  let name = this.get('$1') || '';
  let value = this.get('$2') || '';
  if (name && !SUPPORTED_CONFIG_NAMES
    .some(item => item && item.value == name)) {
    return console.error(`Unsupported config name '${name}'`);
  }
  if (!name) name = await pickName();
  if (!value) value = await pickValue(name);
  await saveHistory(name, value);
  console.info(`Saved config ${name}=${value}`);
  configs.setLocalRc(name, value);
  await Promise.all([
    store.clean('stamps'),
    store.clean('caches')
  ]);
};