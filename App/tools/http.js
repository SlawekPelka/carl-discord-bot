const http = require('http');

module.exports = {
    get: function(url, callback) {
        return http.get(url, (res) => {
            const statusCode = res.statusCode,
                contentType = res.headers['content-type'];

            let error;
            if (statusCode !== 200) {
                error = new Error(`Your request failed.\n` + `Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
                error = new Error(`Invalid content-type.\n` + `Expected application/json but received ${contentType}`);
            }
            if (error) {
                console.warn(error.message);
                res.resume();
                return;
            }

            let rawData = '';

            res.setEncoding('utf8');
            res.on('data', (chunk) => rawData += chunk);
            res.on('end', () => {
                try {
                    var parsedData = JSON.parse(rawData);
                }
                catch (e) {
                    console.warn(e.message);
                }
                finally {
                    callback(parsedData);
                }
            }).on('error', (e) => {
                console.warn(`Got error: ${e.message}`);
            });
        })
    }
}