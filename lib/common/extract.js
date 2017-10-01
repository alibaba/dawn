/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const decompress = require('decompress');
const decompressTargz = require('decompress-targz');
const utils = require('ntils');
const stream2buffer = require('./stream2buffer');
const debug = require('debug')('decompress');

module.exports = async function (compressFile, dist, sliceIndex) {
  sliceIndex = sliceIndex || 0;
  compressFile = utils.isString(compressFile) ?
    compressFile : await stream2buffer(compressFile);
  debug('decompress', compressFile, dist);
  return decompress(compressFile, dist, {
    plugins: [
      decompressTargz()
    ],
    map: file => {
      file.path = file.path.split('/').slice(sliceIndex).join('/');
      return file;
    }
  });
};