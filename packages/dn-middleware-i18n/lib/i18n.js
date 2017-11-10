var locales = require('$locales');
var utils = require('ntils');

function i18n() {
  return i18n.get.apply(i18n, arguments);
}

i18n.locale = {};

i18n.get = function (key, params, defaultValue) {
  if (utils.isString(params)) {
    defaultValue = [params, params = defaultValue][0];
  }
  var text = this.locale[key] || defaultValue;
  text = utils.isNull(text) ? key : text;
  utils.each(params, function (name, value) {
    text = text.replace(new RegExp('\{' + name + '\}', 'gm'), value || '');
  });
  return text;
}

i18n.getLocale = function (name) {
  if (!name) return;
  return locales[name] ||
    locales[name.split('-')[0]] ||
    utils.each(locales, function (key) {
      if (key.split('-')[0] == name.split('-')[0]) {
        return locales[key];
      }
    });
}

i18n.init = function (opts) {
  opts = opts || {};
  var currentLang = opts.language || '';
  var defaultLang = opts.defaultLanguage || 'zh-CN';
  this.locale = this.getLocale(currentLang) ||
    this.getLocale(defaultLang) || {};
};

i18n.init();

module.exports = i18n;