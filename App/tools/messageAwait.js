module.exports = (message, listLimit) => {
    return new Promise((resolve, reject) => {
        try {
            listLimit = listLimit++;

            message.channel.awaitMessages(res => res.author.id === message.author.id, {
                max: 1,
                time: 90000,
                errors: ['time']
            }).then(coll => {
                if (! coll.first().content > 0 && coll.first().content < listLimit ) resolve(0);
                let chosen = coll.first().content - 1;
                coll.first().delete();
                resolve(chosen);
            }).catch(e => {
                message.channel.send('Command cancled!');
                console.error(e.stack);
            });
        } catch (e) {
            reject(e.stack);
        }
    });
}