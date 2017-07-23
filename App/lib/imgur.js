const imgurSearch = require('imgur-search'),
    grab = require('../data_storage/grab'),
    imgur = new imgurSearch(grab.securityTokens('imgur')),
    dataLog = require('../tools/dataLogger');

module.exports = {
    exec(params, message, options, client, Discord) {
        try {

            imgur.search(params).then(data => {
                let images = data.filter(image => {
                    return image.type != 'image/gif';
                });

                let option = options != '' ? options[0] : '';
                if (!option.match(/[0-9]+/)) option = Math.floor(Math.random() * images.length);

                message.channel.send(images[option].link)
                    .then(m => {
                        dataLog.resolveOveralUsage(
                            m.guild.id,
                            message.author.id,
                            m.id,
                            module.exports.metaData().name
                        );
                    })
            });

        } catch (e) {
            console.error(e.stack);
        }
    },
    metaData() {
        return {
            name: 'imgur',
            avaliableOptions: '<pageNr>',
            description: 'Get image from imgur',
            usage: '<prefix> imgur <query> (--<pageNr>)',
            example: `!c imgur rick roll --2`,
            group: 'fun',
            execWith: 'imgur'
        }
    }
}