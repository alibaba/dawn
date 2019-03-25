const path = require('path');
const STATIC_EXT = [
  '.html', '.htm', '.js', '.css', '.gif', '.jpg', '.jpeg', '.png',
  '.woff', '.svg', '.eot', '.otf', '.fon', '.font', '.ttf', '.ttc', '.woff2',
  '.text', '.txt', '.md', '.yaml', '.json', '.jsonp',
  '.jsp', '.do', '.asp', '.aspx', '.php'
];

function NotFoundFilter() { };

NotFoundFilter.prototype.onRequest = function (context, next) {
  const originNotFound = context.notFound;
  context.notFound = function (...args) {
    const extname = path.extname(this.req.url);
    if (STATIC_EXT.some(ext => ext === extname)) {
      return originNotFound.call(this, ...args);
    }
    this.transfer('/');
  };
  return next();
};

module.exports = NotFoundFilter;