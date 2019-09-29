async function getSolutionConf(ctx) {
  const { solution } = await ctx.loadLocalConfigs();
  return solution || {};
}

async function pickPackages(ctx) {
  const { packages = [] } = await getSolutionConf(ctx);
  const answer = await ctx.inquirer.prompt([{
    type: 'checkbox', name: 'packages',
    message: 'Please select the target package',
    choices: packages.map(pkg => ({ name: pkg, value: pkg })),
  }]);
  return answer;
}

module.exports = () => {
  return async (next, ctx) => {
    ctx.console.log('Solution mode enabled');
    const { packages } = await pickPackages(ctx);
    ctx.console.log('packages', packages);
    next();
  };
};