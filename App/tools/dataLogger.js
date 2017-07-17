const fs = require('fs');

module.exports = {
    usage: (serverID, cmdName) => {
        return new Promise((resolve, reject) => {
            try {
                fs.readFile(`${__dirname}/../data_storage/logs/commandUsage.json`, 'utf8', (err, contents) => {
                    let currCount;
                    let usageData = JSON.parse(contents);

                    if (!usageData[serverID]) usageData[serverID] = {};
                    if (!usageData[serverID].hasOwnProperty(cmdName)) {
                        usageData[serverID][cmdName] = '1';
                    } else {
                        currCount = Number(usageData[serverID][cmdName]);
                        currCount += 1;
                        usageData[serverID][cmdName] = JSON.stringify(currCount);
                    }

                    fs.writeFile(`${__dirname}/../data_storage/logs/commandUsage.json`, JSON.stringify(usageData, '', '\t'), e => {
                        resolve(true);
                    });
                });
            } catch (e) {
                reject(e.stack);
                console.error("Failed to update usage count", e.stack);
            }
        });
    },
    blame: (serverID, userID, messageID) => {
        return new Promise((resolve, reject) => {
            try {
                fs.readFile(`${__dirname}/../data_storage/logs/blamelist.json`, 'utf8', (err, contents) => {
                    let blameList = JSON.parse(contents);
                    let limit = 5;

                    if (!blameList[serverID]) blameList[serverID] = {};
                    if (!blameList[serverID].hasOwnProperty(userID)) blameList[serverID][userID] = {};
                    if (Object.keys(blameList[serverID][userID]).length == limit) delete blameList[serverID][userID][Object.keys(blameList[serverID][userID])[0]];

                    blameList[serverID][userID][messageID] = Date.now();

                    fs.writeFile(`${__dirname}/../data_storage/logs/blamelist.json`, JSON.stringify(blameList, '', '\t'), e => {
                        resolve(true);
                    });
                });
            } catch (e) {
                reject(e.stack);
                console.error("Failed to resolve blame update", e.stack);
            }
        });
    },
    resolveOveralUsage: (serverID, userID, messageID, cmdName) => {
        module.exports.usage(serverID, cmdName).then(r => {
            module.exports.blame(serverID, userID, messageID).then(z => { return z; })
        });
    },
    report: (userID, message) => {
        return new Promise((resolve, reject) => {
            try {
                fs.readFile(`${__dirname}/../data_storage/logs/reports.json`, 'utf8', (err, contents) => {
                    let reports = JSON.parse(contents);

                    if (!reports.hasOwnProperty(userID)) reports[userID] = {};

                    reports[userID][Date.now()] = message;

                    fs.writeFile(`${__dirname}/../data_storage/logs/reports.json`, JSON.stringify(reports, '', '\t'), e => {
                        resolve(true);
                    });
                });
            } catch (e) {
                reject(e.stack);
                console.error("Failed to proceed report", e.stack);
            }
        });
    },
    suggestion: (userID, message) => {
        return new Promise((resolve, reject) => {
            try {
                fs.readFile(`${__dirname}/../data_storage/logs/suggestions.json`, 'utf8', (err, contents) => {
                    let suggestions = JSON.parse(contents);

                    if (!suggestions.hasOwnProperty(userID)) suggestions[userID] = {};

                    suggestions[userID][Date.now()] = message;

                    fs.writeFile(`${__dirname}/../data_storage/logs/suggestions.json`, JSON.stringify(suggestions, '', '\t'), e => {
                        resolve(true);
                    });
                });
            } catch (e) {
                reject(e.stack);
                console.error("Failed to proceed suggestion", e.stack);
            }
        });
    }
}