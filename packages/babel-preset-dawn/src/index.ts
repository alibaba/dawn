interface IOpts {
  typescript?: boolean;
  env?: object;
  react?: boolean | object;
  reactRequire?: boolean;
  transformRuntime?: object;
}

function toObject<T extends object>(obj: T | boolean): T | Partial<T> {
  return typeof obj === "object" ? obj : {};
}

function resolvePlugin(plugins) {
  return plugins.filter(Boolean).map(plugin => {
    if (Array.isArray(plugin)) {
      const [pluginName, ...args] = plugin;
      return [require.resolve(pluginName), ...args];
    }
    return require.resolve(plugin);
  });
}

export default (ctx: any, opts: IOpts = {}) => {
  return {
    presets: resolvePlugin([
      opts.typescript && "@babel/preset-typescript",
      ["@babel/preset-env", toObject(opts.env)],
      opts.react && ["@babel/preset-react", toObject(opts.react)],
    ]),
    plugins: resolvePlugin([
      opts.reactRequire && ["babel-plugin-react-require"],
      "@babel/plugin-syntax-dynamic-import",
      "@babel/plugin-proposal-export-default-from",
      "@babel/plugin-proposal-export-namespace-from",
      "@babel/plugin-proposal-do-expressions",
      ["@babel/plugin-proposal-nullish-coalescing-operator", { loose: false }],
      ["@babel/plugin-proposal-optional-chaining", { loose: false }],
      // https://www.npmjs.com/package/babel-plugin-transform-typescript-metadata#usage
      // should be placed before @babel/plugin-proposal-decorators.
      opts.typescript && "babel-plugin-transform-typescript-metadata",
      ["@babel/plugin-proposal-decorators", { legacy: true }],
      opts.transformRuntime && ["@babel/plugin-transform-runtime", toObject(opts.transformRuntime)],
      "@babel/plugin-proposal-function-bind",
      "@babel/plugin-proposal-logical-assignment-operators",
      ["@babel/plugin-proposal-pipeline-operator", { proposal: "minimal" }],
      "@babel/plugin-syntax-top-level-await",
    ]),
  };
};
