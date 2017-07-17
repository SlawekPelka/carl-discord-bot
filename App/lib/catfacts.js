const CatFacts = require('cat-facts');
const dataLog = require('../tools/dataLogger');

module.exports = {
    exec(params, message, options, client) {
        try {
            message.channel.send(`**Did you know**: ${CatFacts.random()}`).then(m => {
                dataLog.resolveOveralUsage(
                    m.guild.id,
                    message.author.id,
                    m.id,
                    module.exports.metaData().name
                );
            });
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