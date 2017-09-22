/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const path = require('path');
const middleware = require('./middleware');
const template = require('./template');
const utils = require('./common/utils');
const fs = require('fs');
const unhandled = require('./middlewares/unhandled');
const pkg = require('../package');
const console = require('console3');
const configs = require('./configs');
const mod = require('./mod');
const upgrade = require('./upgrade');
const EventEmitter = require('events');
const debug = require('debug')('context');

const NOOP = () => { };

class Context extends EventEmitter {

  constructor(cli, opts) {
    super();
    opts = opts || {};
    utils.copy(opts, this);
    utils.copy(cli.params, this);
    this.cli = cli;
    this.cli.pkg = pkg;
    this.middlewareMgr = middleware;
    this.templateMgr = template;
    this.middlewares = opts.middlewares || [];
    this.command = this.cli.get('command');
    this.cwd = process.cwd();
    this.console = console;
    this.utils = utils;
    this.inquirer = utils.inquirer;
    this.configName = `./.${pkg.name}`;
    this.configPath = path.resolve(this.cwd, this.configName);
    this.project = this.getProjectInfo();
  }

  async configIsExists() {
    debug('config name', this.configName);
    let files = await utils.globby([
      `${this.configName}/**/*.*`,
      `${this.configName}.*`
    ]);
    debug('config files', files);
    return files.length > 0;
  }

  getProjectInfo() {
    let pkgFile = path.normalize(`${this.cwd}/package.json`);
    if (!fs.existsSync(pkgFile)) return {};
    return require(pkgFile);
  }

  async _loadLocalePipe() {
    if (!(await this.configIsExists())) return [];
    let localConfigs = utils.confman.load(this.configPath);
    debug('local configs', localConfigs);
    if (!localConfigs || !localConfigs.pipe) return [];
    let list = localConfigs.pipe[this.command];
    return list || [];
  }

  async _mergeRemotePipe(list) {
    if (!(await this.configIsExists())) return [];
    let pipe = (await configs.getRemoteConf('pipe')) || {};
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
    if (!(await this.configIsExists())) return;
    let list = await this._loadLocalePipe();
    await this._mergeRemotePipe(list);
    for (let item of list) {
      this.console.info(`Load middleware \`${item.name}\`...`);
      this.middlewares.push(await this.load(item));
      this.console.info('Done');
    }
  }

  async _execute(args, onFail) {
    let handler = this.middlewares.shift();
    if (!handler) return;
    let next = (args) => {
      if (next.__result) return next.__result;
      next.__result = this._execute(args, onFail)
        .catch(err => onFail(err));
      return next.__result;
    };
    return handler.call(this, next, this, args);
  }

  async load(item) {
    if (!item || !item.name) {
      throw new Error('Invalid build config');
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

  async call(item, callback) {
    callback = callback || NOOP;
    let md = await this.load(item);
    return md.call(this, callback, this);
  }

  async _loadProjectModules() {
    if (!(await this.configIsExists())) return;
    let modulesPath = path.resolve(this.cwd, './node_modules');
    let packagePath = path.resolve(this.cwd, './package.json');
    if (fs.existsSync(modulesPath) || !fs.existsSync(packagePath)) return;
    console.info('Install deps...');
    await mod.install();
    console.info('Done');
  }

  async run() {
    await upgrade.check();
    await this._loadProjectModules();
    if (this.middlewares.length < 1) {
      await this._loadMiddlewares();
    }
    if (this.command != 'init' && this.middlewares.length < 1) {
      this.middlewares.push(unhandled);
    }
    return new Promise((resolve, reject) => {
      this.middlewares.push((next, args) => {
        resolve(args);
      });
      this._execute(null, reject).catch(err => reject(err));
    });
  }

}

module.exports = Context;