const grab = require('../data_storage/grab');

usercheck = {};

usercheck = {
    isAdmin(serverID, userID) {
        let admins = grab.serverOptions(serverID, 'admin');
        if (!admins.includes(userID)) return false;
        return true;
    },
    isBlacklisted(serverID, userID) {
        let blacklist = grab.serverOptions(serverID, 'blacklist');
        if (blacklist.includes(userID)) return true;
        return false;
    }
}

module.exports = usercheck;