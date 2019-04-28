/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const console = require('../common/console');
const store = require('../store');
const mod = require('../mod');
const Context = require('../context');
const middleware = require('../middleware');
const _ = require('lodash');
module.exports = async function () {
  console.info('Updating...');
  await Promise.all([
    store.clean('stamps'),
    store.clean('caches'),
    store.clean('modules'),
    mod.clean()
  ]);
  const context = new Context(this);
  const { pipe: config } = await context.loadLocalConfigs();
  let list = [];
  for (const key in config) {
    if (config.hasOwnProperty(key)) {
      const element = config[key];
      list = list.concat(element);
    }
  }
  console.info('Updating middlewares...');
  let filterList = list.filter(item => !item.location);
  filterList = _.uniqBy(filterList, 'name');
  for (const iterator of filterList) {
    await middleware.require(iterator.name, this.cwd, {
      update: true
    });
  }
  console.info('Updating middlewares Done');
  await mod.install();
  console.info('Done');
};