"use strict";

/**
 * Modify default response
 * @param req
 * @param res
 * @returns {*}
 */
module.exports = function (req, res) {
  res._end = res.end;
  res._tryEnd = res.tryEnd;
  res.headers = res.headers || {};
  /*
  res.cookie = (key, value, options = {}) => {
      let setCookie = res.headers['Set-Cookie'] || '';
      let cookie = serialize(key, value, options);
       if (setCookie) {
          setCookie = `${setCookie};${cookie}`;
      }
       res.headers['Set-Cookie'] = setCookie;
  };
  */

  res.getHeader = function (key) {
    return res.headers[key];
  };

  res.header = res.setHeader = function (key, value) {
    res.headers[key] = value;
  };

  res.status = function (status) {
    res.statusCode = String(status);
    return res;
  };

  res.end = function (result) {
    var encoding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'utf-8';
    var _res$headers = res.headers,
        headers = _res$headers === void 0 ? {} : _res$headers,
        _res$statusCode = res.statusCode,
        statusCode = _res$statusCode === void 0 ? '200' : _res$statusCode;
    res.writeStatus(String(statusCode));

    for (var k in headers) {
      res.writeHeader(k, String(headers[k]));
    }

    return res._end(result, encoding);
  };

  res.tryEnd = function (ab, size) {
    var _res$headers2 = res.headers,
        headers = _res$headers2 === void 0 ? {} : _res$headers2,
        _res$statusCode2 = res.statusCode,
        statusCode = _res$statusCode2 === void 0 ? '200' : _res$statusCode2;
    res.writeStatus(String(statusCode));

    for (var k in headers) {
      res.writeHeader(k, String(headers[k]));
    }

    return res._tryEnd(ab, size);
  };

  res.redirect = function (path) {
    res.status(301);
    res.header('Location', path);
    res.end();
  };

  res.json = function (result) {
    res.header('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  };
  /*
      res.download = (path, name) => {
          res.header('Content-Disposition', contentDisposition(name || path));
          return res.sendFile(path);
      };
  
      res.sendFile = async file => {
          file = path.join(path.dirname(require.main.filename), file);
  
          try {
              let stats = await fs.stat(file);
  
              if (stats.isDirectory()) {
                  return res.status(403).end();
              }
  
              let type = path.extname(file);
              let stream = fs.createReadStream(file);
              let size = stats.size;
  
              res.header('Content-Type', mime.lookup(type) || 'application/octet-stream');
              return pipeStreamOverResponse(res, stream, size);
          } catch (e) {
              console.error(e);
              res.status(404).end();
          }
      };
  */


  return res;
};
