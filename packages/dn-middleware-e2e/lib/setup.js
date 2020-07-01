require('ts-node').register({
  project: require.resolve('../tsconfig.json'),
});

global.puppeteer = require('puppeteer');
