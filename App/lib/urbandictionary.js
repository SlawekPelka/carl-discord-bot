const urban = require('urban');
const dataLog = require('../tools/dataLogger');

module.exports = {
    exec(params, message) {

        let getRandom = () => {
            urban.random().first(res => embedAnswer(res));
        }

        let getDefinition = () => {
            let reqWord = urban(params);
            reqWord.first(res => embedAnswer(res));
        }

        embedAnswer = answer => {
            const embed = {
                color: 2046611,
                title: `Definition of word: ${answer.word}`,
                url: answer.permalink,
                description: `*Definition by user: ${answer.author}*`,
                fields: [{
                        name: "Definition",
                        value: answer.definition
                    },
                    {
                        name: "Example(s)",
                        value: answer.example
                    },
                    {
                        name: "Votes",
                        value: `:thumbsup: ${answer.thumbs_up}  -  :thumbsdown: ${answer.thumbs_down}`
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
                });
        }

        if (params == '') {
            getRandom();
        } else {
            getDefinition();
        }

    },
    metaData() {
        return {
            name: 'Urbandictionary',
            avaliableOptions: '-',
            description: 'Get definition of a word from Urbandictionary',
            usage: '<prefix> urban <word>',
            example: `!c urban facepalm`,
            group: 'fun',
            execWith: 'urban'
        }
    }
}