import type { Question } from "inquirer";

export interface IOpts {
  prefix?: string;
  items?: Question[];
}
