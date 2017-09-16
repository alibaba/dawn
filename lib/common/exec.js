/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const shify = require('shify');
const debug = require('debug')('exec');

module.exports = function (script, options) {
  options = options || {};
  options.cwd = options.cwd || process.cwd();
  script = script || '';
  return new Promise((resolve, reject) => {
    let io = shify(script, options);
    io.on('exit', code => {
      if (code > 0) return reject(new Error(`Script Error, exit ${code}`));
      resolve(io);
    });
    io.stdout.pipe(process.stdout);
    try {
      io.stderr.pipe(process.stderr);
    } catch (err) {
      debug(err.message);
    }
  });
};