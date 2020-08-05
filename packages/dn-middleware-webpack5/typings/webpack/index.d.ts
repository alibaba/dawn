// Just a HACK for now
// make sure webpack use it's own type declarations
declare module "webpack" {
  import * as Webpack from "webpack/types.d";
  export = Webpack;
}
