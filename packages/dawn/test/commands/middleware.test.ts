import { expect, test } from "@oclif/test";

describe("middleware", () => {
  test
    .stdout()
    .command(["middleware"])
    .it("runs hello", ctx => {
      expect(ctx.stdout).to.contain("hello world");
    });

  test
    .stdout()
    .command(["middleware", "--name", "jeff"])
    .it("runs hello --name jeff", ctx => {
      expect(ctx.stdout).to.contain("hello jeff");
    });
});
