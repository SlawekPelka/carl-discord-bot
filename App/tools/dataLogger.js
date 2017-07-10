const fs = require('fs');

module.exports = {
    usage: (serverID, cmdName) => {
        try {
            fs.readFile(`${__dirname}/../data_storage/logs/commandUsage.json`, 'utf8', (err, contents) => {
                let usageData = JSON.parse(contents);

                if (!usageData[serverID]) usageData[serverID] = {};
                if (!usageData[serverID].hasOwnProperty(cmdName)) usageData[serverID][cmdName] = '1';

                if (usageData[serverID].hasOwnProperty(cmdName)) {
                    let currCount = Number(usageData[serverID][cmdName]);
                    usageData[serverID][cmdName] = JSON.stringify(currCount++);
                }

                fs.writeFileSync(`${__dirname}/../data_storage/logs/commandUsage.json`, JSON.stringify(usageData, '', '\t'));
            });
        } catch (e) {
            console.error(e.stack);
        }
    },
    report: (userID, message) => {
        return new Promise((resolve, reject) => {
            try {
                fs.readFile(`${__dirname}/../data_storage/logs/reports.json`, 'utf8', (err, contents) => {
                    let reports = JSON.parse(contents);

                    if (!reports.hasOwnProperty(userID)) reports[userID] = {};

                    reports[userID][Date.now()] = message;

                    fs.writeFile(`${__dirname}/../data_storage/logs/reports.json`, JSON.stringify(reports, '', '\t'), done => {
                        resolve(true);
                    });
                });
            } catch (e) {
                reject(e.stack);
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

                    fs.writeFile(`${__dirname}/../data_storage/logs/suggestions.json`, JSON.stringify(suggestions, '', '\t'), done => {
                        resolve(true);
                    });
                });
            } catch (e) {
                reject(e.stack);
            }
        });
    }
}