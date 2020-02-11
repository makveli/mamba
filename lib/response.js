
/**
 * Modify default response
 * @param req
 * @param res
 * @returns {*}
 */

module.exports = (req, res) => {
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
    res.getHeader = key => {
        return res.headers[key];
    };

    res.header = res.setHeader = (key, value) => {
        res.headers[key] = value;
    };

    res.status = status => {
        res.statusCode = String(status);
        return res;
    };

    res.end = (result, encoding = 'utf-8') => {
        const {headers = {}, statusCode = '200'} = res;
        res.writeStatus(String(statusCode));

        for (const k in headers) {
            res.writeHeader(k, String(headers[k]));
        }

        return res._end(result, encoding);
    };

    res.tryEnd = (ab, size) => {
        const {headers = {}, statusCode = '200'} = res;
        res.writeStatus(String(statusCode));

        for (const k in headers) {
            res.writeHeader(k, String(headers[k]));
        }

        return res._tryEnd(ab, size);
    };

    res.redirect = path => {
        res.status(301);
        res.header('Location', path);
        res.end();
    };

    res.json = result => {
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
