const { resolve, normalize } = require('path');
const { existsSync } = require('fs');
const { EOL } = require('os');

async function getSolutionConf(ctx) {
  if (ctx.__solution) return ctx.__solution;
  const { solution } = await ctx.loadLocalConfigs();
  ctx.__solution = Object.assign({
    root: './packages',
    unified: true,
  }, solution);
  return ctx.__solution;
}

async function getPackageRoot(ctx, package) {
  const conf = await getSolutionConf(ctx);
  const root = resolve(ctx.cwd, conf.root);
  return resolve(root, package);
}

async function getAllPackages(ctx) {
  const { packages = [] } = await getSolutionConf(ctx);
  if (ctx.__packages) return ctx.__packages;
  ctx.__packages = await Promise.all(packages.map(async ({ path, deps }) => {
    const root = await getPackageRoot(ctx, path);
    const packageFile = resolve(root, './package.json');
    const package = require(packageFile);
    const name = package.name;
    const value = root;
    return { root, path, deps, name, value, package, packageFile };
  }));
  return ctx.__packages;
}

async function pickPackages(ctx) {
  const packages = await getAllPackages(ctx);
  const { selected } = await ctx.inquirer.prompt([{
    type: 'checkbox', name: 'selected',
    message: 'Please select the target packages',
    validate: (list) => list && list.length > 0,
    choices: packages,
  }]);
  return packages.filter(pkg => selected.indexOf(pkg.value) > -1);
}

async function execInPackage(ctx, pkg, cmd, env) {
  ctx.console.warn(`Executing '${cmd}' in ${pkg.name}`);
  return ctx.utils.exec(cmd, { env, cwd: pkg.root });
}

async function npmExecInPackage(ctx, pkg, cmd) {
  ctx.console.warn(`Executing 'npm ${cmd}' in ${pkg.name}`);
  return ctx.mod.exec(cmd, { cwd: pkg.root });
}

async function installInPackage(ctx, pkg, remote) {
  ctx.console.warn(`Install '${remote}' to ${pkg.name}`);
  return ctx.mod.exec(`install ${remote}`, { cwd: pkg.root });
}

async function wait(promise, timeout = 0) {
  if (!promise || timeout < 1) return promise;
  return new Promise((resolve, reject) => {
    let aborted = false;
    promise.then(value => {
      if (aborted) return;
      resolve(value);
    }).catch(reject);
    setTimeout(() => resolve(), timeout);
  })
}

async function execCommand(ctx, cmd, { all, timeout, npm, env } = {}) {
  const packages = all ? await getAllPackages(ctx) : await pickPackages(ctx);
  if (!cmd) {
    cmd = (await ctx.inquirer.prompt([{
      type: 'input', name: 'cmd',
      message: 'Please input command',
      validate: cmd => !!cmd,
    }])).cmd;
  }
  return packages.reduce(async (prev, pkg) => {
    await wait(prev, timeout || 0);
    return npm ? npmExecInPackage(ctx, pkg, cmd) :
      execInPackage(ctx, pkg, cmd, env);
  }, null);
}

async function linkPackage(ctx, pkg) {
  if (!pkg || !pkg.deps || pkg.deps.length < 1) return;
  const deps = (await getAllPackages(ctx))
    .filter(item => pkg.deps.indexOf(item.path) > -1);
  await deps.reduce(async (prev, current) => {
    await prev;
    await npmExecInPackage(ctx, pkg, `link ${current.name}`);
    pkg.package.dependencies = {
      ...(pkg.package.dependencies || {}),
      [current.name]: `^${current.package.version}`
    };
  }, null);
  await writePackage(ctx, pkg);
}

async function writePackage(ctx, pkg) {
  const { packageFile, package } = pkg;
  const { writeFile } = ctx.utils;
  return writeFile(packageFile, JSON.stringify(package, null, '  ') + EOL);
}

async function clearLinks(ctx) {
  const packages = await getAllPackages(ctx);
  await Promise.all(packages.map(async item => {
    packages.forEach(dep => {
      delete item.package.dependencies[dep.name];
      delete item.package.devDependencies[dep.name];
    });
    await writePackage(ctx, item);
  }));
}

async function linkAllPackages(ctx) {
  ctx.console.warn('Link all packages');
  await clearLinks(ctx);
  await execCommand(ctx, `link`, { all: true, npm: true });
  const packages = await getAllPackages(ctx);
  await Promise.all(packages.map(async (pkg) => {
    await linkPackage(ctx, pkg);
  }));
}

async function create(ctx) {
  const { name } = await ctx.inquirer.prompt([{
    type: 'input', name: 'name',
    message: 'Please input a package name',
    validate: name => !!name,
  }]);
  const conf = await getSolutionConf(ctx);
  const root = resolve(ctx.cwd, conf.root);
  const fullPath = resolve(root, name);
  if (existsSync(fullPath)) {
    return ctx.console.error('Already exist:', name);
  }
  await ctx.utils.mkdirp(fullPath);
  await ctx.utils.exec('dn init', { cwd: fullPath });
}

async function install(ctx) {
  const packages = await pickPackages(ctx);
  const { remote } = await ctx.inquirer.prompt([{
    type: 'input', name: 'remote',
    message: 'Please input remote package',
    validate: remote => !!remote,
  }]);
  return packages.reduce(async (prev, pkg) => {
    await prev;
    return installInPackage(ctx, pkg, remote);
  }, null);
}

async function add(ctx) {
  const { type } = await ctx.inquirer.prompt([{
    type: 'list', name: 'type',
    message: 'Please select add type',
    choices: [
      { name: 'Create a new local package', value: 'create' },
      { name: 'Install a remote package ', value: 'install' },
    ],
  }]);
  return type === 'create' ? create(ctx) : install(ctx);
}

async function publish(ctx) {
  const { unified } = await getSolutionConf(ctx);
  if (unified) {
    await ctx.exec({ name: 'version' });
    const packages = await getAllPackages(ctx);
    await Promise.all(packages.map(async item => {
      item.package.version = ctx.version;
      await writePackage(ctx, item);
    }));
  }
  await ctx.exec({ name: 'submitter' });
  await execCommand(ctx, `dn publish`, {
    all: unified,
    env: { ...process.env, __version__: ctx.version },
  });
}

module.exports = () => {
  return async (next, ctx) => {
    ctx.console.log('Solution mode enabled');
    const { cmd, $1 } = ctx.cli.params;
    switch (cmd) {
      case 'r':
      case 'run':
        if ($1 === 'link') await linkAllPackages(ctx);
        else if ($1) await execCommand(ctx, `dn ${$1}`, { all: true });
        else if (!$1) await execCommand(ctx);
        break;
      case 'd':
      case 'dev':
        await execCommand(ctx, `dn ${ctx.command}`, {
          all: true, timeout: 10000
        });
        break;
      case 'a':
      case 'add':
        await add(ctx);
        break;
      case 'p':
      case 'publish':
        await publish(ctx);
        break;
      default:
        await execCommand(ctx, `dn ${ctx.command}`, { all: true });
        break;
    }
    next();
  };
};