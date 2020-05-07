type LogFN = (message?: any, ...optionalParams: any[]) => void;

interface IDawnConsole {
  log: LogFN;
  info: LogFN;
  error: LogFN;
  warn: LogFN;
}

export interface IDawnContext {
  cwd: string;
  console: IDawnConsole;
  emit?: (eventName: string, ...eventParams: any[]) => void;
  utils: {
    sleep: (ms: number) => Promise<void>;
  };
  project: IPkg;
}

export interface IPkg {
  name?: string;
  main?: string;
  module?: string;
  browser?: string;
  dependencies?: Record<string, any>;
  peerDependencies?: Record<string, any>;
}

export interface IOpts {
  cwd?: string;
  watch?: boolean;
  type?: "esm" | "cjs";
  srcDir?: string;
  include: string[];
  exclude: string[];
  output?: string;
  target?: "browser" | "node";
  runtimeHelpers?: boolean;
  extraPresets?: any[];
  extraPlugins?: any[];
  nodeVersion?: string | "current" | true;
  disableTypeCheck?: boolean;
  lazy?: boolean;
  noEmit?: boolean;
}

export interface IGetBabelConfigOpts {
  target: "browser" | "node";
  type?: "esm" | "cjs";
  typescript?: boolean;
  runtimeHelpers?: boolean;
  nodeVersion?: number;
  lazy?: boolean;
}
