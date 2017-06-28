const fs = require('fs');
const path = require('path');
const grab = require('../data_storage/grab');

module.exports = {
    exec(params, message, options) {
        if (params == '' && options == '') return;
        let option = options != '' ? options[0] : '';
        let emotesPath = `${__dirname}/../data_storage/data/emotes.json`;
        let allowedTypes = ['.png', '.jpg', '.jpeg', '.gif'];

        let name = params.split(' ')[0];
        let url = params.split(' ')[1];

        let listEmotes = () => {
            let emotes = grab.appData(message.guild.id, 'emotes');
            if (emotes == undefined || !Object.keys(emotes).length > 0) return message.channel.send(`**${message.guild.name}** has no saved emotes yet!`);

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
            let extensionName = path.extname(url);
            
            if (url.match(/\.(jpeg|jpg|gif|png)$/) == null) return message.channel.send('The emote was not of valid type.\nAllowed types: png, jpg, jpeg and gif');

            fs.readFile(emotesPath, 'utf8', (err, content) => {
                if (err) console.error(err.stack);
                let parsedEmotes = JSON.parse(content);

                if (!parsedEmotes.hasOwnProperty(message.guild.id)) parsedEmotes[message.guild.id] = {}
                parsedEmotes[message.guild.id][name] = url;

                fs.writeFile(emotesPath, JSON.stringify(parsedEmotes, null, '\t'), err => {
                    if (err) console.error(err.stack);
                    message.delete();
                    message.channel.send(`Emote **${name}** saved!`).then(m => process.exit(1));
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
                    message.channel.send(`Emote **${name}** deleted!`).then(m => process.exit(1));
                });
            });
        }

        let showEmote = () => {
            let emotes = grab.appData(message.guild.id, 'emotes');
            if (!emotes.hasOwnProperty(name)) return message.channel.send(`No emote named **${name}** has been saved for **${message.guild.name}**`);
            message.channel.send(emotes[name]);
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