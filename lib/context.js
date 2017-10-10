/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
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
const EventEmitter = require('events');
const stp = require('stp');
const debug = require('debug')('context');

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
    this.pipeline = opts.pipeline || [];
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

  async _loadLocalePipeline() {
    if (!(await this.configIsExists())) return [];
    let localConfigs = utils.confman.load(this.configPath);
    debug('local configs', localConfigs);
    if (!localConfigs || !localConfigs.pipe) return [];
    let list = localConfigs.pipe[this.command];
    return list || [];
  }

  async _mergeRemotePipeline(list) {
    if (!(await this.configIsExists())) return [];
    let pipe = (await configs.getRemoteConf('pipe')) || {};
    list = list || [];
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

  async _loadPipeline() {
    if (!(await this.configIsExists())) return [];
    let list = await this._loadLocalePipeline();
    return this._mergeRemotePipeline(list);
  }

  async _installProjectDeps() {
    if (!(await this.configIsExists())) return;
    let modulesPath = path.resolve(this.cwd, './node_modules');
    let packagePath = path.resolve(this.cwd, './package.json');
    if (fs.existsSync(modulesPath) || !fs.existsSync(packagePath)) return;
    console.info('Install deps...');
    await mod.install();
    console.info('Done');
  }

  async _execQueue(middlewares, args, onFail) {
    let handler = middlewares.shift();
    if (!handler) return;
    let next = (args) => {
      if (next.__result) return next.__result;
      next.__result = this._execQueue(middlewares, args, onFail)
        .catch(err => onFail(err));
      return next.__result;
    };
    return handler.call(this, next, this, args);
  }

  _convertOpts(item) {
    utils.each(item, (name, value) => {
      if (utils.isString(value)) {
        item[name] = stp(value)(this);
      }
      if (utils.isObject(value)) {
        item[name] = this._convertOpts(value);
      }
    });
    return item;
  }

  async load(opts) {
    if (utils.isFunction(opts)) return opts;
    if (!opts || !opts.name) {
      throw new Error('Invalid pipeline config');
    }
    opts = this._convertOpts(opts);
    let modFactory;
    this.console.info(`Load middleware \`${opts.name}\`...`);
    if (opts.location) {
      modFactory = require(path.resolve(this.cwd, opts.location));
    } else {
      modFactory = await middleware.require(opts.name, this.cwd);
    }
    if (!utils.isFunction(modFactory)) {
      throw new Error(`Invalid middleware '${opts.name}'`);
    } else {
      this.console.info('Done');
    }
    return await modFactory.call(this, opts, this);
  }

  async exec(optsArray, initailArgs) {
    if (!utils.isArray(optsArray)) optsArray = [optsArray];
    let middlewares = [];
    for (let opts of optsArray) {
      middlewares.push(await this.load(opts));
    }
    return new Promise((resolve, reject) => {
      middlewares.push((next, ctx, args) => {
        resolve(args);
      });
      this._execQueue(middlewares, initailArgs, reject)
        .catch(err => reject(err));
    });
  }

  async run() {
    await this._installProjectDeps();
    if (!this.pipeline || this.pipeline.length < 1) {
      this.pipeline = await this._loadPipeline();
    }
    if (this.command != 'init' && this.pipeline.length < 1) {
      this.pipeline.push(unhandled);
    }
    return this.exec(this.pipeline);
  }

}

module.exports = Context;