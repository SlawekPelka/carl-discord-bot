const fs = require('fs');
const grab = require('../data_storage/grab');

module.exports = {
    exec(params, message, options) {
        let option = options != '' ? options[0] : '';
        let usernamesPath = `${__dirname}/../data_storage/data/saved_usernames.json`;

        switch(option) {
            case 'list':
                listUsernames();
                break;
            case 'add':
                addUsername();
                break;
            case 'remove':
                removeUsername();
                break;
            default:
                listUsernames();
                break;
        }

        function listUsernames() {
            if (grab.appData(message.author.id, 'usernames') == undefined) return message.reply('You don\'t have any saved usernames as of yet!');
            let usernames = grab.appData(message.author.id, 'usernames');
            let list = '';

            for (let username in usernames) {
                list += `${username}: ${usernames[username]}`;
            }

            if (list == '') return message.reply('You don\'t have any saved usernames as of yet!');

            message.reply('Here are your saved usernames').then(m => {
                m.channel.send(`\`\`\`${list}\`\`\``);
            });
        }

        function addUsername() {
            fs.readFile(usernamesPath, 'utf8', (err, content) => {
                if (err) console.error(err.stack);

                let game = params.split(' ')[0];
                let username = params.split(' ').slice(1).join(' ');
                let parsedUsernames = JSON.parse(content);

                if (!parsedUsernames.hasOwnProperty(message.author.id)) parsedUsernames[message.author.id] = {};

                parsedUsernames[message.author.id][game] = username;

                fs.writeFile(usernamesPath, JSON.stringify(parsedUsernames, null, '\t'), err => {
                    if (err) console.error(err.stack);
                    message.reply(`Saved username **${username}** for game **${game}**!`).then(m => process.exit(1));
                });
            });
        }

        function removeUsername() {
            fs.readFile(usernamesPath, 'utf8', (err, content) => {
                if (err) console.error(err.stack);
                
                let game = params.split(' ')[0];
                let parsedUsernames = JSON.parse(content);

                if (!parsedUsernames.hasOwnProperty(message.author.id)) return message.reply('You don\'t have any usernames saved yet!');
                if (!parsedUsernames[message.author.id].hasOwnProperty(game)) return message.reply(`There is no username set for ${game}!`);

                delete parsedUsernames[message.author.id][game];

                fs.writeFile(usernamesPath, JSON.stringify(parsedUsernames, null, '\t'), err => {
                    if (err) console.error(err.stack);
                    message.reply(`Removed username for game **${game}**!`).then(m => process.exit(1));
                });
            });
        }
    },
    metaData() {
        return {
            name: 'gameusernames',
            avaliableOptions: 'list, add, remove',
            description: 'Save your game usernames',
            usage: '<prefix> (<gameName>) (<username>) (--<option>)',
            example: `!c gu --list, !c gu osu myosuusername --add, !c gu osu --remove`,
            group: 'utility',
            execWith: 'gu'
        }
    }
}