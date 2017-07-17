const grab = require('../data_storage/grab');
const httpGet = require('../tools/http');
const dataLog = require('../tools/dataLogger');

module.exports = {
    exec(params, message, options) {
        let gif = '';
        let apiURI = `http://api.giphy.com/v1/gifs/search?q=${params}&api_key=${grab.securityTokens('giphy_token')}`;

        function getGif(gifs) {
            try {
                let option = options != '' ? options[0] : '';

                // Original idea for select option by Joe: https://github.com/jddg5wa
                if (option.match(/[0-9]+/)) {
                    gif = gifs.data[Number(option) - 1];
                } else {
                    gif = gifs.data[Math.floor(Math.random() * gifs.data.length)];
                }

                message.channel.send(gif.url).then(m => {
                    dataLog.resolveOveralUsage(
                        m.guild.id,
                        message.author.id,
                        m.id,
                        module.exports.metaData().name
                    );
                });
            } catch (e) {
                message.channel.send('Sorry, I couldn\'t get the requested gif. Please try again.');
                console.log(e.stack);
            }
        }

        httpGet(apiURI, getGif);
    },
    metaData() {
        return {
            name: 'giphy',
            avaliableOptions: '<number>',
            description: 'Search for a gif on giphy',
            usage: '<prefix> gif <searchTerm>',
            example: `!c gif cute cats`,
            group: 'fun',
            execWith: 'gif',
            image: 'http://i.imgur.com/s1lvPhS.png'
        }
    }
}