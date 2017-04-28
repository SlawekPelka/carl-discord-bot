const grab = require('../data_storage/grab');
const YouTube = require('youtube-node');

module.exports = (searchTerm, limit) => {
    return new Promise((resolve, reject) => {
        try {
            let youTube = new YouTube();
            youTube.setKey(grab.securityTokens('google_token'));

            youTube.search(searchTerm, limit, (err, result) => {
                resolve(result.items);
            });
        } catch (e) {
            reject(e.stack);
        }
    });
}