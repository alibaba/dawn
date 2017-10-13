var locales = require('$locales');
var utils = require('ntils');

function i18n() {
  var self = i18n;
  return self.get.apply(self, arguments);
}

i18n.locale = {};

i18n.get = function (key, params, defaultValue) {
  var text = this.locale[key] || defaultValue || key || '';
  utils.each(params, function (name, value) {
    text = text.replace(new RegExp('\{' + name + '\}', 'gm'), value || '');
  });
  return text;
}

i18n.getLocale = function (name) {
  if (!name) return;
  return locales[name] ||
    locales[name.split('_')[0]] ||
    utils.each(locales, function (key) {
      if (key.split('_')[0] == name.split('_')[0]) {
        return locales[key];
      }
    });
}

i18n.init = function (opts) {
  opts = opts || {};
  var currentLang = opts.language || opts.lang;
  var defaultLang = opts.default || 'zh_CN';
  this.locale = this.getLocale(currentLang) ||
    this.getLocale(defaultLang) || {};
};

i18n.init();

module.exports = i18n;