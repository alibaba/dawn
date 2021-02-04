import { IServiceOpts } from "@umijs/core";

export interface IFrameworkOptions extends Pick<IServiceOpts, "presets" | "plugins"> {}
