require('babel-core/register')({
  babelrc: true,
  cache: true,
  presets: [
    require.resolve('babel-preset-es2015'),
    require.resolve('babel-preset-react'),
    require.resolve('babel-preset-stage-0')
  ],
  plugins: [
    require.resolve('babel-plugin-add-module-exports'),
    require.resolve('babel-plugin-typecheck'),
    require.resolve('babel-plugin-transform-decorators-legacy')
  ]
});

require('babel-polyfill');
const utils = require('ntils');
const jsdom = require('jsdom');

//mock brownser
const JSDOM = jsdom.JSDOM;
const dom = new JSDOM(
  '<!doctype html><html><body><div class="root"></div></body></html>'
  , {
    url: "https://test.com/",
    referrer: "https://test.com/",
    contentType: "text/html",
    includeNodeLocations: true,
  });
global.window = dom.window;
global.navigator = global.navigator || { userAgent: 'node.js' };
utils.each(window, function (name, value) {
  if (name in global) return;
  Object.defineProperty(global, name, {
    get: function () { return value; }
  });
});

//ignore
const noop = function () { return; };
require.extensions['.css'] = noop;
require.extensions['.less'] = noop;
require.extensions['.sass'] = noop;
require.extensions['.scss'] = noop;
require.extensions['.png'] = noop;
require.extensions['.jpg'] = noop;
require.extensions['.jpeg'] = noop;
require.extensions['.gif'] = noop;
require.extensions['.svg'] = noop;

require('./_common');