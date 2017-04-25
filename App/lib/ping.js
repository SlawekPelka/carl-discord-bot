module.exports = {
    exec(params, message) {
        let startTime = new Date();
        message.channel.sendMessage('Pong!').then(msg => {
            msg.edit(`Pong!\nEstaminated message delay is: *${new Date().getTime() - startTime.getTime()} potatos*`);
        });
    },
    metaData() {
        return {
            name: 'Ping',
            avaliableOptions: '-',
            description: `Used to show *aproximate* message resolve time`,
            usage: '<prefix> ping',
            example: `!c ping`,
            group: 'self',
            execWith: 'ping'
        }
    }
}