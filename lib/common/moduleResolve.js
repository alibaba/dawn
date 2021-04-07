const fs = require('fs');
const path = require('path');
const debug = require('debug')('utils');
const Module = require('module');
const assert = require('assert');

module.exports = function (cwd, id) {
  assert(typeof cwd === 'string', 'cwd must be string');
  assert(typeof id === 'string', 'id must be string');

  const paths = Module._nodeModulePaths(cwd); // Use internal api to get module paths list from `cwd`
  for (let i = 0; i < paths.length; i++) {
    const pkgPath = path.join(paths[i], id);
    debug(pkgPath);
    if (fs.existsSync(pkgPath)) {
      return pkgPath;
    }
  }
  debug('No path resolved');
  return undefined;
}
