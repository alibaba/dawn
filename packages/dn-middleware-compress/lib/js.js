const UglifyJS = require("uglify-js");
const Terser = require('terser')
const fs = require('mz/fs');

module.exports = async (file, opts) => {
  opts = Object.assign({}, opts);
  const compresser = opts.terser ? Terser : UglifyJS;
  const source = (await fs.readFile(file)).toString();
  const { error, code } = compresser.minify(source, opts.js);
  if (error) throw new Error(error);
  await fs.writeFile(file, code);
};