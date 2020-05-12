export interface MiddlewareUtils {
  list: () => Promise<any[]>;
  search: (keyword?: string) => Promise<any>;
  getInfo: (name?: string) => Promise<any>;
  getDocUrl: (name?: string) => Promise<string>;
  require: (name: string, cwd?: string) => Promise<any>;
}
