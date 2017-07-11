const request = require('request-promise-native');
const messageAwait = require('../tools/messageAwait');
const YouTube = require('../tools/youtubeCall');
const grab = require('../data_storage/grab');

module.exports = {
    exec(params, message) {
        const defaults = {
            url: 'https://www.googleapis.com/youtube/v3',
            key: grab.securityTokens('google_token'),
            limit: 5
        }

        try {
            YouTube(params, defaults.limit).then(res => {
                let list = {
                    "names": [],
                    "ids": []
                }

                for (let i = 0; i < res.length; i++) {
                    list.names.push(`${i + 1}: ${res[i].snippet.title}`);
                    list.ids.push(res[i].id.videoId);
                }

                const embed = {
                    color: 13565967,
                    author: {
                        name: `Showing top 5 results for ${params}`,
                        icon_url: 'https://www.youtube.com/yt/brand/media/image/YouTube-icon-full_color.png'
                    },
                    description: 'Respond with a number of the video',
                    fields: [{
                        name: "Found those..",
                        value: list.names.join('\n')
                    }]
                }

                message.channel.send(embed).then(m => {
                    messageAwait(message, defaults.limit).then(chosen => {
                        m.delete();
                        m.channel.send(`https://www.youtube.com/watch?v=${list.ids[chosen]}`);
                    });
                });
            });
        } catch (e) {
            message.channel.send('Failed to get the requested video!');
            console.error(e.stack);
        }
    },
    metaData() {
        return {
            name: 'Youtube search',
            avaliableOptions: '-',
            description: 'Search videos on youtube',
            usage: '<prefix> yt <videoName>',
            example: `!c youtube rick roll`,
            group: 'utility',
            execWith: 'yt'
        }
    }
}