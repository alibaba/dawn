import $locales from "$locales";
import $opts from "$i18n_opts";

type GetFn = (key: string, params?: Record<string, any>, defaultValue?: any) => any;

type I18N = GetFn & {
  locale: Record<string, string>;
  expressions: Record<string, Function>;
  get: GetFn;
  compile: (expr: string) => Function;
  isStrArray: (list: any[]) => boolean;
  parse: (text: string, params: Record<string, any>) => any;
  isWhole: (locale: any) => boolean;
  getLocale: (name?: string) => Record<string, string>;
  init: (config?: { language?: string; defaultLanguage?: string }) => void;
};

const i18n: I18N = (key, params, defaultValue) => {
  return i18n.get(key, params, defaultValue);
};

i18n.locale = {};
i18n.expressions = {};

i18n.get = (key, params, defaultValue) => {
  if (typeof params === "string") {
    defaultValue = [params, (params = defaultValue)][0];
  }
  if (defaultValue === null || defaultValue === undefined) {
    defaultValue = key;
  }
  if (!key || typeof key !== "string" || i18n.locale[key] === null || i18n.locale[key] === undefined) {
    return defaultValue;
  }
  return i18n.parse(i18n.locale[key], params || {});
};

i18n.compile = expr => {
  if (!expr || typeof expr !== "string") {
    return;
  }
  if (!i18n.expressions[expr]) {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval,no-new-func
    i18n.expressions[expr] = new Function("$scope", `with($scope||{}){try{return(${expr})}catch(err){return ""}}`);
  }
  return i18n.expressions[expr];
};

i18n.isStrArray = list => {
  return list.every(item => typeof item === "string");
};

i18n.parse = (text, params) => {
  const info = text.split(/\{(.*?)\}/);
  for (let i = 1; i <= info.length; i += 2) {
    if (!info[i]) {
      continue;
    }
    const func = i18n.compile(info[i]);
    if (!func) {
      continue;
    }
    info[i] = func(params);
  }
  return $opts.jsx && !i18n.isStrArray(info) ? info : info.join("");
};

i18n.isWhole = locale => {
  if (!locale || locale.__name__) {
    return false;
  }
  const firstKey = Object.getOwnPropertyNames(locale)[0];
  if (!firstKey) {
    return false;
  }
  return locale[firstKey] !== null && typeof locale[firstKey] === "object";
};

i18n.getLocale = name => {
  const values = window[$opts.key as string];
  if (!name) {
    return values || {};
  }
  if (values && !i18n.isWhole(values)) {
    return values;
  }
  const locales = values || $locales;
  Object.keys(locales).forEach(key => {
    const value = locales[key];
    delete locales[key];
    locales[key.replace("_", "-")] = value;
  });
  return (
    locales[name] ||
    locales[name.split("-")[0]] ||
    locales[Object.keys(locales).find(key => key.split("-")[0] === name.split("-")[0])]
  );
};

i18n.init = config => {
  config = config || {};
  const currentLang = config.language || "";
  const defaultLang = config.defaultLanguage || "zh-CN";
  i18n.locale = (currentLang && i18n.getLocale(currentLang)) || i18n.getLocale(defaultLang) || {};
};

i18n.init();

export default i18n;
