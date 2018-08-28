const path = require("path");
const fs = require("fs");

module.exports = function(opts) {
  return async function(next) {
    this.console.info("Create typescript API docs...");
    //fix typedoc bug
    const bugFile = require.resolve("typedoc/dist/lib/utils/component.js");
    const bugText = (await this.utils.readFile(bugFile)).toString("utf8");
    await this.utils.writeFile(
      bugFile,
      bugText.replace(
        "throw new Error('The component `%s` has already been added.')",
        "return"
      )
    );
    //---------------
    const tsconfigFile = path.resolve(this.cwd, "./tsconfig.json");
    if (!fs.existsSync(tsconfigFile)) {
      this.console.warn("Not Found: tsconfig.json");
      return next();
    }
    const typedoc = await this.utils.findCommand(__dirname, "typedoc");
    const optionsFile = path.resolve(__dirname, "./typedoc.json");
    await this.exec({
      name: "copy",
      override: false,
      log: false,
      files: { "./typedoc.json": optionsFile }
    });
    await this.utils.exec(`${typedoc} --options ./typedoc.json`);
    next();
  };
};
