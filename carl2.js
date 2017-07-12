const Discord = require('discord.js'),
    SpotifyWebApi = require('spotify-web-api-node'),
    Client = new Discord.Client(),
    grab = require('./App/data_storage/grab'),
    msgResolver = require('./App/tools/messageResolver'),
    setDefaults = require('./App/tools/setServerDefaults'),
    fs = require('fs');

Client.on('ready', () => {
    console.log(`${Client.user.username} is ready!`);
    Client.user.setGame('!c help | !c invite');

    const spotifyApi = new SpotifyWebApi({
        clientId: grab.securityTokens('spotify_clientId'),
        clientSecret: grab.securityTokens('spotify_secret')
    });

    spotifyApi.clientCredentialsGrant()
        .then(data => {
            spotifyApi.setAccessToken(data.body['access_token']);
        }, e => {
            console.log('Something went wrong while requesting spotify access! ', err);
        });

    Client.spotify = spotifyApi;

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