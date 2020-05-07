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
  cwd?: string; // 当前目录，默认为process.cwd()
  watch?: boolean; // 是否为watch模式
  type?: "esm" | "cjs"; // 输出模块类型
  srcDir?: string; // 源文件目录，默认为`${cwd}/src`
  include: string[]; // 包含的文件列表，支持glob语法，相对于src路径
  exclude: string[]; // 排除文件列表，支持glob语法，相对于src路径
  output?: string; // 输出目录
  target?: "browser" | "node"; // 环境目标
  runtimeHelpers?: boolean; // 是否添加runtimeHelpers
  extraPresets?: any[]; // 额外的presets
  extraPlugins?: any[]; // 额外的plugins
  nodeVersion?: string | "current" | true; // target为node时的目标node版本
  disableTypeCheck?: boolean; // 是否禁用类型检查
  // less?: false | Record<string, any>; // less选项
  lazy?: boolean; // 是否为lazy模式
}

export interface IGetBabelConfigOpts {
  target: "browser" | "node";
  type?: "esm" | "cjs";
  typescript?: boolean;
  runtimeHelpers?: boolean;
  nodeVersion?: number;
  lazy?: boolean;
}
