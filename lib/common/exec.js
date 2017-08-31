/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const shify = require('shify');
const os = require('os');

module.exports = function (script, options) {
  options = options || {};
  options.cwd = options.cwd || process.cwd();
  options.pty = true;
  script = script || '';
  if (os.platform() != 'win32') {
    script = `set -e ${os.EOL + script}`;
  }
  return new Promise((resolve, reject) => {
    let io = shify(script, options);
    let buffer = [];
    io.on('exit', code => {
      if (code > 0) return reject(new Error(`Script Error, exit ${code}`));
      resolve(buffer.join(''));
    });
    let output = data => {
      if (!data || data.length < 1) return;
      buffer.push(data);
      if (options.output !== false) {
        process.stdout.write(data);
      }
    };
    io.stdout.on('data', output);
    try {
      if (io.stderr) io.stderr.on('data', output);
    } catch (err) { } //eslint-disable-line
  });
};