export interface IOpts {
  from?: string;
  to?: string;
  files?: Record<string, string>;
  log?: boolean;
  dot?: boolean;
  filter?: Function | string | boolean;
  override?: boolean;
  direction?: "->" | "<-";
}
