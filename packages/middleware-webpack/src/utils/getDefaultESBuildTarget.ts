import browserslist from "browserslist";
import { resolveToEsbuildTarget } from "esbuild-plugin-browserslist";
import type { INormalizedOpts } from "../types";
import debug from "./debug";

export default (options: INormalizedOpts) => {
  const target = resolveToEsbuildTarget(browserslist(undefined, { path: options.cwd, env: options.env }), {
    printUnknownTargets: false,
  });

  debug("Parsed esbuild target from browserslist: ", target);

  return target;
};
