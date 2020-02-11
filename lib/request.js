const {parse: parseQuery} = require('querystring');
const {parse: parseCookies} = require('cookie');
/**
 * Returns request data
 * @param req
 * @param res
 * @returns {Promise<any>}
 */

const getData = (req, res) => new Promise(resolve => {
    var buffer;

    res.onData((ab, isLast) => {
        var chunk = Buffer.from(ab);

        if (isLast) {
            try {
               req.json = JSON.parse(buffer ? Buffer.concat([buffer, chunk]) : chunk);
               buffer = null;
               chunk = null;
            } catch (e) {
               req.json = null;
               buffer = null;
               chunk = null;
            }
            return resolve();
        }

        buffer = Buffer.concat(buffer ? [buffer, chunk] : [chunk]);
    });
});

/**
 * Modify default request
 * @param req
 * @param res
 * @returns {Promise<*>}
 */

module.exports = async (req, res) => {
    var headers = {};
    req.forEach((k, v) => headers[k] = v);
    req.headers = headers || null;
    headers = null;
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
        }
        name = null;
        
    }else{
        req.params = null;
    }

    req.method !== 'get' ? await getData(req, res) : null;
    return req;
};
