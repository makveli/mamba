/**
 * Returns request data
 * @param req
 * @param res
 * @returns {Promise<any>}
 */
const getData = (req, res) => new Promise(resolve => {
    var buffer = null;
	var bodyLength = 0;
	var chunk = null;
    res.onData((ab, isLast) => {
		chunk = Buffer.from(ab);
		bodyLength += chunk.byteLength;
		if(bodyLength > 8192){
			res.aborted = true;
			buffer = null;
			chunk = null;
			bodyLength = null;
			res.onData = null;
			res.close();
			return resolve();
		}else{
			if (!isLast) {
				buffer = Buffer.concat(buffer ? [buffer, chunk] : [chunk]);
			}else { 
				req.json = null;
					try {
						//req.json = buffer ? Buffer.concat([buffer, chunk]) : chunk;
						if(bodyLength > 2){
							req.json = JSON.parse(buffer ? Buffer.concat([buffer, chunk]) : chunk);
						}
						buffer = null;
						chunk = null;
						bodyLength = null;
					   return resolve();
					} catch (e) {
						res.close();
						e = null;
						res.aborted = true;
						buffer = null;
						chunk = null;
						bodyLength = null;
						resolve();
						return;
					}
				buffer = null;
				chunk = null;
				bodyLength = null;
				return resolve();
					//res.onData = null;
			}
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
				name = matches[i];
                req.params[name.substr(1)] = req.getParameter(i);
            }
        }else{
			req.params = null;
		}
        name = null;
        matches = null;
    }else{
        req.params = null;
    }

    req.method !== 'get' ? await getData(req, res) : null;
    return req;
};
