import i18n from "$i18n";

// i18n init
(i18n as any).init({
  language: navigator.language || "zh-CN",
  defaultLanguage: "zh-CN",
});

// register i18n util
window.$t = i18n;
