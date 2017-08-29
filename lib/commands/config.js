/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 */

const configs = require('../configs');
const console = require('console3');
const prompt = require('../common/prompt');
const inquirer = require('inquirer');
const pkg = require('../../package');
const debug = require('debug')('cmd:config');
const store = require('../common/store');

const SUPPORTED_CONFIG_NAMES = [
  {
    value: 'server',
    name: 'server   : remote configuration server URL',
    items: [pkg.configs.server]
  },
  {
    value: 'registry',
    name: 'registry : NPM registry URL',
    items: [pkg.configs.registry]
  },
  {
    value: 'cacheTTL',
    name: 'cacheTTL : Maximum cache milliseconds',
    items: [pkg.configs.cacheTTL]
  }
];

const MAX_HISTORY_NUM = 10;

async function inputValue() {
  let result = await inquirer.prompt([{
    name: 'value',
    type: 'input',
    message: 'Please enter the configuration value:'
  }]);
  return result.value;
}

async function pickValue(name) {
  let historys = await configs.getLocalConf(name, []);
  //if (historys.length < 1) return inputValue();
  let list = [{
    name: 'Enter a new configuration value',
    value: '#'
  }];
  let defaultItems = SUPPORTED_CONFIG_NAMES
    .find(item => item.value == name).items;
  debug('defaultItems', defaultItems);
  list = list.concat(defaultItems.map(value => (
    { value: value, name: `default : ${value}` }
  )));
  list = list.concat(historys.map(value => (
    { value: value, name: `history : ${value}` }
  )));
  let result = await prompt.pick({
    message: 'Please enter or select configuration value',
    choices: list
  });
  if (result == '#') result = await inputValue();
  return result;
}

async function pickName() {
  return await prompt.pick({
    message: 'Please select the configuration name',
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
  if (name && !SUPPORTED_CONFIG_NAMES.some(item => item.value == name)) {
    return console.error(`Unsupported configuration name '${name}'`);
  }
  if (!name) name = await pickName();
  if (!value) value = await pickValue(name);
  await saveHistory(name, value);
  console.info(`Saved configuration ${name}=${value}`);
  configs.setLocalRc(name, value);
  await store.clean('configs/remote');
};