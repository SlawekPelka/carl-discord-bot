const botinfo = require('../tools/botinfo');
const dataLog = require('../tools/dataLogger');

module.exports = {
    exec(params, message, options, client) {
        let info = botinfo(message, client);

        const embed = {
            color: 6697881,
            author: {
                name: `${message.guild.name} specific info about this bot`
            },
            description: `For further assistance please refer to the readme on github`,
            fields: [{
                    name: `Bot prefix`,
                    value: `**${info.getServerPrefix}**`
                },
                {
                    name: `Avaliable commands count`,
                    value: `**${info.getAvaliableCommandCount}**`
                },
                {
                    name: `Avaliable command names`,
                    value: `\`${info.getAvaliableCommandNames}\``
                },
                {
                    name: `Users with bot admin permisions`,
                    value: `\`${info.getServerAdmins}\``
                },
                {
                    name: `Saved emotes count`,
                    value: `**${info.getSavedEmotesCount}**`
                },
                {
                    name: `Saved emotes names`,
                    value: `\`${info.getSavedEmotesNames}\``
                },
                {
                    name: `Bot github`,
                    value: `[Click here](${info.getGit})`
                },
                {
                    name: `Custom dependencies count`,
                    value: `**${info.getnpmcCount}**`
                },
                {
                    name: `Custom dependencies names`,
                    value: `\`${info.getnpmNames}\``
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
    },
    metaData() {
        return {
            name: 'about',
            avaliableOptions: '-',
            description: 'Show information about this bot',
            usage: '<prefix> about',
            example: `!c about`,
            group: 'self',
            execWith: 'about'
        }
    }
}