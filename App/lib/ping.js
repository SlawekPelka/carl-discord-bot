const dataLog = require('../tools/dataLogger');

module.exports = {
    exec(params, message) {
        let startTime = new Date();
        message.channel.send('Pong!').then(msg => {
            msg.edit(`Pong!\nEstaminated message delay is: *${new Date().getTime() - startTime.getTime()} potatos*`);
            dataLog.resolveOveralUsage(
                msg.guild.id,
                message.author.id,
                msg.id,
                module.exports.metaData().name
            );
        });
    },
    metaData() {
        return {
            name: 'Ping',
            avaliableOptions: '-',
            description: `Used to show aproximate message resolve time`,
            usage: '<prefix> ping',
            example: `!c ping`,
            group: 'self',
            execWith: 'ping'
        }
    }
}