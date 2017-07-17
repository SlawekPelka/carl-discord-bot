const dataLog = require('../tools/dataLogger');

module.exports = {
    exec(params, message) {
        let limit = 1000;
        let msgSplit = params.split("");

        if (msgSplit.length > limit) return message.channel.sendMessage(`Your suggestion message exceedes the limit of ${limit} characters.\nPlease shorten it down and try again.`);

        dataLog.suggestion(message.author.id, params).then(res => {
            message.reply(`Thank you for your suggestion! It will be looked into shortly!\n*Please note that suggestion abuse will not be tolerated and may result in perma blacklist*\n**Your suggestion:**\`\`\`${params}\`\`\``)
                .then(m => {
                    dataLog.resolveOveralUsage(
                        m.guild.id,
                        message.author.id,
                        m.id,
                        module.exports.metaData().name
                    );
                })
        }).catch(e => {
            message.reply("There was a problem with your suggestion, please try again.");
            console.error(e);
        });
    },
    metaData() {
        return {
            name: 'suggestion',
            avaliableOptions: '-',
            description: 'File a bot suggestion',
            usage: '<prefix> suggestion <message>',
            example: `!c suggestion add more admin tools`,
            group: 'self',
            execWith: 'suggest'
        }
    }
}