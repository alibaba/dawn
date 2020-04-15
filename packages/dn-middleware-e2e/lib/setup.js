require('ts-node').register({
  project: require.resolve('./tsconfig.json'),
});

const mocha = require('mocha');
const puppeteer = require('puppeteer');

mocha.before(async () => {
  global.browser = await puppeteer.launch({
    headless: true,
    slowMo: 0,
    defaultViewport: {
      width: 1000,
      height: 600,
    }
  });
});

