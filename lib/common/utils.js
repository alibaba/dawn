/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const utils = require('ntils');
const exec = require('./exec');
const writeFile = require('./writefile');
const readFile = require('./readfile');
const mkdirp = require('./mkdirp');
const del = require('del');
const download = require('./download');
const sleep = require('./sleep');
const prompt = require('./prompt');
const mod = require('../mod');
const open = require('opn');
const oneport = require('./oneport');
const fetch = require('node-fetch');
const stp = require('stp');
const yaml = require('./yaml');
const trim = require('./trim');

utils.exec = exec;
utils.writeFile = writeFile;
utils.readFile = readFile;
utils.del = del;
utils.mkdirp = mkdirp;
utils.download = download;
utils.sleep = sleep;
utils.prompt = prompt;
utils.npm = mod;
utils.mod = mod;
utils.open = open;
utils.oneport = oneport;
utils.fetch = fetch;
utils.stp = stp;
utils.yaml = yaml;
utils.trim = trim;

module.exports = utils;