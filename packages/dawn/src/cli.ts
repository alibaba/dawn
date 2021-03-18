import { Command } from "commander";
import { Context } from "@dawnjs/core";

const pkg = require("../package.json");

(async () => {
  const program = new Command();
  program.version(pkg.version).usage("<command> [options]");

  const context = new Context(program);

  await context.run();

  await program.parseAsync(process.argv);
})();
