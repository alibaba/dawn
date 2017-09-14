/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const mod = require('./mod');
const pkg = require('../package');
const console = require('console3');

exports.check = async function () {
  let info = await mod.getVersionInfo(pkg.name);
  console.log(info.version);
};