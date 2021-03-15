import program from "commander";
import semver from "semver";
import createDebug from "debug";
import pkg from "../package.json";

(async () => {
  const debug = createDebug("dawn:cli");

  debug("process.version", process.version);
  debug("pkg.engines.node", pkg.engines.node);
  if (!semver.satisfies(process.version, pkg.engines.node)) {
    console.error(`The Node version requirement is ${pkg.engines.node}, but the current version is ${process.version}`);
    process.exit(-1);
  }

  debug("process.argv", process.argv);

  program.version(pkg.version).usage("<command> [options]");

  program.parse(process.argv);

  const subCmd = program.args[0];
  if (!subCmd) {
    program.help();
  }
})();
