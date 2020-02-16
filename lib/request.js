/**
 * Returns request data
 * @param req
 * @param res
 * @returns {Promise<any>}
 */

const getData = (req, res) => new Promise(resolve => {
    var buffer;
	var bodyLength = 0;
	var chunk = null;
    res.onData((ab, isLast) => {
		if(bodyLength > 8192){
			res.aborted = true;
			res.close();
			buffer = null;
			chunk = null;
			bodyLength = null;
			return resolve();
		}else{
			chunk = Buffer.from(ab);
			bodyLength += chunk.byteLength;
			if (isLast) {
				try {
				   req.json = JSON.parse(buffer ? Buffer.concat([buffer, chunk]) : chunk);
				   req['reqJson'] = JSON.parse(buffer ? Buffer.concat([buffer, chunk]) : chunk);
				   buffer = null;
				   chunk = null;
				   bodyLength = null;
				} catch (e) {
				   req.json = null;
				   buffer = null;
				   chunk = null;
				   bodyLength = null;
				}
				return resolve();
			}

			buffer = Buffer.concat(buffer ? [buffer, chunk] : [chunk]);
		}
    });
});

/**
 * Modify default request
 * @param req
 * @param res
 * @returns {Promise<*>}
 */

module.exports = async (req, res) => {
    req.headers = {};
    req.forEach((k, v) => req.headers[k] = v);
    req.method = req.getMethod();
    //req.query = parseQuery(req.getQuery()) || {};
    //req.cookies = parseCookies(req.getHeader('Cookie')) || {};
    req.params = {};
    req.url = req.getUrl();

    if (req.route.includes(':')) {
        var matches = req.route.match(/:([A-Za-z0-9_-]+)/g);
        var name = null;
        if (matches) {
            for (let i in matches) {
                var name = matches[i];
                req.params[name.substr(1)] = req.getParameter(i);
            }
        }else{
			req.params = null;
		}
        name = null;
        
    }else{
        req.params = null;
    }

    req.method !== 'get' ? await getData(req, res) : null;
    return req;
};
