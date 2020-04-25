import Command, { flags } from "../common/command";

export default class Update extends Command {
  static description = "describe the command here";
  static aliases = ["u"];

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
  };

  async run() {
    this.trace("where am i");
  }
}
