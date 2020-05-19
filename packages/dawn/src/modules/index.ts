import { AModules } from "./abstract";
import { NpmModules } from "./npm";
import { XNpmModules } from "./xnpm";
import { YarnModules } from "./yarn";

export default class ModuleFactory {
  public static getClient = (clientName = "npm"): AModules => {
    if (clientName === "npm") {
      return new NpmModules();
    } else if (/[a-zA-Z]?npm/.test(clientName)) {
      return new XNpmModules({ client: clientName });
    } else if (clientName === "yarn") {
      return new YarnModules();
    }
    return new NpmModules();
  };
}
