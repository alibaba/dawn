const isObject = value => value !== null && typeof value === 'object';

const ruleMerge = (rules, ctx) => {
  const logger = ctx && ctx.console ? ctx.console : console;
  if (!isObject(rules)) return null;
  const newRules = {};
  // Only allow warn or error in local .eslintrc.yml file
  const isLegal = rule => {
    if (typeof rule === 'string' && ['warn', 'error'].includes(rule)) {
      return true;
    } else if (typeof rule === 'number' && [1, 2].includes(rule)) {
      return true;
    }
    return false;
  };
  Object.entries(rules).forEach(([name, rule]) => {
    let isLegalRule = true;
    if (Array.isArray(rule) && rule[0]) {
      isLegalRule = isLegal(rule[0]);
    } else {
      isLegalRule = isLegal(rule);
    }
    if (!isLegalRule) {
      logger.warn(`Local rule is illegal and will be removed: ${name} -> ${JSON.stringify(rule)}`);
      return;
    }
    newRules[name] = rule;
  });

  return Object.keys(newRules).length ? newRules : null;
};

module.exports = ruleMerge;
