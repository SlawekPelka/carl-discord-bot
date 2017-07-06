const grab = require('../data_storage/grab');
const package = require(`${__dirname}/../../package`);
const fs = require('fs');

module.exports = (message, client) => {
    let guildID = message.guild.id;
    let libPath = `${__dirname}/../lib`;

    function getServerPrefix() {
        return grab.serverOptions(guildID, 'options').prefix;
    }
    function getAvaliableCommandCount() {
        try {
            let count = 0;
            let fileNames = fs.readdirSync(libPath);
            fileNames.forEach(file => {
                let cmd = require(`${libPath}/${file}`);
                if (!grab.appData(guildID, 'commandStatus').disabled.includes(cmd.metaData().execWith)) count++; 
            });

            return count;
        } catch (e) {
            console.error(e.stack);
        }
    }
    function getAvaliableCommandNames() {
        try {
            let names = [];
            let fileNames = fs.readdirSync(libPath);
            fileNames.forEach(file => {
                let cmd = require(`${libPath}/${file}`);
                if (!grab.appData(guildID, 'commandStatus').disabled.includes(cmd.metaData().execWith)) names.push(cmd.metaData().execWith);
            });

             return names.join(', ');
        } catch (e) {
            console.error(e.stack);
        }
    }
    function getServerAdmins() {
        let adminIds = grab.serverOptions(guildID, 'admin');
        let adminNames = [];

        adminIds.forEach(adminid => {
            admin = client.users.get(adminid);
            adminNames.push(`@${admin.username}#${admin.discriminator}`);
        });

        return adminNames.join(', ');
    }
    function getSavedEmotesCount() {
        let emotes = grab.appData(guildID, 'emotes');
        if (emotes == undefined || emotes == null) return '0'
        return Object.keys(emotes).length > 0 ? Object.keys(emotes).length : 0;
    }
    function getSavedEmotesNames() {
        let emotes = grab.appData(guildID, 'emotes');
        let names = [];

        for (let emote in emotes) {
            names.push(emote);
        }

        if (names.length == 0) return 'none';

        return names.join(', ');
    }
    function getGit() {
        return package.homepage;
    }
    function getnpmcCount() {
        return Object.keys(package.devDependencies).length;
    }
    function getnpmNames() {
        let names = [];
        for (let dep in package.devDependencies) {
            names.push(dep);
        }

        return names.join(', ');
    }

    return {
        getServerPrefix: getServerPrefix(),
        getAvaliableCommandCount: getAvaliableCommandCount(),
        getAvaliableCommandNames: getAvaliableCommandNames(),
        getServerAdmins: getServerAdmins(),
        getSavedEmotesCount: getSavedEmotesCount(),
        getSavedEmotesNames: getSavedEmotesNames(),
        getGit: getGit(),
        getnpmcCount: getnpmcCount(),
        getnpmNames: getnpmNames()
    }
}