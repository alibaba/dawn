import * as signale from "signale";

// More options: https://github.com/klaussinani/signale
const console = new signale.Signale({
  config: {
    displayScope: false,
    displayTimestamp: true,
    displayLabel: false,
    displayDate: false,
  },
  // default scope
  scope: "dawn",
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
});

export default console;
