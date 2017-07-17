const fs = require('fs');
const grab = require('../data_storage/grab');
const dataLog = require('../tools/dataLogger');

module.exports = {
    exec(params, message) {
        let cmdName = params;
        let category = {
            self: [],
            fun: [],
            utility: [],
            admin: []
        };
        let cmdCount = 0;

        if (cmdName == '') {
            // If global help is asked
            fs.readdir(`${__dirname}/../lib/`, (err, files) => {
                if (err) console.error(err.stack);

                files.forEach(file => {
                    let cmd = require(`${__dirname}/../lib/${file}`);
                    let meta = cmd.metaData();
                    if (grab.appData(message.guild.id, 'commandStatus').disabled.includes(meta.execWith)) return;
                    cmdCount++;
                    category[meta.group].push(`**${meta.execWith}** => *${meta.description}*`);
                });

                const embed = {
                    color: 4484275,
                    author: {
                        name: `Avaliable commands for ${message.guild.name}`
                    },
                    description: `type <prefix> help <commandName> for command specific help`,
                    fields: [{
                            name: "Avaliable commands count",
                            value: `**${cmdCount}**`
                        },
                        {
                            name: 'Bot specific commands',
                            value: category['self'].join('\n')
                        },
                        {
                            name: 'Admin commands',
                            value: category['admin'].join('\n')
                        },
                        {
                            name: 'Utility commands',
                            value: category['utility'].join('\n')
                        },
                        {
                            name: 'Fun commands',
                            value: category['fun'].join('\n')
                        }
                    ]
                }
                message.channel.sendEmbed(embed)
                    .then(m => {
                        dataLog.resolveOveralUsage(
                            m.guild.id,
                            message.author.id,
                            m.id,
                            module.exports.metaData().name
                        );
                    })
                    .catch(console.error);
            });
        } else {
            // If cmd specific help is asked
            if (grab.commandsMap(cmdName) == undefined) message.channel.send(`Can't find **${cmdName}**!\nAre you sure you spelled it correctly?`);
            cmdName = grab.commandsMap(cmdName);
            let cmd = require(`${__dirname}/../lib/${cmdName}`);
            let meta = cmd.metaData();
            let imageUrl = meta.image ? meta.image : '';

            const embed = {
                color: 16239128,
                author: {
                    name: `Help for ${cmdName}`
                },
                image: imageUrl,
                fields: [{
                        name: "Name",
                        value: `**${meta.name}**`,
                        inline: true
                    },
                    {
                        name: 'Avaliable options',
                        value: `**${meta.avaliableOptions}**`,
                        inline: true
                    },
                    {
                        name: 'Execute with',
                        value: `**${meta.execWith}**`,
                        inline: true
                    },
                    {
                        name: 'Description',
                        value: `\`${meta.description}\``,
                        inline: false
                    },
                    {
                        name: 'Usage',
                        value: `\`${meta.usage}\``,
                        inline: false
                    },
                    {
                        name: 'Example',
                        value: `\`${meta.example}\``,
                        inline: false
                    },
                    {
                        name: 'Group',
                        value: `**${meta.group}**`,
                        inline: false
                    }
                ]
            }

            message.channel.sendEmbed(embed)
                .then(m => {
                    dataLog.resolveOveralUsage(
                        m.guild.id,
                        message.author.id,
                        m.id,
                        module.exports.metaData().name
                    );
                })
                .catch(console.error);
        }

    },
    metaData() {
        return {
            name: 'help',
            avaliableOptions: '-',
            description: 'Show global or specific help for the commands',
            usage: '<prefix> help (<commandName>)',
            example: `!c help ping`,
            group: 'self',
            execWith: 'help'
        }
    }
}