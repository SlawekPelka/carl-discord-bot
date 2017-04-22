const fs = require('fs');

module.exports = message => {
    let guild = message.guild;
    let dataStoragePath = `${__dirname}/../data_storage/`;

    // Set default options
    fs.readFile(`${dataStoragePath}/server/options.json`, 'utf8', (err, content) => {
        if (err) console.error(err.stack);
        let parsedOptions = JSON.parse(content);

        if (!parsedOptions.hasOwnProperty(guild.id)) {
            let defaultOptions = {
                prefix: '!c'
            }
            parsedOptions[guild.id] = defaultOptions;
            fs.writeFile(`${dataStoragePath}/server/options.json`, JSON.stringify(parsedOptions, null, '\t'), err => {
                if (err) console.error(err.stack);
            });
        }
    });

    // Set owner as admin
    fs.readFile(`${dataStoragePath}/server/admins.json`, 'utf8', (err, content) => {
        if (err) console.error(err.stack);
        let parsedAdmins = JSON.parse(content);

        if (!parsedAdmins.hasOwnProperty(guild.id)) {
            parsedAdmins[guild.id] = [guild.ownerID];
            fs.writeFile(`${dataStoragePath}/server/admins.json`, JSON.stringify(parsedAdmins, null, '\t'), err => {
                if (err) console.error(err.stack);
            });
        }
    });

    // Enable all commands for server by default
    fs.readFile(`${dataStoragePath}/data/commandStatus.json`, 'utf8', (err, content) => {
        if (err) console.error(err.stack);
        let parsedCommandStatusList = JSON.parse(content);

        let defaultCommandStatusObject = {
            disabled: []
        }

        parsedCommandStatusList[guild.id] = defaultCommandStatusObject;

        fs.writeFile(`${dataStoragePath}/data/commandStatus.json`, JSON.stringify(parsedCommandStatusList, null, '\t'), err => {
            if (err) console.error(err.stack);
        });
    });

    // Public function to write new commands to the commands map
    let writeToCommandMap = (execWith, fileName) => {
        fs.readFile(`${dataStoragePath}/commandsMap.json`, 'utf8', (err, content) => {
            if (err) console.error(err.stack);
            let parsedMap = JSON.parse(content);
            
            parsedMap[execWith] = fileName;

            fs.writeFile(`${dataStoragePath}/commandsMap.json`, JSON.stringify(parsedMap, null, '\t'), err => {
                if (err) console.error(err);
            });
        });
    }
}