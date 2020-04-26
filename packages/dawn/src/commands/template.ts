import Command, { flags } from "../command";

export default class Template extends Command {
  static description = "describe the command here";

  static flags = {
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: "n", description: "Search template by name." }),
    help: flags.help({ char: "h" }),
  };

  async run() {
    const options = this.parse(Template);
    this.trace("options", options);

    const search = options.flags.name;
    this.console.success("search", search);

    this.console.log(this.config);
  }
}
