import * as npm from "npm";

console.log(
  npm.commands.install(["chalk", "--no-save"], () => {
    console.log("finsish");
  }),
);
