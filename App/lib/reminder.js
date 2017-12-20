const humanizeDuration = require('humanize-duration')

module.exports = {
    exec(params, message, options, client) {
        var time = parseInt(options[0]) ? parseInt(options[0]) : 1000;
        setTimeout(() => {
            message.author.send(params).then(m => {});
        }, time);
        message.channel.send(`Will remind you of **${params}** in *${humanizeDuration(time)}*`);
    },
    metaData() {
        return {
            name: 'Reminder',
            avaliableOptions: '-',
            description: 'Set a reminder for certain time',
            usage: '<prefix> remind <thing> <timestamp>',
            example: `!c remind something 1000`,
            group: 'utility',
            execWith: 'remind'
        }
    }
}