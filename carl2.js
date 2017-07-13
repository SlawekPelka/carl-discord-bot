const Discord = require('discord.js'),
    Client = new Discord.Client(),
    grab = require('./App/data_storage/grab'),
    msgResolver = require('./App/tools/messageResolver'),
    setDefaults = require('./App/tools/setServerDefaults'),
    spotifyAPIAccess = require('./App/tools/spotifyAPIaccess'),
    fs = require('fs');

Client.on('ready', () => {
    console.log(`${Client.user.username} is ready!`);
    Client.user.setGame('!c help | !c invite');

    let refreshTokenTime = 1000 * 60 * 60;
    Client.spotify = spotifyAPIAccess();

    setInterval(() => {
        Client.spotify = spotifyAPIAccess();
        console.log("spotify auth token refreshed");
    }, refreshTokenTime);

});

Client.on('message', msg => {
    if (msg.guild == null) return;

    let id = msg.guild.id;
    if (grab.serverOptions(id, 'options') == undefined) {
        setDefaults(msg);
    } else if (msg.content.split(" ")[0] === grab.serverOptions(id, 'options').prefix) {
        msgResolver(msg).then(res => {
            //msg.delete();
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