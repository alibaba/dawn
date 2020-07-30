// eslint-disable-next-line spaced-comment
/// <reference path="../node_modules/@types/react/index.d.ts" />

type I18nResult = string | React.ReactNode | any;
declare function i18nFunc(
  mcmsKey: string,
  placeholder?: {
    [key: string]: I18nResult;
  } | null,
  backupLabel?: string,
): I18nResult;
declare function i18nFunc(mcmsKey: string, backupLabel?: string): I18nResult;
// declare function i18nInit(params: any): void;

declare module "$i18n" {
  export = i18nFunc;
}

declare const $t: typeof i18nFunc;
