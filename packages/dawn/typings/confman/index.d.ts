type Json = string | number | boolean | null | { [property: string]: Json } | Json[];

declare module "confman" {
  export const loaders: any[];
  export function load(confPath?: string): { [key: string]: Json };
}
