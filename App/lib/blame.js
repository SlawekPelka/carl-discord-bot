const grab = require('../data_storage/grab');
const dataLog = require('../tools/dataLogger');
const moment = require('moment');

module.exports = {
    exec(params, message, options, client) {
        if (!params.match(/[0-9]+/g)) return message.channel.send("Issued params are not an ID!");
        try {
            let blameList = grab.logs('blame', message.guild.id, '', params);
            console.log(blameList);
            let user = client.users.get(Object.keys(blameList)[0]);

            message.channel.send(`***Blame ${params}!***\nCommand issued by: **${user.username}#${user.discriminator}**\nOn: **${moment(blameList[0]).format('LLLL')}**`)
                .then(m => {
                    dataLog.resolveOveralUsage(
                        m.guild.id,
                        message.author.id,
                        m.id,
                        module.exports.metaData().name
                    );
                });
        } catch (e) {
            console.error(e.stack);
            message.channel.send("There was a problem with requested blame!\n Issued blame ID most probably doesn't exist.");
        }
    },
    metaData() {
        return {
            name: 'blame',
            avaliableOptions: '-',
            description: 'See who issued C.A.R.L command',
            usage: '<prefix> blame <messageID>',
            example: `!c blame 336568150759964672`,
            group: 'utility',
            execWith: 'blame'
        }
    }
}