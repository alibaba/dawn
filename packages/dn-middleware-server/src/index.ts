import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import * as http from "http";
import * as https from "https";
import * as clipboardy from "clipboardy";
import chalk from "chalk";
import Koa from "koa";
import serve from "koa-static";
import serveIndex from "serve-index";
import serveFavicon from "koa-favicon";
import enforceHttps from "koa-sslify";
import * as Dawn from "@dawnjs/types";

import historyApiFallback from "./historyApiFallback";
import headers from "./headers";
import handlers from "./handlers";
import proxies from "./proxies";
import { IOpts } from "./types";

const c2k = require("koa-connect");

const handler: Dawn.Handler<IOpts> = opts => {
  return async (next, ctx) => {
    const options: IOpts = {
      protocol: "http://",
      host: "localhost",
      port: !opts.port && ctx.utils.oneport ? await ctx.utils.oneport() : opts.port ?? 8000,
      public: "./build",
      autoOpen: true,
      historyApiFallback: false,
      configPath: "./server.yml",
      ...opts,
    };
    // if (options.host === "0.0.0.0") options.host = "127.0.0.1";

    ctx.emit("server.opts", options);

    // ConfigFile doesn't exist work as well.
    const serverConfig = ctx.utils.confman.load(path.join(ctx.cwd, options.configPath));

    // Support HTTPs
    let certConfig: any = undefined;
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
        await ctx.exec({ name: "https", host: options.host, port: options.port });
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

    const staticServe = serve(path.join(ctx.cwd, options.public), {
      immutable: true,
      maxAge: 0,
      hidden: true,
      gzip: false,
      brotli: true,
      // setHeaders:
    });
    const indexServe = serveIndex(path.join(ctx.cwd, options.public), {
      icons: true,
      view: "details",
      stylesheet: path.join(__dirname, "../assets/custom.css"),
    });

    const app = new Koa();
    ctx.server = app;
    await next();

    app.use(serveFavicon(path.join(__dirname, "../assets/favicon.ico")));
    app.use(headers(serverConfig?.headers));
    app.use(handlers(serverConfig?.handlers, ctx));
    app.use(proxies(serverConfig?.proxy, ctx));
    if (enabledHttps) {
      app.use(enforceHttps({ port: options.port }));
    }
    if (options.historyApiFallback) {
      app.use(historyApiFallback);
      app.use(staticServe);
    } else {
      app.use(staticServe);
      app.use(c2k(indexServe));
    }

    const listenOptions: any = [
      options.port,
      "0.0.0.0", // TODO: make server access by public ips
      async () => {
        const ifaces = os.networkInterfaces();
        ctx.console.info(`Starting up dev-server, serving ${chalk.underline.bold(options.public)} at:`);
        let shouldOpenUrl = `${options.protocol}${options.host}:${options.port}`;

        const hostList: string[] = [];
        Object.values(ifaces).forEach(item =>
          item.forEach(h => {
            if (h.family === "IPv4" && hostList.indexOf(h.address) < 0) hostList.push(h.address);
          }),
        );
        if (hostList.indexOf(options.host) < 0) hostList.push(options.host);
        const logUrl = (address: string) => {
          const shouldCopytoClip = address === options.host;
          const copyText = shouldCopytoClip ? chalk.gray(" (copied to clipboard)") : "";
          const logUrlText = `${options.protocol}${address}:${options.port}`;
          if (shouldCopytoClip) {
            clipboardy.write(logUrlText);
            shouldOpenUrl = logUrlText;
          }
          ctx.console.log(`- ${chalk.cyan(logUrlText)}${copyText}`);
        };
        hostList?.forEach(logUrl);

        // Auto open browser
        if (options.autoOpen && ctx.utils.open && shouldOpenUrl) {
          await ctx.utils.sleep(1000);
          ctx.utils.open(shouldOpenUrl);
        }
        ctx.emit("server.start", ctx.server);
      },
    ];
    if (enabledHttps) {
      const httpsOptions = {
        key: fs.readFileSync(certConfig?.key),
        cert: fs.readFileSync(certConfig?.cert),
      };
      ctx.httpServer = https.createServer(httpsOptions, app.callback()).listen(...listenOptions);
    } else {
      ctx.httpServer = http.createServer(app.callback()).listen(...listenOptions);
    }
    (ctx.server as any).httpServer = ctx.httpServer;
    ctx.emit("server.init", ctx.server);
  };
};

export default handler;
