import * as fs from "fs";
import * as path from "path";
import * as Dawn from "@dawnjs/types";
import globby from "globby";
import getPublicUrlOrPath from "react-dev-utils/getPublicUrlOrPath";
import { FileInfo } from "../types";
// import type { Stats } from "webpack/types";

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

// We use `PUBLIC_URL` enviroinfernment variable or "homepage" field to
// "public path" at which the app is served.
// webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
export const getPublicPath = (ctx: Dawn.Context) =>
  ctx.publicPath || ctx.publicPath === ""
    ? ctx.publicPath
    : getPublicUrlOrPath(process.env.NODE_ENV === "development", process.env.PUBLIC_URL, "");

// ./src/foo.js => foo
const getFilenameByPath = (f: string) => path.basename(f).split(".")[0];

// format entry and template
export const formatReglikeObject = (params: Record<string, string>) => {
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
  const nameFileList: FileInfo[] = [];
  Object.entries(paramsMap).forEach(([nameExpr, fileExpr]) => {
    const files = globby.sync(fileExpr);
    files.forEach(file => {
      const paths = file.split("/").reverse()?.map(getFilenameByPath);
      const name = nameExpr.replace(/\((\d+)\)/g, (_, index) => {
        return paths[index];
      });
      nameFileList.push({ name, file });
    });
  });
  return nameFileList;
};

export function formatNullStringToList<T = string>(params?: T | T[] | null): T[] {
  if (!params) return [];
  else if (Array.isArray(params)) {
    return params;
  }
  return [params];
}

export function formatWebpackMessages({ warnings, errors }: { warnings?: any[]; errors?: any[] }) {
  const result = {
    errors: Array.isArray(errors) ?
      errors?.map(({ message }) => formatMessage(message))
      : [],
    warnings: Array.isArray(warnings) ?
      warnings?.map(({ message }) => formatMessage(message))
      : [],
  };

  if (result.errors.some(isLikelyASyntaxError)) {
    // If there are any syntax errors, show just them.
    // This prevents a confusing ESLint parsing error
    // preceding a much more useful Babel syntax error.
    result.errors = result.errors.filter(isLikelyASyntaxError);
  }
  return result;
}

/**
 * @param {number} size the size in bytes
 * @returns {string} the formatted size
 */
export function formatSize(size: number) {
  if (typeof size !== "number" || Number.isNaN(size) === true) {
    return "unknown size";
  }

  if (size <= 0) {
    return "0 bytes";
  }

  const abbreviations = ["bytes", "KiB", "MiB", "GiB"];
  const index = Math.floor(Math.log(size) / Math.log(1024));

  return `${+(size / 1024 ** index).toPrecision(3)} ${abbreviations[index]}`;
}

export function makeRow(a: string, b: string): string {
  return ` ${a}\t       ${b}`;
}

// export function printError(stats: Stats, ctx: Dawn.Context) {
// const info = stats.toJson();
// // Compilation errors (missing modules, syntax errors, etc)
// if (stats.hasErrors()) {
//   ctx.console.error("error");
//   ctx.console.error(info.errors);
// }
// // Compilation warnings
// if (stats.hasWarnings()) {
//   ctx.console.error("warning");
//   ctx.console.warn(info.warnings);
// }
// }


const friendlySyntaxErrorLabel = 'Syntax error:';

function isLikelyASyntaxError(message: string) {
  return message.indexOf(friendlySyntaxErrorLabel) !== -1;
}

// Cleans up webpack error messages.
// eslint-disable-next-line no-unused-vars
function formatMessage(message: string) {
  let lines = message.split('\n');

  if (lines.length > 2 && lines[1] === '') {
    // Remove extra newline.
    lines.splice(1, 1);
  }

  // Remove webpack-specific loader notation from filename.
  // Before:
  // ./~/css-loader!./~/postcss-loader!./src/App.css
  // After:
  // ./src/App.css
  if (lines[0].lastIndexOf('!') !== -1) {
    lines[0] = lines[0].substr(lines[0].lastIndexOf('!') + 1);
  }

  // Remove unnecessary stack added by `thread-loader`
  var threadLoaderIndex = -1;
  lines.forEach(function(line, index) {
    if (threadLoaderIndex !== -1) {
      return;
    }
    if (line.indexOf('from thread-loader (worker') !== -1) {
      threadLoaderIndex = index;
    }
  });

  if (threadLoaderIndex !== -1) {
    lines = lines.slice(0, threadLoaderIndex);
  }

  lines = lines.filter(function(line) {
    // Webpack adds a list of entry points to warning messages:
    //  @ ./src/index.js
    //  @ multi react-scripts/~/react-dev-utils/webpackHotDevClient.js ...
    // It is misleading (and unrelated to the warnings) so we clean it up.
    // It is only useful for syntax errors but we have beautiful frames for them.
    return line.indexOf(' @ ') !== 0;
  });

  // line #0 is filename
  // line #1 is the main error message
  if (!lines[0] || !lines[1]) {
    return lines.join('\n');
  }

  // Cleans up verbose "module not found" messages for files and packages.
  if (lines[1].indexOf('Module not found: ') === 0) {
    lines = [
      lines[0],
      // Clean up message because "Module not found: " is descriptive enough.
      lines[1]
        .replace("Cannot resolve 'file' or 'directory' ", '')
        .replace('Cannot resolve module ', '')
        .replace('Error: ', '')
        .replace('[CaseSensitivePathsPlugin] ', ''),
    ];
  }

  // Cleans up syntax error messages.
  if (lines[1].indexOf('Module build failed: ') === 0) {
    lines[1] = lines[1].replace(
      'Module build failed: SyntaxError:',
      friendlySyntaxErrorLabel
    );
  }

  // Clean up export errors.
  // TODO: we should really send a PR to Webpack for this.
  const exportError = /\s*(.+?)\s*(")?export '(.+?)' was not found in '(.+?)'/;
  if (lines[1].match(exportError)) {
    lines[1] = lines[1].replace(
      exportError,
      "$1 '$4' does not contain an export named '$3'."
    );
  }

  // Reassemble the message.
  message = lines.join('\n');
  // Internal stacks are generally useless so we strip them... with the
  // exception of stacks containing `webpack:` because they're normally
  // from user code generated by WebPack. For more information see
  // https://github.com/facebook/create-react-app/pull/1050
  message = message.replace(
    /^\s*at\s((?!webpack:).)*:\d+:\d+[\s)]*(\n|$)/gm,
    ''
  ); // at ... ...:x:y

  return message.trim();
}
