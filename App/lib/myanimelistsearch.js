const mal = require('popura');
const grab = require('../data_storage/grab');
const messageAwait = require('../tools/messageAwait');
const dataLog = require('../tools/dataLogger');

module.exports = {
    exec(params, message) {
        try {
            const malClient = mal(grab.securityTokens('mal_username'), grab.securityTokens('mal_password'));

            malClient.searchAnimes(params).then(res => {
                let titles = [];
                let limit = 5;

                for (let i = 0; i < limit; i++) {
                    if (res[i] != undefined) {
                        titles.push(`${i + 1}: **${res[i].title}** [${res[i].type}]`);
                    }
                }

                const embed = {
                    color: 2046611,
                    author: {
                        name: `Showing top ${limit} results for ${params}`,
                        icon_url: 'https://i.ppy.sh/6e0c2edb1f0930a7de9c92602bb4545ff7817c21/687474703a2f2f69636f6e732e6462302e66722f732f6d616c2e706e67'
                    },
                    description: 'Respond with a number of the anime',
                    fields: [{
                        name: "Found those..",
                        value: titles.join('\n')
                    }]
                }

                message.channel.sendEmbed(embed).then(m => {
                    messageAwait(message, limit).then(chosen => {
                        m.delete();
                        let chosenAnime = res[chosen];
                        let animeStart = chosenAnime.start_date === '0000-00-00' ? 't.b.a' : chosenAnime.start_date;
                        let animeEnd = chosenAnime.end_date === '0000-00-00' ? '-' : chosenAnime.end_date;
                        let synonyms = chosenAnime.length > 0 ? chosenAnime.synonyms.join(', ') : 'none';

                        let embed = {
                            author: {
                                name: chosenAnime.title,
                                url: `https://myanimelist.net/anime/${chosenAnime.id}`,
                                icon_url: 'https://i.ppy.sh/6e0c2edb1f0930a7de9c92602bb4545ff7817c21/687474703a2f2f69636f6e732e6462302e66722f732f6d616c2e706e67'
                            },
                            color: 2046611,
                            thumbnail: { url: chosenAnime.image },
                            fields: [{
                                    name: 'Synonyms',
                                    value: synonyms
                                },
                                {
                                    name: 'Episodes',
                                    value: chosenAnime.episodes,
                                    inline: true
                                },
                                {
                                    name: 'Status',
                                    value: chosenAnime.status,
                                    inline: true
                                },
                                {
                                    name: 'Type',
                                    value: chosenAnime.type,
                                    inline: true
                                },
                                {
                                    name: 'Score',
                                    value: `${chosenAnime.score}`,
                                    inline: true
                                },
                                {
                                    name: 'Started airing on',
                                    value: animeStart,
                                    inline: true
                                },
                                {
                                    name: 'Ended airing on',
                                    value: animeEnd,
                                    inline: true
                                },
                                {
                                    name: 'About the anime',
                                    value: `${chosenAnime.synopsis.substring(0, 200)}...[Read more](https://myanimelist.net/anime/${chosenAnime.id})`
                                }
                            ]
                        }

                        message.channel.sendEmbed(embed)
                            .then(m => {
                                dataLog.resolveOveralUsage(
                                    m.guild.id,
                                    message.author.id,
                                    m.id,
                                    module.exports.metaData().name
                                );
                            })
                            .catch(console.error);
                    });
                });
            });
        } catch (e) {
            message.channel.send('There was a problem with getting your anime');
            console.error(e.stack);
        }
    },
    metaData() {
        return {
            name: 'Myanimelist search',
            avaliableOptions: '-',
            description: 'Search up information about anime from Myanimelist',
            usage: '<prefix> mal <animeName>',
            example: `!c mal naruto`,
            group: 'utility',
            execWith: 'mal'
        }
    }
}