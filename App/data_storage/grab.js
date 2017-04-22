// Commands map
const cmd_map = require('./commandsMap');
// Security
const sec_tokens = require('./security/tokens');
// Server specific settings
const serv_admins = require('./server/admins'),
    serv_blacklist = require('./server/blacklist'),
    serv_options = require('./server/options');
// Command data
const dat_emotes = require('./data/emotes'),
    dat_savedUsernames = require('./data/saved_usernames'),
    dat_cmdStatus = require('./data/commandStatus');

let grab = {};

grab = {
    securityTokens(key) {
        try {
            return sec_tokens[key];
        } catch (e) {
            console.error(e.stack);
        }
    },
    commandsMap(exec) {
        try {
            return cmd_map[exec];
        } catch (e) {
            console.error(e.stack);
        }
    },
    serverOptions(serverID, optionList) {
        try {
            let serverOptions = {
                admin: serv_admins,
                blacklist: serv_blacklist,
                options: serv_options
            }

            return serverOptions[optionList][serverID];
        } catch (e) {
            console.error(e.stack);
        }
    },
    appData(serverID, command) {
        try {
            let data = {
                emotes: dat_emotes,
                usernames: dat_savedUsernames,
                commandStatus: dat_cmdStatus
            }

            return data[command][serverID];
        } catch (e) {
            console.error(e.stack);
        }
    }
}

module.exports = grab;