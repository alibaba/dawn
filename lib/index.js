/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 */

const requireDir = require('require-dir');

exports.configs = require('./configs');
exports.template = require('./template');
exports.middleware = require('./middleware');
exports.Context = require('./context');
exports.common = requireDir('./common');
exports.commands = requireDir('./commands');
exports.middlewares = requireDir('./middlewares');