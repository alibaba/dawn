export interface Confman {
  load: (configPath: string | string[]) => any;
  loaders: Array<{ extname?: string; loader?: any }>;
  directives: Array<{ name?: string; exec?: (ctx: any) => any }>;
}
