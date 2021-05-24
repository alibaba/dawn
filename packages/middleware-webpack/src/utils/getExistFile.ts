import path from "path";
import fs from "fs";

export default function ({ cwd, files, returnRelative }: { cwd: string; files: string[]; returnRelative: boolean }) {
  for (const file of files) {
    const absFilePath = path.join(cwd, file);
    if (fs.existsSync(absFilePath)) {
      return returnRelative ? file : absFilePath;
    }
  }
}
