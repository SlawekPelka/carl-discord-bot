const request = require('request-promise-native');
const YouTube = require('../tools/youtubeCall');
const grab = require('../data_storage/grab');
const messageAwait = require('../tools/messageAwait');

module.exports = {
    async exec(params, message) {
        const defaults = {
            urlspotify: 'https://api.spotify.com/v1',
            openSpotifyTrack: 'https://open.spotify.com/track/',
            limit: 5
        }

        if (! ( params.includes(defaults.openSpotifyTrack) || params.includes('spotify:track:') ) ) return;

        let trackid = (params.includes(defaults.openSpotifyTrack)) ? params.replace(defaults.openSpotifyTrack, '') : params.split('spotify:track:')[1];

        let searchResultSpotify = await request(`${defaults.urlspotify}/tracks/${trackid}`);
            searchResultSpotify = JSON.parse(searchResultSpotify);
        let searchFor = `${searchResultSpotify.artists[0].name} - ${searchResultSpotify.name}`;

        try {
            YouTube(searchFor, defaults.limit).then(res => {
                let list = {
                    "names": [],
                    "ids": []
                }

                for (let i = 0; i < res.length; i++) {
                    list.names.push(`${i + 1}: ${res[i].snippet.title}`);
                    list.ids.push(res[i].id.videoId);
                }

                const embed = {
                     color: 2532955,
                     author: {
                        name: `Showing top 5 results for ${searchFor}`,
                        icon_url: 'https://www.brandsoftheworld.com/sites/default/files/styles/logo-thumbnail/public/072015/spotify_2015.png?itok=1MxXaGSs'
                     },
                     description: 'Respond with a number of the video',
                     fields: [
                        {
                            name : "Found those..",
                            value : list.names.join('\n')
                        }
                     ]
                }

                message.channel.sendEmbed(embed).then(m => {
                    messageAwait(message, defaults.limit).then(chosen => {
                        m.delete();
                        m.channel.send(`https://www.youtube.com/watch?v=${list.ids[chosen]}`);
                    });
                });
            });
        } catch (e) {
            message.channel.send('There was a problem with getting your video');
            console.error(e.stack);
        }
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