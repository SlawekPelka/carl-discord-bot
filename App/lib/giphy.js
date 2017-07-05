const grab = require('../data_storage/grab');
const httpGet = require('../tools/http');

module.exports = {
    exec(params, message, options) {
        let gif = '';
        let apiURI = `http://api.giphy.com/v1/gifs/search?q=${params}&api_key=${grab.securityTokens('giphy_token')}`;
        let option = options != '' ? options[0] : '';

        function getGif(gifs) {
            try {
                // Original idea for select option by Joe: https://github.com/jddg5wa
                if (option.includes('select')) {
                    gif = gifs.data[Number(option.split(':')[1]) - 1];
                } else {
                    gif = gifs.data[Math.floor(Math.random() * gifs.data.length)];
                }
                
                message.channel.send(gif.url).catch(err => {
                    console.error(err.stack);
                });
            } catch (e) {
                message.channel.send('Sorry, I couldn\'t get the requested gif. Please try again.');
            }
        }

        httpGet(apiURI, getGif);
    },
    metaData() {
        return {
            name: 'giphy',
            avaliableOptions: 'select:<number>',
            description: 'Search for a gif on giphy',
            usage: '<prefix> gif <searchTerm>',
            example: `!c gif cute cats`,
            group: 'fun',
            execWith: 'gif',
            image: 'http://i.imgur.com/s1lvPhS.png'
        }
    }
}