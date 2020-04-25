import Command, { flags } from "../common/command";
import RunCommand from "./run";

export default class Dev extends Command {
  static description = "Initialize a dawn project";
  static aliases = ["d"];

  static flags = {
    help: flags.help({ char: "h" }),
  };

  async run() {
    const options = this.parse(Dev);
    this.trace("options", options);
    await RunCommand.run(["dev"]);
  }
}
