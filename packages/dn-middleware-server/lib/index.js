"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var path = _interopRequireWildcard(require("path"));

var fs = _interopRequireWildcard(require("fs"));

var os = _interopRequireWildcard(require("os"));

var http = _interopRequireWildcard(require("http"));

var https = _interopRequireWildcard(require("https"));

var clipboardy = _interopRequireWildcard(require("clipboardy"));

var _chalk = _interopRequireDefault(require("chalk"));

var _koa = _interopRequireDefault(require("koa"));

var _koaStatic = _interopRequireDefault(require("koa-static"));

var _serveIndex = _interopRequireDefault(require("serve-index"));

var _koaSslify = _interopRequireDefault(require("koa-sslify"));

var _historyApiFallback = require("./historyApiFallback");

var _headers = require("./headers");

var _handlers = require("./handlers");

var _proxies = require("./proxies");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const c2k = require("koa-connect");

const handler = opts => {
  return async (next, ctx) => {
    var _opts$port;

    const options = {
      protocol: "http://",
      host: "127.0.0.1",
      port: !opts.port && ctx.utils.oneport ? await ctx.utils.oneport() : (_opts$port = opts.port) !== null && _opts$port !== void 0 ? _opts$port : 8000,
      public: "./build",
      autoOpen: true,
      historyApiFallback: false,
      configPath: "./server.yml",
      ...opts
    };
    if (options.host === "0.0.0.0") options.host = "127.0.0.1";
    ctx.emit("server.opts", options); // ConfigFile doesn't exist work as well.

    const serverConfig = ctx.utils.confman.load(path.join(ctx.cwd, options.configPath)); // Support HTTPs

    let certConfig = undefined;
    let enabledHttps = false;

    try {
      const afterEnableHttps = async () => {
        if (options.host === "0.0.0.0" || options.host === "127.0.0.1") options.host = "localhost";
        enabledHttps = true;
      };

      if (options.https) {
        // Use https middleware in pipe.yml
        certConfig = await options.https;
        await afterEnableHttps();
      } else if (options.ssl === true) {
        // Add https, call from server
        options.ssl = undefined;
        await ctx.exec({
          name: "https",
          host: options.host,
          port: options.port
        });
        ctx.emit("server.opts", options);
        certConfig = await options.https;
        await afterEnableHttps();
      }
    } catch (error) {
      if (process.env.DN_DEBUG) ctx.console.error(error);
      ctx.console.error("Enable HTTPs failed.");
    }

    process.once("SIGINT", function () {
      ctx.console.info("Stopped dev-server.");
      process.exit(0);
    });
    process.once("SIGTERM", function () {
      ctx.console.info("Stopped dev-server.");
      process.exit(0);
    });
    const staticServe = (0, _koaStatic.default)(path.join(ctx.cwd, options.public), {
      immutable: true,
      maxAge: 0,
      hidden: true,
      gzip: false,
      brotli: true
    });
    const indexServe = (0, _serveIndex.default)(path.join(ctx.cwd, options.public), {
      icons: true,
      view: "details",
      stylesheet: path.join(__dirname, "../assets/custom.css")
    });
    const app = new _koa.default();
    app.use((0, _headers.headers)(serverConfig === null || serverConfig === void 0 ? void 0 : serverConfig.headers));
    app.use((0, _handlers.handlers)(serverConfig === null || serverConfig === void 0 ? void 0 : serverConfig.handlers, ctx));
    app.use((0, _proxies.proxies)(serverConfig === null || serverConfig === void 0 ? void 0 : serverConfig.proxy, ctx));

    if (enabledHttps) {
      app.use((0, _koaSslify.default)({
        port: options.port
      }));
    }

    if (options.historyApiFallback) {
      app.use(_historyApiFallback.historyApiFallback);
      app.use(staticServe);
    } else {
      app.use(staticServe);
      app.use(c2k(indexServe));
    }

    const listenOptions = [options.port, options.host, async () => {
      const ifaces = os.networkInterfaces();
      ctx.console.info(`Starting up dev-server, serving ${options.public} at:`);
      let shouldOpenUrl = `${options.protocol}${options.host}:${options.port}`;
      const hostList = [];
      Object.values(ifaces).forEach(item => item.forEach(h => {
        if (h.family === "IPv4" && hostList.indexOf(h.address) < 0) hostList.push(h.address);
      }));
      if (hostList.indexOf(options.host) < 0) hostList.push(options.host);

      const logUrl = address => {
        const shouldCopytoClip = address === options.host;
        const copyText = shouldCopytoClip ? _chalk.default.gray(" (copied to clipboard)") : "";
        const logUrlText = `${options.protocol}${address}:${options.port}`;

        if (shouldCopytoClip) {
          clipboardy.write(logUrlText);
          shouldOpenUrl = logUrlText;
        }

        ctx.console.log(`- ${_chalk.default.cyan(logUrlText)}${copyText}`);
      };

      hostList === null || hostList === void 0 ? void 0 : hostList.forEach(logUrl);
      await next();
      await ctx.utils.sleep(1000); // Auto open browser

      if (options.autoOpen && ctx.utils.open && shouldOpenUrl) {
        ctx.utils.open(shouldOpenUrl);
      }
    }];

    if (enabledHttps) {
      var _certConfig, _certConfig2;

      const httpsOptions = {
        key: fs.readFileSync((_certConfig = certConfig) === null || _certConfig === void 0 ? void 0 : _certConfig.key),
        cert: fs.readFileSync((_certConfig2 = certConfig) === null || _certConfig2 === void 0 ? void 0 : _certConfig2.cert)
      };
      ctx.httpServer = https.createServer(httpsOptions, app.callback()).listen(...listenOptions);
    } else {
      ctx.httpServer = http.createServer(app.callback()).listen(...listenOptions);
    }

    app.httpServer = ctx.httpServer;
    ctx.server = app;
  };
};

var _default = handler;
exports.default = _default;
module.exports = exports.default;