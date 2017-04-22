const grab = require('../data_storage/grab'),
    fs = require('fs');

module.exports = message => {
    return new Promise((resolve, reject) => {
        try {
            let cmdStatus = grab.appData(message.guild.id, 'commandStatus');

            let content = message.content;
                content = content.replace(grab.serverOptions(message.guild.id, 'options').prefix, '');

            let commandName = '',
                requested = '';

            fs.readdir(`${__dirname}/../lib/`, (err, files) => {
                if (err) console.error(err);

                requested = content.split(' ')[1];
                commandName = (grab.commandsMap(requested) !== undefined) ? grab.commandsMap(requested) : '';
 
                if (commandName == '') return message.channel.sendMessage(`Command **${requested}** was not found!\nAre you sure you spelled it correctly?`);

                let params = content.replace(`${grab.serverOptions(message.guild.id, 'options').prefix} `, '');
                params = params.replace(commandName, '');
                params = params.split('--')[0];

                let options = content.split('--')[1];

                let response = {
                    params: params ? params.trim() : '',
                    options: options ? options.split(',') : '',
                    commandName: commandName || ''
                }

                if (cmdStatus.disabled.includes(commandName)) {
                    return message.channel.sendMessage(`Command **${commandName}** is disabled on this server!`);
                } else {
                    resolve(response);
                }
            });
        } catch (e) {
            reject(e.stack);
        }
    });
}