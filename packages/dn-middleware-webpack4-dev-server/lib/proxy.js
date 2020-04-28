const url = require('url');

function ensureSlash (path, needsSlash) {
  const hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${path}/`;
  } else {
    return path;
  }
}

/**
 * @param {Array<Proxy>} proxy - webpack dev server proxy list
 * @param {Object} params - self proxy config
 * @param {String} params.homepage -
 * @param {String} params.protocol -
 * @param {String} params.port -
 * @param {String} params.publicPath -
 * @return {Array} Proxy proxy list
 */
module.exports = (
  proxy = [],
  { homepage, protocol, port, publicPath }
) => {
  let homepageHost = undefined;
  let homepageDir = '/';
  let homepageReg = undefined;
  // 跟 index.html 在同一个目录下服务出来的其它 meta 文件
  let metaFilesReg = undefined;
  if (homepage) {
    const { host: hph, pathname: hpd } = url.parse(homepage, false, true) || {};
    // `homepageDir` can be `null`, otherwise must starts with `/`,
    // `url.parse('//aaa.com', false, true).pathname` => `null`
    homepageHost = hph;
    homepageReg = hpd;

    if (homepageDir) {
      if (/.*\/index\.html?$/.test(homepageDir)) {
        //  because `url.resolve('/aaa/bbb/index.html', '.')` => '/aaa/bbb/'
        homepageDir = url.resolve(homepageDir, '.');
      }
      homepageDir = ensureSlash(homepageDir, false);

      // eslint-disable-next-line no-useless-escape
      homepageReg = new RegExp(`^${homepageDir}(?:/index\.html)?$`);
      metaFilesReg = new RegExp(
        // eslint-disable-next-line no-useless-escape
        `^${homepageDir}(favicon\.ico|manifest\.json)?$`, 'i'
      );
    }
  }

  let publicHost, publicBasePath;
  if (publicPath) {
    const { host, pathname } = url.parse(publicPath, true, true);
    if (host) {
      publicHost = host;
    }
    publicBasePath = pathname;
  }

  const proxyCommonConfig = {
    // eslint-disable-next-line no-undef
    logLevel: process.env.DN_DEBUG === 'true' ? 'debug' : 'warn',
    changeOrigin: true,
    xfwd: true
  };
  proxy.unshift(
    // Proxy index.html and the meta files that are accessed by `homepage`
    Object.assign({
      context: (pathname, req) => {
        const condition = req.method === 'GET'
          // `req.hostname` or `req.host` may not contain port at some cases,
          // so use `req.headers.host` instead
          && (homepageHost && req.headers.host.indexOf(homepageHost) >= 0)
          && (
            (homepageReg && homepageReg.test(req.path)) ||
            (metaFilesReg && metaFilesReg.test(req.path))
          );
        // console.log('---1', condition, pathname, req.path);
        return condition;
      },
      target: `${protocol}://localhost:${port}`,
      changeOrigin: true,
      pathRewrite: (reqUrl, req) => {
        // `devServerConfig.publicPath` may contain protocol and host
        const {
          pathname: targetBasePath
        } = url.parse(publicPath, false, true);
        const matchedMetaFile = (req.path.match(metaFilesReg) || [])[1];
        return url.resolve(targetBasePath, matchedMetaFile || 'index.html');
      }
    }, proxyCommonConfig),

    // Proxy public files that are accessed by `publicPath`
    Object.assign({
      context: (pathname, req) => {
        const condition = req.method === 'GET'
          && (publicHost && req.hostname.indexOf(publicHost) >= 0)
          && (publicBasePath && req.path.indexOf(publicBasePath) === 0);

        // console.log('---2', condition, pathname, req.path);
        return condition;
      },
      changeOrigin: true,
      target: `${protocol}://localhost:${port}`
    }, proxyCommonConfig)
  );
  // proxy.push({
  //   context: (pathname) => {
  //     return /\.json$/.test(pathname);
  //   },
  //   target: 'http://11.239.178.183/',
  //   secure: false,
  //   onProxyRes:
  //     addCors ?
  //       (proxyRes, req) => {
  //         const { origin } = req.headers;
  //         if (origin && origin.indexOf(homepageHost) >= 0) {
  //           proxyRes.headers['Access-Control-Allow-Origin'] = origin;
  //           proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
  //         }
  //       } :
  //       undefined
  // });
  // proxy.push(
  //   Object.assign({
  //     context: (pathname, req) => {
  //       const condition = req.hostname.indexOf(host) < 0;
  //       console.log('---3', condition, req.hostname, host);
  //       return condition;
  //     },
  //     target: '<exist so webpack-dev-server use this proxy config>',
  //     router: req => {
  //       const { protocol, host } = url.parse(req.url);
  //       // console.log('-------------------=========================222', req.path);
  //       // console.log(req.url);
        
  //       return `${protocol}//${host}`;
  //     },
  //     onProxyRes:
  //       addCors ?
  //         (proxyRes, req) => {
  //           const { origin } = req.headers;
  //           if (origin && origin.indexOf(homepageHost) >= 0) {
  //             proxyRes.headers['Access-Control-Allow-Origin'] = origin;
  //             proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
  //           }
  //         } :
  //         undefined
  //   }, proxyCommonConfig)
  // );
  // console.log(JSON.stringify(proxy, null, 2));
  
  return proxy;
};