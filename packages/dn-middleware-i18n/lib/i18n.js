var utils = require('ntils');
var locales = require('$locales');
var opts = require('$i18n_opts');

function i18n() {
  return i18n.get.apply(i18n, arguments);
}

i18n.locale = {};
i18n.expressions = {};

i18n.get = function (key, params, defaultValue) {
  if (utils.isString(params)) {
    defaultValue = [params, params = defaultValue][0];
  }
  if (utils.isNull(defaultValue)) defaultValue = key;
  if (!key || !utils.isString(key) || utils.isNull(this.locale[key])) {
    return defaultValue;
  }
  return this.parse(this.locale[key], params || {});
}

i18n.compile = function (expr) {
  if (!expr || !utils.isString(expr)) return;
  if (!this.expressions[expr]) {
    this.expressions[expr] = new Function(
      '$scope',
      'with($scope||{}){try{return(' + expr + ')}catch(err){return ""}}'
    );
  }
  return this.expressions[expr];
}

i18n.isStrArray = function (list) {
  for (var i in list) {
    var item = list[i];
    if (!utils.isString(item)) return false;
  }
  return true;
}

i18n.parse = function (text, params) {
  var info = text.split(/\{(.*?)\}/);
  for (var i = 1; i <= info.length; i += 2) {
    if (!info[i]) continue;
    var func = this.compile(info[i]);
    if (!func) continue;
    info[i] = func(params);
  }
  return opts.jsx && !this.isStrArray(info) ? info : info.join('');
}

i18n.getLocale = function (name) {
  var locale = global[opts.key];
  if (!name || locale) return locale;
  return locales[name] ||
    locales[name.split('-')[0]] ||
    utils.each(locales, function (key) {
      if (key.split('-')[0] == name.split('-')[0]) return locales[key];
    });
}

i18n.init = function (config) {
  config = config || {};
  var currentLang = config.language || '';
  var defaultLang = config.defaultLanguage || 'zh-CN';
  this.locale = this.getLocale(currentLang) ||
    this.getLocale(defaultLang) || {};
};

i18n.init();

module.exports = i18n;