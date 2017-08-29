/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 */

const path = require('path');
const middleware = require('./middleware');
const template = require('./template');
const utils = require('./common/utils');
const fs = require('fs');
const unhandled = require('./middlewares/unhandled');
const pkg = require('../package');
const confman = require('confman');
const console = require('console3');
const configs = require('./configs');
const inquirer = require('inquirer');
const mod = require('./mod');

class Context {

  constructor(cli, opts) {
    opts = opts || {};
    utils.copy(opts, this);
    utils.copy(cli.params, this);
    this.cli = cli;
    this.middlewareMgr = middleware;
    this.templateMgr = template;
    this.middlewares = opts.middlewares || [];
    this.command = this.cli.get('command');
    this.cwd = process.cwd();
    this.console = console;
    this.utils = utils;
    this.inquirer = inquirer;
    this.pkg = pkg;
    this.configPath = path.resolve(this.cwd, `./.${pkg.realName}`);
    this.checkConfigPath();
  }

  checkConfigPath() {
    let paths = [
      this.configPath,
      path.resolve(this.cwd, '/.dbl-next')
    ];
    for (let configPath of paths) {
      if (fs.existsSync(configPath)) {
        this.configPath = configPath;
        return;
      }
    }
  }

  configIsExists() {
    return fs.existsSync(this.configPath);
  }

  async _loadLocalePipe() {
    if (!this.configIsExists()) return [];
    let localConfigs = confman.load(this.configPath);
    if (!localConfigs || !localConfigs.pipe) return [];
    let list = localConfigs.pipe[this.command];
    return list || [];
  }

  async _mergeRemotePipe(list) {
    let pipe = await configs.getRemoteConf('pipe');
    pipe.before = pipe.before || [];
    pipe.after = pipe.after || [];
    let beforeList = pipe.before[this.command] || [];
    beforeList.forEach(item => {
      if (list.some(i => !i.force && i.name == item.name)) return;
      list.unshift(item);
    });
    let afterList = pipe.after[this.command] || [];
    afterList.forEach(item => {
      if (list.some(i => !i.force && i.name == item.name)) return;
      list.push(item);
    });
    return list;
  }

  async _loadMiddlewares() {
    if (!this.configIsExists()) return;
    this.console.info('Load middlewares...');
    let list = await this._loadLocalePipe();
    if (!this.disRemote) {
      await this._mergeRemotePipe(list);
    }
    for (let item of list) {
      this.middlewares.push(await this.load(item));
    }
    this.console.info('Done');
  }

  async _execute(args) {
    let handler = this.middlewares.shift();
    if (!handler) return;
    let next = (args) => {
      if (next.__result) return next.__result;
      next.__result = this._execute(args)
        .catch((err) => this.onFail(err));
      return next.__result;
    };
    return handler.call(this, next, args);
  }

  async load(item) {
    if (!item || !item.name) {
      throw new Error('Invalid build configuration information');
    }
    let modFactory;
    if (item.location) {
      modFactory = require(path.resolve(this.cwd, item.location));
    } else {
      modFactory = await middleware.require(item.name);
    }
    if (!utils.isFunction(modFactory)) {
      throw new Error(`Invalid middleware '${item.name}'`);
    }
    return modFactory(item);
  }

  async _loadProjectModules() {
    if (!this.configIsExists()) return;
    let nmPath = path.resolve(this.cwd, './node_modules');
    if (fs.existsSync(nmPath)) return;
    console.info('Install deps...');
    await mod.install();
    console.info('Done');
  }

  async run() {
    await this._loadProjectModules();
    await this._loadMiddlewares();
    if (!this.disUnhandled && this.middlewares.length < 1) {
      this.middlewares.push(unhandled);
    }
    return this._execute();
  }

}

module.exports = Context;