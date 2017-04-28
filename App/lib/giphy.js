const grab = require('../data_storage/grab');
const httpGet = require('../tools/http');

module.exports = {
    exec(params, message) {
        let apiURI = `http://api.giphy.com/v1/gifs/search?q=${params}&api_key=${grab.securityTokens('giphy_token')}`;

        function getGif(gifs) {
            let gif = gifs.data[Math.floor(Math.random() * gifs.data.length)];
            message.channel.sendMessage(gif.url).catch(err => {
                console.error(err.stack);
            });
        }

        httpGet(apiURI, getGif);
    },
    metaData() {
        return {
            name: 'giphy',
            avaliableOptions: '-',
            description: 'Search for a gif on giphy',
            usage: '<prefix> gif <searchTerm>',
            example: `!c gif cute cats`,
            group: 'fun',
            execWith: 'gif',
            image: 'http://i.imgur.com/s1lvPhS.png'
        }
    }
}