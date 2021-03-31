/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const console = require('console3');
const pkg = require('../package.json');
const path = require('path');
const cmdline = require('cmdline');
const core = require('..');
const Context = core.Context;
const middlewares = core.middlewares;
const debug = require('debug')('cli-core');

core.upgrade.check();

const ALIAS = {
  i: 'init',
  d: 'dev',
  s: 'start',
  b: 'build',
  a: 'add',
  t: 'test',
  p: 'publish',
  r: 'run',
  u: 'update',
  c: 'config',
};

cmdline.onFail = async function (err) {
  if (process.env.DN_DEBUG) {
    console.error(err);
  } else {
    console.error(err.message);
  }
  debug('error', err);
  this.emit('fail', err);
  if (!this.disabledExit) process.exit(1);
}.bind(cmdline);

cmdline.onDone = async function (context) {
  debug('done', context.command);
  this.emit('done', context);
}.bind(cmdline);

cmdline
  .version(pkg.version)
  .help(path.normalize(`@${__dirname}/help.txt`))
  .error(cmdline.onFail)

  .root.command(['init', 'i'])
  .option(['-t', '--template'], 'string')
  .option(['-f', '--force'], 'switch')
  .action(async function (cmd, template) {
    cmd = ALIAS[cmd] || cmd;
    this.set('command', cmd);
    try {
      const downloadCtx = new Context(this, {
        template,
        cmd,
        pipeline: [middlewares.init],
      });
      await downloadCtx.run();
      const context = new Context(this, { template, cmd });
      await context.run();
      cmdline.onDone(context);
    } catch (err) {
      cmdline.onFail(err);
    }
  }, false)

  .root.command(['dev', 'add', 'test', 'build', 'publish', 'start', 'run', 'd', 'a', 't', 'b', 'p', 's', 'r'])
  .option(['-e', '--env'], 'string')
  .action(async function (cmd, env, $1) {
    if (cmd == 'r' || cmd == 'run') {
      cmd = $1 || 'dev';
    }
    cmd = ALIAS[cmd] || cmd;
    this.set('command', cmd);
    process.env.DN_CMD = cmd || '';
    process.env.DN_ENV = env || '';
    process.env.NODE_ENV = env || process.env.NODE_ENV || '';
    try {
      const context = new Context(this, { cmd, env });
      await context.run();
      cmdline.onDone(context);
    } catch (err) {
      cmdline.onFail(err);
    }
  }, false)

  .root.command(['template', 'middleware', 'update', 'u', 'config', 'c'])
  .option(['-f', '--force'], 'switch')
  .action(async function (cmd, force) {
    cmd = ALIAS[cmd] || cmd;
    this.set('command', cmd);
    try {
      await core.commands[cmd].call(this, force);
      cmdline.onDone(this);
    } catch (err) {
      cmdline.onFail(err);
    }
  }, false)

  .root.command(['system', '$'])
  .action(async function (cmd, $1, $2) {
    if ($1 == 'clean') {
      cmd = 'update';
    } else if ($1) {
      cmd = $1;
    }
    this.set('$1', $2);
    if (!core.commands[cmd]) {
      return cmdline.onFail(new Error(`Invalid command: ${cmd}`));
    }
    console.warn('The command is deprecated');
    try {
      await core.commands[cmd].call(this, cmd);
      cmdline.onDone(this);
    } catch (err) {
      cmdline.onFail(err);
    }
  }, false);

module.exports = cmdline;
