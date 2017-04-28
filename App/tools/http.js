const http = require('http');

module.exports = (url, callback) => {
    return http.get(url, res => {
        let statusCode = res.statusCode,
            contentType = res.headers['content-type'],
            rawData = '',
            error;

        if (statusCode !== 200) error = new Error(`Your request failed.\n` + `Status Code: ${statusCode}`);
        if (!/^application\/json/.test(contentType)) error = new Error(`Invalid content-type.\n` + `Expected application/json but received ${contentType}`);
        if (error) { console.error(error.message); res.resume(); return; }

        res.setEncoding('utf8');
        res.on('data', chunk => rawData += chunk);
        res.on('end', () => {
            try {
                var parsedData = JSON.parse(rawData);
            }
            catch (e) {
                console.error(e.message);
            }
            finally {
                callback(parsedData);
            }
        }).on('error', e => {
            console.error(`Got error: ${e.message}`);
        });
    });
}