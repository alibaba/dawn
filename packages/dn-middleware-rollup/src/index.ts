import { getBundleOpts, validateBundleOpts } from "./getBundleOpts";
import { run } from "./rollup";
import { IOpts } from "./types";

export default (userOpts: IOpts) => {
  return async function (next) {
    const opts = {
      ...userOpts,
      cwd: userOpts.cwd || this.cwd,
    };
    this.console.info("Rollup starting...");

    if (this.emit) {
      this.emit("rollup.opts", opts);
    }

    const bundleOpts = opts.fullCustom ? opts.bundleOpts : await getBundleOpts(opts);

    if (this.emit) {
      this.emit("rollup.bundleOpts", bundleOpts, opts);
    }

    validateBundleOpts(bundleOpts, opts, this);

    if (bundleOpts.umd) {
      this.console.info("Building umd...");
      await run(
        {
          cwd: opts.cwd,
          type: "umd",
          entry: bundleOpts.entry,
          watch: opts.watch,
          bundleOpts,
          configFile: opts.configFile,
        },
        this,
      );
    }

    if (bundleOpts.cjs) {
      this.console.info("Building cjs...");
      await run(
        {
          cwd: opts.cwd,
          type: "cjs",
          entry: bundleOpts.entry,
          watch: opts.watch,
          bundleOpts,
          configFile: opts.configFile,
        },
        this,
      );
    }

    if (bundleOpts.esm) {
      this.console.info("Building esm...");
      await run(
        {
          cwd: opts.cwd,
          type: "esm",
          entry: bundleOpts.entry,
          watch: opts.watch,
          bundleOpts,
          configFile: opts.configFile,
        },
        this,
      );
    }

    next();
  };
};
