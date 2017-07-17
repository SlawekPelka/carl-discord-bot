const lyrics = require('lyrics-fetcher');
const request = require('request-promise-native');
const YouTube = require('../tools/youtubeCall');
const messageAwait = require('../tools/messageAwait');
const dataLog = require('../tools/dataLogger');

module.exports = {
    exec(params, message, options, client) {

        try {
            let cleanName = params.replace(/[1-5]:\s|(?!\-|\s)(\W.+)/g, '');
            let cleanSplit = cleanName.split(/\s+\W+\s+/g);
            let artist = cleanSplit[0];
            let songTitle = cleanSplit[1];

            lyrics.fetch(artist, songTitle, (err, songData) => {
                if (err) console.error(err);

                let completeMessage = `Lyrics for **${cleanName}**\n\`\`\`${songData}\`\`\`\n*Powered by: https://makeitpersonal.co/*`;
                message.author.send(completeMessage).then(m => {
                    dataLog.resolveOveralUsage(
                        message.guild.id,
                        message.author.id,
                        m.id,
                        module.exports.metaData().name
                    );
                })
            });
        } catch (e) {
            message.channel.send('There was a problem with getting the requested lyrics!');
            console.error(e.stack);
        }


    },
    metaData() {
        return {
            name: 'Search lyrics',
            avaliableOptions: '-',
            description: 'Get the lyrics for your favorite song straigt into your dm\'s',
            usage: '<prefix> sing <author> - <songName>',
            example: '!c sing metallica - enter the sandman',
            group: 'fun',
            execWith: 'sing'
        }
    }
}