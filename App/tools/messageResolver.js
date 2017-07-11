const grab = require('../data_storage/grab'),
    userCheck = require('../tools/usercheck'),
    fs = require('fs');

module.exports = message => {
    return new Promise((resolve, reject) => {
        try {

            if (userCheck.isBlacklisted('all', message.author.id)) return message.channel.send("You are blacklisted.");

            let cmdStatus = grab.appData(message.guild.id, 'commandStatus');

            let content = message.content;
            content = content.replace(grab.serverOptions(message.guild.id, 'options').prefix, '');

            let commandName = '',
                requested = '';

            fs.readdir(`${__dirname}/../lib/`, (err, files) => {
                if (err) console.error(err);

                requested = content.split(' ')[1];
                if (requested == undefined) return;
                commandName = (grab.commandsMap(requested) !== undefined) ? grab.commandsMap(requested) : '';

                if (commandName == '') return message.channel.send(`Command **${requested}** was not found!\nAre you sure you spelled it correctly?`);

                let params = content.replace(`${grab.serverOptions(message.guild.id, 'options').prefix} `, '');
                params = params.replace(requested, '');
                params = params.split('--')[0];

                let options = content.split('--')[1];

                let response = {
                    params: params ? params.trim() : '',
                    options: options ? options.split(',') : '',
                    commandName: commandName || ''
                }

                if (cmdStatus.disabled.includes(commandName)) {
                    return message.channel.send(`Command **${commandName}** is disabled on this server!`);
                } else {
                    resolve(response);
                }
            });
        } catch (e) {
            reject(e.stack);
        }
    });
}