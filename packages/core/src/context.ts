import { EventEmitter } from "events";

export class Context extends EventEmitter {
  constructor(cli) {
    super();
    this.cli = cli;
  }
}
