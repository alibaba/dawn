const UglifyJS = require("uglify-js");
const fs = require('mz/fs');

module.exports = async (file, opts) => {
  const source = (await fs.readFile(file)).toString();
  const { error, code } = UglifyJS.minify(source, opts);
  if (error) throw new Error(error);
  await fs.writeFile(file, code);
};