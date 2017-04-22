const Discord = require('discord.js'),
    Client = new Discord.Client(),
    grab = require('./App/data_storage/grab'),
    msgResolver = require('./App/tools/messageResolver'),
    setDefaults = require('./App/tools/setServerDefaults'),
    fs = require('fs');

Client.on('ready', () => {
    console.log(`C.A.R.L is ready!`);
});

Client.on('message', msg => {
    let id = msg.guild.id;
    if ( grab.serverOptions(id, 'options') == undefined ) {
        Client.writeCommandsMap();
        setDefaults(msg);
        // process.exit(1);
    } else if ( msg.content.startsWith( grab.serverOptions(id, 'options').prefix ) ) {
        msg.delete();
        msgResolver(msg).then(res => {
            try {
                let cmd = require(`./App/lib/${res.commandName}`);
                setTimeout(() => {
                    cmd.exec(res.params, msg, res.options);
                }, 1000);
            } catch (e) {
                console.error(e.stack);
            }
        });
    }
});

Client.writeCommandsMap = () => {
    fs.readFile(`${__dirname}/App/data_storage/commandsMap.json`, 'utf8', (err, content) => {
        if (err) console.error(err.stack);

        let parsedMap = JSON.parse(content);

        fs.readdir(`${__dirname}/App/lib/`, (err, files) => {
            if (err) console.error(err.stack);

            files.forEach(file => {
                let command = require(`${__dirname}/App/lib/${file}`);
                parsedMap[command.metaData().execWith] = file.replace('.js', '');
            });

            fs.writeFile(`${__dirname}/App/data_storage/commandsMap.json`, JSON.stringify(parsedMap, null, '\t'), err => {
                if (err) console.error(err.stack);
            });
        });
    });
}

Client.on('error', console.error);
Client.on('warn', console.warn);

process.on('unhandledRejection', (err) => {
  console.error(`Uncaught Promise Error: \n${err.stack}`)
});

Client.login(grab.securityTokens('bot_token'));