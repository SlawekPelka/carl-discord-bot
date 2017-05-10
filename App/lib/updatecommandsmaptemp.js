const fs = require('fs');
const grab = require('../data_storage/grab');

module.exports = {
    exec(params, message, options) {
        if (!grab.serverOptions(message.guild.id, 'admin').includes(message.author.id)) return message.channel.send(`You're not authorized to use this command!`);
        
        fs.readFile(`${__dirname}/../data_storage/commandsMap.json`, 'utf8', (err, content) => {
            if (err) console.error(err.stack);

            let parsedMap = JSON.parse(content);

            fs.readdir(`${__dirname}/../lib/`, (err, files) => {
                if (err) console.error(err.stack);

                files.forEach(file => {
                    let command = require(`${__dirname}/../lib/${file}`);
                    parsedMap[command.metaData().execWith] = file.replace('.js', '');
                });

                fs.writeFile(`${__dirname}/../data_storage/commandsMap.json`, JSON.stringify(parsedMap, null, '\t'), err => {
                    if (err) console.error(err.stack);
                });
            });
        });
    },
    metaData() {
        return {
            name: 'upcommands',
            avaliableOptions: '-',
            description: '-',
            usage: '<prefix> ',
            example: `!c upcommands`,
            group: 'self',
            execWith: 'upcommands'
        }
    }
}