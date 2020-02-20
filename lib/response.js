"use strict";

/**
 * Modify default response
 * @param req
 * @param res
 * @returns {*}
 */
module.exports = function(req, res) {
    res._end = res.end;
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

    res.getHeader = function(key) {
        return res.headers[key];
    };

    res.header = res.setHeader = function(key, value) {
        res.headers[key] = value;
    };

    res.status = function(status) {
        res.statusCode = String(status);
        return res;
    };

    res.end = (result, encoding = 'utf-8') => {

        var k = null;
        if (!res.aborted) {
			res.writeStatus(String(res.statusCode || '200'));
            for (k in res.headers) {
                res.writeHeader(k, String(res.headers[k]));
            }
         
			res.writeHeader("Connection", String("keep-alive"));
            res.tryEnd(result, encoding);
        }
        result = null;
        encoding = null;
        k = null;
        res.headers = null;
    };
    res.send = (result, encoding = 'utf-8') => {

		var k = null;
        if (!res.aborted) {
			res.writeStatus(String(res.statusCode || '200'));
            for (k in res.headers) {
                res.writeHeader(k, String(res.headers[k]));
            }
         
			res.writeHeader("Connection", String("keep-alive"));
            res.tryEnd(result, encoding);
        }
        result = null;
        encoding = null;
        k = null;
        res.headers = null;
		
    };
    /*
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
	*/
    res.json = function(result) {

        if (!res.aborted) {
            res.writeHeader('Content-Type', 'application/json');
            res._end(JSON.stringify(result), 'utf-8');
        }

        result = null;
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