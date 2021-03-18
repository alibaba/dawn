import rawCreateDebug, { Debugger } from "debug";

export const createDebug = (namespace: string) => rawCreateDebug(`dn:${namespace}`);

export { Debugger };

export { default as signale } from "signale";
export { default as requireDir } from "require-dir";
