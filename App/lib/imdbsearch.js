const imdb = require('imdb-api');
const moment = require('moment');

module.exports = {
    exec(params, message) {
        try {

            let embedInfo = movie => {
                if (!movie) return message.channel.send(`We couldn't find **${params}** in the IMDB database.\nAre you sure you spelled it correctly?`);

                let rateSources = [];
                movie.ratings.forEach(src => {
                    rateSources.push(`${src.Source}: ${src.Value}\n`);
                });


                const embed = {
                    color: 16100149,
                    author: {
                        name: movie.title,
                        url: movie.imdburl
                    },
                    description: '',
                    fields: [
                        {
                            name: 'Type',
                            value: movie.type,
                            inline: true
                        },
                        {
                            name: 'Rated',
                            value: movie.rated,
                            inline: true
                        },
                        {
                            name: 'Country',
                            value: movie.country,
                            inline: true
                        },
                        {
                            name: 'Rating',
                            value: movie.rating,
                            inline: true
                        },
                        {
                            name: 'Run time',
                            value: movie.runtime,
                            inline: false
                        },
                        {
                            name: 'Released',
                            value: moment(movie.released).format("LL"),
                            inline: false
                        },
                        {
                            name: 'Gengre(s)',
                            value: movie.genres,
                            inline: false
                        },
                        {
                            name: 'Director(s)',
                            value: movie.director,
                            inline: false
                        },
                        {
                            name: 'Writer',
                            value: movie.writer,
                            inline: false
                        },
                        {
                            name: 'Actors',
                            value: `\`${movie.actors}\``,
                            inline: false
                        },
                        {
                            name: 'Plot',
                            value: `\`${movie.plot.slice(0, 800)}..\` [Read more](${movie.imdburl})`,
                            inline: false
                        }
                    ]
                }

                message.channel.sendEmbed(embed)
                    .catch(console.error);
            }

            let reqByName = () => {
                imdb.getReq({name: params}, (err, movie) => {
                    if (err) console.error(err.stack);
                    embedInfo(movie);
                });
            }

            let reqById = () => {
                let id = params.replace('http://www.imdb.com/title/', '').split('/')[0];
                imdb.getReq({id: id}, (err, movie) => {
                    if (err) console.error(err.stack);
                    embedInfo(movie);
                });
            }

            if (params.includes('http://www.imdb.com/title/')) {
                reqById();
            } else {
                reqByName();
            }
        } catch (e) {
            console.error(e);
            message.channel.send('There was a problem with requesting your movie!');
        }
    },
    metaData() {
        return {
            name: 'IMDB search',
            avaliableOptions: '-',
            description: 'Search up movie information on IMDB',
            usage: '<prefix> imdb <movieName>',
            example: `!c imdb spiderman`,
            group: 'utility',
            execWith: 'imdb'
        }
    }
}