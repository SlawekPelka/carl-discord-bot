module.exports = {
    exec(params, message, options, client) {
        message.channel.sendMessage(`Thank you for using C.A.R.L! Here is your invite link:\nhttps://discordapp.com/api/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=0`)
    },
    metaData() {
        return {
            name: 'invite',
            avaliableOptions: '-',
            description: 'Get invite link for C.A.R.L',
            usage: '<prefix> invite',
            example: `!c invite`,
            group: 'self',
            execWith: 'invite'
        }
    }
}