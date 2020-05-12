export interface ModuleUtils {
  exec: (cmd: string, opts?: any) => Promise<void>;
  install: (name: string, opts?: any) => Promise<void>;
  getInfo: (name: string) => Promise<any>;
  getVersionInfo: (name: string, version: string) => Promise<any>;
  download: (name: string, prefix?: string) => Promise<string>;
  getDocUrl: (name: string, prefix?: string) => Promise<string>;
  clean: () => Promise<void>;
}
