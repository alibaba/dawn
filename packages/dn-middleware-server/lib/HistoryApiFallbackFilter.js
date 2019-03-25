const path = require('path');
const STATIC_EXT = [
  '.html', '.htm', '.js', '.css', '.gif', '.jpg', '.jpeg', '.png',
  '.woff', '.svg', '.eot', '.otf', '.fon', '.font', '.ttf', '.ttc', '.woff2',
  '.text', '.txt', '.md', '.yaml', '.json', '.jsonp',
  '.jsp', '.do', '.asp', '.aspx', '.php'
];

function HistoryApiFallbackFilter() { };

HistoryApiFallbackFilter.prototype.onRequest = function (ctx, next) {
  const originNotFound = ctx.notFound;
  ctx.notFound = function (...args) {
    const extname = path.extname(this.req.url);
    if (STATIC_EXT.some(ext => ext === extname)) {
      return originNotFound.call(this, ...args);
    }
    this.transfer('/');
  };
  return next();
};

HistoryApiFallbackFilter.prototype.onResponse = function (ctx, next) {
  //检查 statusCode & mime
  const mime = ctx.server.mime('.html');
  if (ctx.response.statusCode != 200 ||
    ctx.response.mime != mime ||
    !ctx.response.contentStream) {
    return next();
  }
  //处理内容
  let buffer = '';
  ctx.response.contentStream.on('data', (chunk) => buffer += chunk);
  ctx.response.contentStream.on('end', () => {
    buffer = buffer.toString().replace('</head>', '<base href="/" /></head>');
    ctx.text(buffer, 'text/html', 200);
  });
}

module.exports = HistoryApiFallbackFilter;