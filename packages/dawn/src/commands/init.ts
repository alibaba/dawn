import Command, { flags } from "../command";
// import RunCommand from "./run";

export default class Init extends Command {
  static description = "Initialize a dawn project";
  static aliases = ["i"];

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    template: flags.string({ char: "t", description: "Specify the template name for the init command" }),
  };

  async run() {
    const options = this.parse(Init);
    this.trace("options", options);
    // const { template } = options.flags;
    this.console.log("init", this.ctx.configName);
    // await RunCommand.run(["init"]);
  }
}
