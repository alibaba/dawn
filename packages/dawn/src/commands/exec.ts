import { Command, flags } from "@oclif/command";

export default class Exec extends Command {
  static description = "describe the command here";

  static flags = {
    help: flags.help({ char: "h" }),
  };
  static strict = false;

  async run() {
    const options = this.parse(Exec);
    console.log(options);
  }
}
