let utils = require('ntils');
let $locales = require('$locales');
let $opts = require('$i18n_opts');

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
};

i18n.compile = function (expr) {
  if (!expr || !utils.isString(expr)) return;
  if (!this.expressions[expr]) {
    this.expressions[expr] = new Function(
      '$scope',
      'with($scope||{}){try{return(' + expr + ')}catch(err){return ""}}'
    );
  }
  return this.expressions[expr];
};

i18n.isStrArray = function (list) {
  for (let i in list) {
    let item = list[i];
    if (!utils.isString(item)) return false;
  }
  return true;
};

i18n.parse = function (text, params) {
  let info = text.split(/\{(.*?)\}/);
  for (let i = 1; i <= info.length; i += 2) {
    if (!info[i]) continue;
    let func = this.compile(info[i]);
    if (!func) continue;
    info[i] = func(params);
  }
  return $opts.jsx && !this.isStrArray(info) ? info : info.join('');
};

i18n.isWhole = function (locale) {
  if (!locale || locale.__name__) return false;
  const firstKey = Object.getOwnPropertyNames(locale)[0];
  if (!firstKey) return false;
  return utils.isObject(locale[firstKey]);
};

i18n.getLocale = function (name) {
  let values = global[$opts.key];
  if (!name) return values || {};
  if (values && !this.isWhole(values)) return values;
  let locales = values || $locales;
  return locales[name] ||
    locales[name.split('-')[0]] ||
    utils.each(locales, function (key) {
      if (key.split('-')[0] == name.split('-')[0]) return locales[key];
    });
};

i18n.init = function (config) {
  config = config || {};
  let currentLang = config.language || '';
  let defaultLang = config.defaultLanguage || 'zh-CN';
  this.locale = this.getLocale(currentLang) ||
    this.getLocale(defaultLang) || {};
};

i18n.init();

module.exports = i18n;