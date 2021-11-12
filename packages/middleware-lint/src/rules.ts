import { debug } from "./utils";

const isObject = (value: any): boolean => value !== null && typeof value === "object";

type Rules = Record<string, string | number | [string | number, any]> | null;

const ruleMerge = (rules: Rules, options: { console: Console }): Rules => {
  debug("ruleMerge.rules", rules);
  const logger = options.console;
  if (!isObject(rules)) {
    return null;
  }
  const newRules: Rules = {};
  // Only allow warn or error in local .eslintrc.yml file
  const isLegal = (rule: string | number) => {
    if (typeof rule === "string" && ["warn", "error"].includes(rule)) {
      return true;
    } else if (typeof rule === "number" && [1, 2].includes(rule)) {
      return true;
    }
    return false;
  };
  Object.entries(rules).forEach(([name, rule]) => {
    let isLegalRule = true;
    if (Array.isArray(rule)) {
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
  debug("ruleMerge.newRules", newRules);
  return Object.keys(newRules).length ? newRules : null;
};

export default ruleMerge;
