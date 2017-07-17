const spotifyApi = require('spotify-web-api-node');
const YouTube = require('../tools/youtubeCall');
const grab = require('../data_storage/grab');
const messageAwait = require('../tools/messageAwait');
const dataLog = require('../tools/dataLogger');

module.exports = {
    exec(params, message, options, Client) {
        const defaults = {
            openSpotifyTrack: 'https://open.spotify.com/track/',
            limit: 5
        }

        if (!(params.includes(defaults.openSpotifyTrack) || params.includes('spotify:track:'))) return;

        let trackid = (params.includes(defaults.openSpotifyTrack)) ? params.replace(defaults.openSpotifyTrack, '') : params.split('spotify:track:')[1];

        Client.spotify.getTrack(trackid)
            .then(data => {
                let song = data.body;
                let searchFor = `${song.artists[0].name} - ${song.name}`;

                try {
                    YouTube(searchFor, defaults.limit).then(res => {

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
                            color: 2532955,
                            author: {
                                name: `Showing top ${list.ids.length} results for ${searchFor}`,
                                icon_url: 'https://www.brandsoftheworld.com/sites/default/files/styles/logo-thumbnail/public/072015/spotify_2015.png'
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
                    message.channel.send('There was a problem with getting your video');
                    console.error(e.stack);
                }
            }, e => {
                console.log('Error while fetching song data! ', e);
            });
    },
    metaData() {
        return {
            name: 'Spotify to youtube',
            avaliableOptions: '-',
            description: 'Convert spotify URI to youtube video',
            usage: '<prefix> spofiyt <spotifyURI>',
            example: `!c spofiyt spotify:track:4uLU6hMCjMI75M1A2tKUQC`,
            group: 'utility',
            execWith: 'spofiyt'
        }
    }
}