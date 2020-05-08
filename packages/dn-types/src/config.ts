import { Pipeline } from "./pipeline";

export interface Configs {
  [property: string]: any;
  pipe?: Pipeline;
  rc?: any;
}
