const fs = require('fs');
const grab = require('../data_storage/grab');

module.exports = {
    exec(params, message, options) {
        if (params == '' && options == '') return;
        let option = options != '' ? options[0] : '';
        let emotesPath = `${__dirname}/../data_storage/data/emotes.json`;

        let name = params.split(' ')[0];
        let url = params.split(' ')[1];

        let listEmotes = () => {
            let emotes = grab.appData(message.guild.id, 'emotes');
            if (!Object.keys(emotes).length > 0) return message.channel.sendMessage(`**${message.guild.name}** has no saved emotes yet!`);

            let emoteList = [];

            for (let key in emotes) emoteList.push(key); 

            const embed = {
                color: 13849600,
                author: {
                    name: `Saved emotes for ${message.guild.name}`
                },
                fields: [
                    {
                        name: 'Emotes count',
                        value: emoteList.length
                    },
                    {
                        name: 'Saved emotes',
                        value: `\`${emoteList.join(', ')}\``
                    }
                ]
            }

            message.channel.sendEmbed(embed)
                .catch(console.error);
        }

        let addEmote = () => {
            fs.readFile(emotesPath, 'utf8', (err, content) => {
                if (err) console.error(err.stack);
                let parsedEmotes = JSON.parse(content);

                if (!parsedEmotes.hasOwnProperty(message.guild.id)) parsedEmotes[message.guild.id] = {}
                parsedEmotes[message.guild.id][name] = url;

                fs.writeFile(emotesPath, JSON.stringify(parsedEmotes, null, '\t'), err => {
                    if (err) console.error(err.stack);
                    message.delete();
                    message.channel.sendMessage(`Emote **${name}** saved!`);
                });
            });
        }

        let removeEmote = () => {
            fs.readFile(emotesPath, 'utf8', (err, content) => {
                if (err) console.error(err.stack);
                let parsedEmotes = JSON.parse(content);

                delete parsedEmotes[message.guild.id][name];

                fs.writeFile(emotesPath, JSON.stringify(parsedEmotes, null, '\t'), err => {
                    if (err) console.error(err.stack);
                    message.channel.sendMessage(`Emote **${name}** deleted!`);
                });
            });
        }

        let showEmote = () => {
            let emotes = grab.appData(message.guild.id, 'emotes');
            if (!emotes.hasOwnProperty(name)) return message.channel.sendMessage(`No emote named **${name}** has been saved for **${message.guild.name}**`);
            message.channel.sendMessage(emotes[name]);
        }

        switch(option) {
            case 'list':
                listEmotes();
                break;
            case 'add':
                addEmote();
                break;
            case 'remove':
                removeEmote();
                break;
            default:
                showEmote();
                break;
        }
    },
    metaData() {
        return {
            name: 'Emotes',
            avaliableOptions: 'add, remove, list',
            description: 'Show, add or remove custom server emotes',
            usage: '<prefix> em <emoteName> (<option>)',
            example: `!c em sickmeme, !c em sickmeme wwww.link.com/meme.png --add, !c em sickmeme --remove, !c em --list`,
            group: 'fun',
            execWith: 'em'
        }
    }
}