import { Hook } from "@oclif/config";
import consola from "../../common/console";

const hook: Hook<"command_not_found"> = async function (opts) {
  consola.fatal(`Command "${opts.id}" not found.`);

  await this.config.runCommand("help");
  process.exit(1);
};

export default hook;
