const CleanCSS = require('clean-css');
const fs = require('mz/fs');

const cleanCss = new CleanCSS();

module.exports = async (file) => {
  const source = (await fs.readFile(file)).toString();
  const { errors, styles } = cleanCss.minify(source);
  if (errors && errors[0]) throw new Error(errors[0]);
  await fs.writeFile(file, styles);
};