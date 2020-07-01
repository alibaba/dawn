import assert from 'assert';
import { launch, Browser } from 'puppeteer';

describe('demo test', function () {

  let browser: Browser;
  beforeEach(async function () {
    browser = await launch({
      headless: true,
      slowMo: 0,
      defaultViewport: {
        width: 1000,
        height: 600,
      }
    });
  });

  it('check title', async function () {
    const page = await browser.newPage();
    browser
    await page.goto('https:/www.baidu.com/');
    const title = await page.title();
    assert.equal(title, '百度一下，你就知道');
  });

});