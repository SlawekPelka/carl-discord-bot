const grab = require('../data_storage/grab');

module.exports = {
    exec(params, message, options, Client) {
        if (!grab.serverOptions(message.guild.id, 'admin').includes(message.author.id)) return message.channel.send(`You're not authorized to use this command!`);

        let reg = new RegExp('[0-9]', 'g');
        let limit = (params.match(reg)) ? Number(params) : 20;
        let fetchAmmount = Math.max(limit * 3);
        if (limit > 50) return message.channel.send("You can only remove maximum of 200 messages at once!");
        let requestedBy = message.author.id;

        let afterPurgeNotify = [
            "Taking care of",
            "Exterminating",
            "Purging",
            "Burning",
            "Deleting",
            "Removing"
        ];

        try {
            message.channel.fetchMessages({limit}).then(mess => {
                mess.forEach(m => {
                    if (m.author.id == Client.user.id) m.delete();
                    if (m.author.id == requestedBy && message.content.split(" ")[0] === grab.serverOptions(message.guild.id, 'options').prefix ) m.delete();
                });
                message.reply(`${afterPurgeNotify[Math.floor(Math.random() * afterPurgeNotify.length)]} **${limit}** commands\nThis can take a while...`).then(m => m.delete(2000));
            });
        } catch (e) {
            message.channel.send("Problem occured while purging! Check the logs!");
            console.log(e.stack);
        }
    },
    metaData() {
        return {
            name: 'purge',
            avaliableOptions: '',
            description: 'Clear x last bot outputs',
            usage: '<prefix> clear',
            example: `!c clear`,
            group: 'admin',
            execWith: 'clear'
        }
    }
}