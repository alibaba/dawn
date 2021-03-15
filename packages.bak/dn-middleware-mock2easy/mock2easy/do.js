var http = require('http');
var qs = require('querystring');


function getBody(request, response, callback) {
  if (request.method == 'POST') {
    var body = '';
    request.on('data', function (data) {
      body += data;
      if (body.length > 1e6) {
        request.connection.destroy();
      }
    });
    request.on('end', function () {
      callback(null, qs.parse(body));
    });

    request.on('error', function (e) {
      callback(e);
    });

  } else {
    callback(null);
  }
}

var endsWith = function(str,suffix){
   if(str.indexOf(suffix) == -1){
   return false;
   }
   return str.length == str.indexOf(suffix) + suffix.length;
}


module.exports = function (req, res, next) {

  if(typeof req.url != 'string') return next();

  if(req.url.indexOf('?') ==-1){
    if(!endsWith(req.url,".json")) return next();
  }else{
    var _url = req.url.split('?')[0];
    if(!endsWith(_url,".json")) return next();
  }

  getBody(req, res, function (err, body) {
    if (err) {
      return console.log(e);
    }

    req.body = body;
    for (var name in req.body) {
      req.body[name] = encodeURI(req.body[name]);
    }

    var _write = JSON.stringify(req.body);

    var options = {
      hostname: '127.0.0.1',
      port: 3005,
      path: req.url,
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    };


    if (req.method == 'POST') {
      options.headers['Content-Length'] = _write ? _write.length : 0;
    }

    var _req = http.request(options, function (_res) {

      var data = '';
      _res.on('data', function (chunk) {
        data += chunk;
      });
      _res.on('end', function () {
        res.end(data);
      });
    });

    _req.on('error', function (e) {
      console.log(e);
    });

    if (req.method == 'POST' && _write) {
      _req.write(_write);
    }

    _req.end();
  });

};




