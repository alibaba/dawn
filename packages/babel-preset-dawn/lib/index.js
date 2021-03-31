"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
function toObject(obj) {
    return typeof obj === "object" ? obj : {};
}
function resolvePlugin(plugins) {
    return plugins.filter(Boolean).map(function (plugin) {
        if (Array.isArray(plugin)) {
            var pluginName = plugin[0], args = plugin.slice(1);
            return __spreadArray([require.resolve(pluginName)], args);
        }
        return require.resolve(plugin);
    });
}
exports.default = (function (opts) {
    if (opts === void 0) { opts = {}; }
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
            ["@babel/plugin-proposal-class-properties", { loose: true }],
            opts.transformRuntime && [
                "@babel/plugin-transform-runtime",
                __assign({ version: require("@babel/runtime/package.json").version, absoluteRuntime: path_1.dirname(require.resolve("@babel/runtime/package.json")), useESModules: true }, toObject(opts.transformRuntime)),
            ],
            "@babel/plugin-proposal-function-bind",
            "@babel/plugin-proposal-logical-assignment-operators",
            ["@babel/plugin-proposal-pipeline-operator", { proposal: "minimal" }],
            "@babel/plugin-syntax-top-level-await",
        ]),
    };
});
