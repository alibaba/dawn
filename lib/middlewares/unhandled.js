/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

module.exports = async function () {
  this.console.warn(
    [`Unable to process command: ${this.cli.get('command')}`].join(' ')
  );
};