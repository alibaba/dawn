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
const console = require('./common/console');
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
    this.configName = './.dawn';
    this.configPath = path.resolve(this.cwd, this.configName);
    this.conf = configs;
    this.mod = mod;
  }

  async configIsExists() {
    debug('config name', this.configName);
    const files = await utils.globby([`${this.configName}/**/*.*`, `${this.configName}.*`]);
    debug('config files', files);
    return files.length > 0;
  }

  get project() {
    const pkgFile = path.normalize(`${this.cwd}/package.json`);
    if (!fs.existsSync(pkgFile)) return {};
    try {
      const text = fs.readFileSync(pkgFile).toString();
      return JSON.parse(text);
    } catch (err) {
      return this.console.error(err);
    }
  }

  async loadLocalConfigs() {
    const localConfigs = utils.confman.load(this.configPath);
    debug('local configs', localConfigs);
    return localConfigs || {};
  }

  async _loadLocalAllPipeline() {
    const localConfigs = await this.loadLocalConfigs();
    return localConfigs.pipe || {};
  }

  async _loadLocalePipeline(command) {
    if (!(await this.configIsExists())) return [];
    command = command || this.command;
    const pipelines = await this._loadLocalAllPipeline();
    return pipelines[command] || [];
  }

  async _mergeRemotePipeline(command, list) {
    command = command || this.command;
    if (!(await this.configIsExists())) return [];
    const pipe = (await configs.getRemoteConf('pipe')) || {};
    list = list || [];
    pipe.before = pipe.before || [];
    pipe.after = pipe.after || [];
    const beforeList = pipe.before[command] || [];
    beforeList.reverse();
    beforeList.forEach(item => {
      if (list.some(i => i.name == item.name && !item.force)) return;
      list.unshift(item);
    });
    const afterList = pipe.after[command] || [];
    afterList.forEach(item => {
      if (list.some(i => i.name == item.name && !item.force)) return;
      list.push(item);
    });
    return list;
  }

  async loadPipeline(command) {
    command = command || this.command;
    if (!(await this.configIsExists())) return [];
    const list = await this._loadLocalePipeline(command);
    return this._mergeRemotePipeline(command, list);
  }

  async _installProjectDeps() {
    if (!(await this.configIsExists())) return;
    const modulesPath = path.resolve(this.cwd, './node_modules');
    const packagePath = path.resolve(this.cwd, './package.json');
    if (fs.existsSync(modulesPath) || !fs.existsSync(packagePath)) return;
    await mod.install();
  }

  async _execQueue(middlewares, args, onFail) {
    const middleware = middlewares.shift();
    if (!middleware) return;
    const handler = await this.load(middleware);
    const next = args => {
      if (next.__result) return next.__result;
      next.__result = this._execQueue(middlewares, args, onFail).catch(err => onFail(err));
      return next.__result;
    };
    return handler.call(this, next, this, args);
  }

  unescapeExpr(str) {
    if (!str) return str;
    return str.replace(/\\\{/, '{').replace('/\\}/', '}');
  }

  _parseOpts(opts) {
    utils.each(opts, (name, value) => {
      if (utils.isString(name)) {
        delete opts[name];
        name = this.unescapeExpr(stp(name)(this) || name);
      }
      if (utils.isString(value)) {
        opts[name] = this.unescapeExpr(stp(value)(this));
      } else if (utils.isObject(value)) {
        opts[name] = this._parseOpts(value);
      } else {
        opts[name] = value;
      }
    });
    return opts;
  }

  async load(opts) {
    if (utils.isFunction(opts)) return opts;
    if (!opts || !opts.name) {
      throw new Error('Invalid pipeline config');
    }
    opts = this._parseOpts(opts);
    const modFactory = opts.location
      ? require(path.resolve(this.cwd, opts.location))
      : await middleware.require(opts.name, this.cwd);
    if (!utils.isFunction(modFactory)) {
      throw new Error(`Invalid middleware '${opts.name}'`);
    }
    return modFactory.call(this, opts, this);
  }

  async exec(middlewares, initailArgs) {
    if (!utils.isArray(middlewares)) middlewares = [middlewares];
    return new Promise((resolve, reject) => {
      middlewares.push((next, ctx, args) => {
        resolve(args);
      });
      this._execQueue(middlewares, initailArgs, reject).catch(err => reject(err));
    });
  }

  async run() {
    await this._installProjectDeps();
    if (!this.pipeline || this.pipeline.length < 1) {
      this.pipeline = await this.loadPipeline();
    }
    if (this.command != 'init' && this.pipeline.length < 1) {
      this.pipeline.push(unhandled);
    }
    return this.exec(this.pipeline);
  }
}

module.exports = Context;
