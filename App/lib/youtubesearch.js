const request = require('request-promise-native');
const messageAwait = require('../tools/messageAwait');
const YouTube = require('../tools/youtubeCall');
const grab = require('../data_storage/grab');
const dataLog = require('../tools/dataLogger');

module.exports = {
    exec(params, message) {
        const defaults = {
            limit: 5
        }

        try {
            YouTube(params, defaults.limit).then(res => {
                let list = {
                    "cleanNames": [],
                    "names": [],
                    "ids": []
                }

                for (let i = 0; i < res.length; i++) {
                    if (res[i].id.kind != 'youtube#channel') {
                        list.cleanNames.push(res[i].snippet.title);
                        list.ids.push(res[i].id.videoId);
                    }
                }

                for (let z = 0; z < list.cleanNames.length; z++) {
                    list.names.push(`${z + 1}: ${list.cleanNames[z]}`);
                }

                const embed = {
                    color: 13565967,
                    author: {
                        name: `Showing top ${list.ids.length} results for ${params}`,
                        icon_url: 'https://www.youtube.com/yt/brand/media/image/YouTube-icon-full_color.png'
                    },
                    description: 'Respond with a number of the video',
                    fields: [{
                        name: "Found those..",
                        value: list.names.join('\n')
                    }]
                }

                message.channel.sendEmbed(embed).then(m => {
                    messageAwait(message, defaults.limit).then(chosen => {
                        m.delete();
                        m.channel.send(`https://www.youtube.com/watch?v=${list.ids[chosen]}`)
                            .then(ytmsg => {
                                dataLog.resolveOveralUsage(
                                    ytmsg.guild.id,
                                    message.author.id,
                                    ytmsg.id,
                                    module.exports.metaData().name
                                );
                            })
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