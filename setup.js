const prompt = require('prompt');
const mkdirp = require('mkdirp');
const fs = require('fs');
const getDirName = require('path').dirname;

let dataFolders = {
    "target": `${__dirname}/App/data_storage`,
    "ext": "json",
    "files": {
        "data": ['commandStatus', 'emotes', 'saved_usernames'],
        "security": ['tokens'],
        "server": ['admins', 'blacklist', 'options']
    }
}

let promptForTokens = () => {
    console.log(`You now will be prompted to input the tokens needed to run specific services.\nNo data is send anywhere, it\'s all only being written to ${__dirname}/App/data_storage/security/tokens.json`);

    let schema = {
        properties: {
            botToken: {
                description: "Discord API token",
                required: true
            },
            giphyToken: {
                description: "Giphy API token",
                required: true
            },
            googleToken: {
                description: "Google API token",
                required: true
            },
            spotifyID: {
                description: "Spotify client ID",
                required: true
            },
            spotifySecret: {
                description: "Spotify client secret",
                required: true
            },
            malUsername: {
                description: "MyAnimeList username",
                required: true
            },
            malPassword: {
                description: "MyAnimeList password",
                hidden: true,
                replace: '*',
                required: true
            },
            imgurClientId: {
                description: "Imgur client ID",
                required: true
            }
        }
    }

    prompt.start();


    prompt.get(schema, (err, result) => {
        if (err) return console.error(err);

        let securityObject = {
            "bot_token": result.botToken,
            "giphy_token": result.giphyToken,
            "google_token": result.googleToken,
            "spotify_clientId": result.spotifyID,
            "spotify_secret": result.spotifySecret,
            "mal_username": result.malUsername,
            "mal_password": result.malPassword,
            "imgur": result.imgurClientId
        }

        fs.writeFileSync(`${dataFolders.target}/security/tokens.json`, JSON.stringify(securityObject), err => {
            if (err) console.error(err);
            console.error('All credentials set!\nStart the bot using npm run prod');
        })
    });
}

let makeDataFolders = () => {

    this.makeMain = () => {
        mkdirp(getDirName(dataFolders.target), err => {
            if (err) return console.error(err);
            this.makeDataFolders();
        })
    }

    this.makeDataFolders = () => {
        let keys = Object.keys(dataFolders.files);
        for (let i = 0; i < keys.length; i++) {
            mkdirp(`${dataFolders.target}/${keys[i]}`, err => {
                if (err) console.error(err);
                this.loopTroughFileNames();
            });
        }
    }

    this.loopTroughFileNames = () => {
        for (let key in dataFolders.files) {
            dataFolders.files[key].forEach(fileName => {
                try {
                    this.writeFile(`${dataFolders.target}/${key}/${fileName}.${dataFolders.ext}`);
                } catch (e) {
                    console.error(e);
                }
            });
        }
    }

    this.writeFile = path => {
        fs.open(path, 'wx', err => {
            if (err) {
                if (err.code === 'EEXISTS') return console.error(`File ${path} already exists!`);
            }

            fs.writeFileSync(path, '{}', err => {
                if (err) return console.error(err);
                console.log(`Writing ${path}`);
            });
        });
    }

    this.makeMain();
    if (process.env.DOCKER == true) {
        let securityObject = {
            "bot_token": process.env.bot_token,
            "giphy_token": process.env.giphy_token,
            "google_token": process.env.google_token,
            "spotify_clientId": process.env.spotify_clientId,
            "spotify_secret": process.env.spotify_secret,
            "mal_username": process.env.mal_username,
            "mal_password": process.env.mal_password,
            "imgur": process.env.imgur
        }

        fs.writeFileSync(`${dataFolders.target}/security/tokens.json`, JSON.stringify(securityObject), err => {
            if (err) console.error(err);
            console.error('All credentials set!\nStart the bot using npm run prod');
        })
    } else {
        promptForTokens();
    }
}

makeDataFolders();