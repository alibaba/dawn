/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const fs = require('fs');
const path = require('path');

function findCommand(dirname, command) {
  const commandPath = path.normalize(
    `${dirname}/node_modules/.bin/${command}`
  );
  if (fs.existsSync(commandPath)) return commandPath;
  if (dirname == '/' || dirname == '.' || /^[a-z]\:\/\/$/i.test(dirname)) {
    return;
  }
  return findCommand(path.dirname(dirname), command);
}

module.exports = findCommand;