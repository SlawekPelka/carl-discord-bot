const urban = require('urban');

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
            message.channel.send(`Definition of word: **${answer.word}** according to user **${answer.author}**\n\n*${answer.definition}*\n\n**Example**: ${answer.example}`);
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