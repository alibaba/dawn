/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const requireDir = require('require-dir');

exports.configs = require('./configs');
exports.template = require('./template');
exports.middleware = require('./middleware');
exports.mod = require('./mod');
exports.Context = require('./context');
exports.cache = require('./cache');
exports.upgrade = require('./upgrade');

exports.common = requireDir('./common');
exports.commands = requireDir('./commands');
exports.middlewares = requireDir('./middlewares');