const CatFacts = require('catfacts');
const catfact = new CatFacts();

module.exports = {
    exec(params, message, options, client) {
        try {
            catfact.random(1, fact => message.channel.send(`**Did you know**: ${fact[0]}`));
        } catch (e) {
            return message.channel.send('There was a problem with your cat fact.');
        }
    },
    metaData() {
        return {
            name: 'catfacts',
            avaliableOptions: '-',
            description: 'Search up a random cat fact',
            usage: '<prefix> catfact',
            example: `!c catfact`,
            group: 'fun',
            execWith: 'catfact'
        }
    }
}