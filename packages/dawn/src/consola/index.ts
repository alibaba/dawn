/* eslint-disable max-classes-per-file */
import * as signale from "signale";

export interface IConsolaOpts extends signale.SignaleOptions {}

export interface IConsola extends Console {}

export class Consola extends Console implements IConsola {
  public namespace = "dawn";
  protected signale: signale.Signale;
  private defaultOptons: IConsolaOpts = {
    config: {
      displayScope: false,
      displayTimestamp: true,
      displayLabel: false,
      displayDate: false,
    },
    // default scope
    scope: this.namespace,
    types: {
      log: {
        badge: "○",
        color: "white",
        label: "log",
      },
      warn: {
        badge: "☐",
        color: "yellow",
        label: "warn",
      },
      info: {
        badge: "◆",
        color: "magenta",
        label: "info",
      },
      error: {
        badge: "✖",
        color: "red",
        label: "error",
      },
    },
  };
  constructor(ns: string, opts?: IConsolaOpts) {
    super();
    this.namespace = ns;
    this.signale = new signale.Signale({ ...this.defaultOptons, ...opts });
  }
  public log(...argv: Parameters<typeof console.log>) {
    console.log(argv);
  }
}
