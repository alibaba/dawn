import * as fs from "fs";
import * as path from "path";
import * as assert from "assert";
import globby from "globby";
import * as Dawn from "@dawnjs/types";

import { Env, IGetWebpackConfigOpts, IOpts } from "./types";

export const getExistFile = ({
  cwd,
  files,
  returnRelative,
}: {
  cwd: string;
  files: string[];
  returnRelative: boolean;
}) => {
  for (const file of files) {
    const absFilePath = path.join(cwd, file);
    if (fs.existsSync(absFilePath)) {
      return returnRelative ? file : absFilePath;
    }
  }
};

// ./src/foo.js => foo
const getFilenameByPath = (f: string) => path.basename(f).split(".")[0];

// format entry and template
const formatReglikeObject = (params: Record<string, string>) => {
  const paramsMap: Record<string, string> = {};
  if (typeof params === "string") {
    paramsMap[getFilenameByPath(params)] = params;
  } else if (Array.isArray(params)) {
    params.forEach((e: any) => {
      paramsMap[getFilenameByPath(e)] = e;
    });
  } else {
    Object.assign(paramsMap, params);
  }
  const nameFileList: Array<{ name: string; file: string }> = [];
  Object.entries(paramsMap).forEach(([nameExpr, fileExpr]) => {
    const files = globby.sync(fileExpr);
    files.forEach(file => {
      const paths = file.split("/").reverse().map(getFilenameByPath);
      const name = nameExpr.replace(/\((\d+)\)/g, (_, index) => {
        return paths[index];
      });
      nameFileList.push({ name, file });
    });
  });
  return nameFileList;
};

function formatNullStringToList<T = string>(params?: T | T[] | null): T[] {
  if (!params) return [];
  else if (Array.isArray(params)) {
    return params;
  }
  return [params];
}

// Validate and format input opts
export const formatAndValidateOpts = (opts: Partial<IOpts>, ctx: Dawn.Context) => {
  const options = Object.assign({}, opts);

  // cwd
  options.cwd = options.cwd || ctx.cwd;

  // env
  const isLegalEnv = (e?: string) => ["development", "production"].includes(e);
  if (!isLegalEnv(options.env)) {
    let envMessage = "[webpack5] None `env` development|production is configured";
    if (isLegalEnv(process.env?.DN_ENV)) {
      options.env = process.env.DN_ENV as Env;
      envMessage += `, auto set to ${options.env} by using DN_ENV`;
    } else if (isLegalEnv(process.env?.NODE_ENV)) {
      options.env = process.env.NODE_ENV as Env;
      envMessage += `, auto set to ${options.env} by using NODE_ENV`;
    } else {
      // ctx.command == current pipe full-name: init/dev/build/publish/..
      options.env = ctx.command.includes("dev") ? "development" : "production";
      envMessage += `, auto set to \`${options.env}\` by using DN_CMD`;
    }
    ctx.console.warn(envMessage);
  }

  // entry
  if (
    !options.entry ||
    (Array.isArray(options.entry) && !options.entry?.length) ||
    (typeof options.entry === "object" && !Object.keys(options.entry)?.length)
  ) {
    options.entry = getExistFile({
      cwd: options.cwd,
      files: ["src/index.tsx", "src/index.ts", "src/index.jsx", "src/index.js"],
      returnRelative: true,
    });
  }
  assert.ok(options.entry, "[webpack5] No `entry` found, checkout guide for usage details.");
  options.entry = formatReglikeObject(options.entry as any);

  // useTypescript judge by entry file ext
  ctx.useTypescript = options.entry?.some?.(({ file }) => file.endsWith(".ts") || file.endsWith(".tsx"));
  assert.ok(
    // if entry is dot ts(x), but not found tsconfig.json, exist
    !(ctx.useTypescript && !fs.existsSync(path.join(ctx.cwd, "tsconfig.json"))),
    "[webpack5] Your entry is typescript but missing tsconfig.json file.",
  );

  // template
  if (
    !options.template ||
    (Array.isArray(options.template) && !options.template?.length) ||
    (typeof options.template === "object" && !Object.keys(options.template)?.length)
  ) {
    options.template = getExistFile({
      cwd: options.cwd,
      // `src/assets/index.html` is not recommanded and will be removed soon
      files: ["public/index.html", "src/assets/index.html"],
      returnRelative: true,
    });
  }
  assert.ok(options.template, "[webpack5] No `template` found, checkout guide for usage details.");
  options.template = formatReglikeObject(options.template as any);

  // inject & append
  options.inject = formatNullStringToList(options.inject);
  options.append = formatNullStringToList(options.append);

  // output
  if (typeof options.output === "string") {
    options.output = { path: path.join(options.cwd, options.output) };
  }

  // performance
  // default is false
  // true means warning
  options.performance = options.performance === true ? "warning" : options.performance ?? false;
  (options as IGetWebpackConfigOpts).performanceConfig = { hints: options.performance };

  // target
  // browser means web
  // default is web
  options.target = options.target === "browser" ? "web" : options.target ?? "web";

  return options as IOpts;
};
