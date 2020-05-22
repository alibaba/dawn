module.exports.EDITOR_CONFIG_FILE_PATH = '.editorconfig';
module.exports.ESLINTRC_FILE_PATH = '.eslintrc.yml';
module.exports.ESLINTRC_FILE_CLEAN_PATHS = ['.eslintrc', '.eslintrc.*', '!.eslintrc.yml'];
module.exports.ESLINT_IGNORE_FILE_PATH = '.eslintignore';
module.exports.GIT_IGNORE_FILE_PATH = '.gitignore';
module.exports.PRETTIERRC_FILE_PATH = '.prettierrc.js';
module.exports.PRETTIERRC_FILE_CLEAN_PATHS = ['.prettierrc', '.prettierrc.*', '!.prettierrc.js'];
module.exports.PRETTIERRC_FILE_TEMPLATE = `/** !!DO NOT MODIFY THIS FILE!! */
module.exports = require('eslint-config-dawn/prettierrc');
`;
module.exports.ESLINT_IGNORE_FILE_TEMPLATE = `# Feel free to change this file
node_modules
build
dist
`;
module.exports.EDITOR_CONFIG_FILE_TEMPLATE = `# EditorConfig is awesome: http://EditorConfig.org
# Feel free to change this file

root = true
[*]
indent_style = space
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
end_of_line = lf
# editorconfig-tools is unable to ignore longs strings or urls
max_line_length = off

[*.md]
indent_size = false
trim_trailing_whitespace = false
`;
