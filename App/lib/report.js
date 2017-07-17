const dataLog = require('../tools/dataLogger');

module.exports = {
    exec(params, message) {
        let limit = 1000;
        let msgSplit = params.split("");

        if (msgSplit.length > limit) return message.channel.sendMessage(`Your report message exceedes the limit of ${limit} characters.\nPlease shorten it down and try again.`);

        dataLog.report(message.author.id, params).then(res => {
            message.reply(`Thank you for your report! It will be looked into shortly!\n*Please note that report abuse will not be tolerated and may result in perma blacklist*\n**Your report:**\`\`\`${params}\`\`\``)
                .then(m => {
                    dataLog.resolveOveralUsage(
                        m.guild.id,
                        message.author.id,
                        m.id,
                        module.exports.metaData().name
                    );
                })
        }).catch(e => {
            message.reply("There was a problem with your report, please try again.");
            console.error(e);
        });
    },
    metaData() {
        return {
            name: 'report',
            avaliableOptions: '-',
            description: 'File a bug report',
            usage: '<prefix> report <message>',
            example: `!c report bot is on fire`,
            group: 'self',
            execWith: 'report'
        }
    }
}