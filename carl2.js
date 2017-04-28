const Discord = require('discord.js'),
    Client = new Discord.Client(),
    grab = require('./App/data_storage/grab'),
    msgResolver = require('./App/tools/messageResolver'),
    setDefaults = require('./App/tools/setServerDefaults'),
    fs = require('fs');

Client.on('ready', () => {
    console.log(`${Client.user.username} is ready!`);
});

Client.on('message', msg => {
    let id = msg.guild.id;
    if ( grab.serverOptions(id, 'options') == undefined ) {
        setDefaults(msg);
        // process.exit(1);
    } else if ( msg.content.startsWith( grab.serverOptions(id, 'options').prefix ) ) {
        msgResolver(msg).then(res => {
            msg.delete();
            try {
                let cmd = require(`./App/lib/${res.commandName}`);
                setTimeout(() => {
                    cmd.exec(res.params, msg, res.options, Client);
                }, 1000);
            } catch (e) {
                console.error(e.stack);
            }
        });
    }
});

Client.on('error', console.error);
Client.on('warn', console.warn);

process.on('unhandledRejection', (err) => {
  console.error(`Uncaught Promise Error: \n${err.stack}`)
});

Client.login(grab.securityTokens('bot_token'));