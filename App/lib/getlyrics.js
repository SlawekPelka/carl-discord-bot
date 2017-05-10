const lyrics = require('lyrics-fetcher');
const request = require('request-promise-native');
const YouTube = require('../tools/youtubeCall');
const messageAwait = require('../tools/messageAwait');

module.exports = {
    exec(params, message, options, client) {

        const defaults = {
            limit: 5,
            urlspotify: 'https://api.spotify.com/v1',
            openSpotifyTrack: 'https://open.spotify.com/track/'
        }

        let getLyrics = name => {
            try {
                let cleanName = name.replace(/[1-5]:\s|(?!\-|\s)(\W.+)/g, '');
                let cleanSplit = cleanName.split(/\s+\W+\s+/g);
                let artist = cleanSplit[0];
                let songTitle = cleanSplit[1];

                lyrics.fetch(artist, songTitle, (err, songData) => {
                    if (err) console.error(err);

                    let completeMessage = `Lyrics for **${cleanName}**\n\`\`\`${songData}\`\`\`\n*Powered by: https://makeitpersonal.co/*`;
                    message.author.send(completeMessage);
                });
            } catch (e) {
                message.channel.send('There was a problem with getting the requested lyrics!');
                console.error(e.stack);
            }
        }

        let fromSpotify = async () => {
            try {
                let trackid = (params.includes(defaults.openSpotifyTrack)) ? params.replace(defaults.openSpotifyTrack, '') : params.split('spotify:track:')[1];

                let searchResultSpotify = await request(`${defaults.urlspotify}/tracks/${trackid}`);
                    searchResultSpotify = JSON.parse(searchResultSpotify);
                let searchFor = `${searchResultSpotify.artists[0].name} - ${searchResultSpotify.name}`;

                YouTube(searchFor, defaults.limit).then(res => {
                    let list = {
                        "names": []
                    }

                    for (let i = 0; i < res.length; i++) {
                        list.names.push(`${i + 1}: ${res[i].snippet.title}`);
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
                            getLyrics(list.names[chosen]);
                        });
                    });
                });
            } catch (e) {
                console.error(e);
                message.channel.send('There was a problem with requested lyrics!');
            }
        }

        if (params.includes('spotify')) {
            fromSpotify();
        } else {
            getLyrics(params);
        }

    },
    metaData() {
        return {
            name: 'Search lyrics',
            avaliableOptions: '-',
            description: 'Get the lyrics for your favorite song straigt into your dm\'s',
            usage: '<prefix> sing <songName|youtubeUrl|spotifyURI>',
            example: `!c sing metallica - enter the sandman, c sing spotify:track:5VOoT3AIIStTSN8cSMrSD4`,
            group: 'fun',
            execWith: 'sing'
        }
    }
}