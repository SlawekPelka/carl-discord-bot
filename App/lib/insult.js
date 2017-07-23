const dataLog = require('../tools/dataLogger');

module.exports = {
    exec(params, message) {
        let insults = [
            "I don’t believe in plastic surgery, But in your case, Go ahead.",
            "People like you are the reason we have middle fingers.",
            "Why Don’t You Slip Into Something More Comfortable. Like A Coma?",
            "When your mom dropped you off at the school, she got a ticket for littering.",
            "Tell me… Is being stupid a profession or are you just gifted?",
            "Me pretending to listen should be enough for you.",
            "What’s the point of putting on makeup, a monkey is gonna stay a monkey.",
            "My mom says pigs don’t eat biscuits… So I better take that one out of your hand.",
            "No need for insults, your face says it all.",
            "You’re so ugly that when you cry, the tears roll down the back of your head…just to avoid your face.",
            "Wow! You have a huge pimple in between your shoulders! Oh wait that’s your face.",
            "It’s not that you are weird…it’s just that everyone else is normal.",
            "Zombies eat brains. You’re safe.",
            "Scientists are trying to figure out how long human can live without a brain. You can tell them your age.",
            "Roses are red, violets are blue, I have 5 fingers, the 3rd ones for you.",
            "Is your ass jealous of the amount of shit that just came out of your mouth?",
            "Your birth certificate is an apology letter from the condom factory.",
            "I’m jealous of all the people that haven't met you!",
            "I wasn't born with enough middle fingers to let you know how I feel about you.",
            "You must have been born on a highway because that's where most accidents happen.",
            "If you are going to be two faced, at least make one of them pretty.",
            "Yo're so ugly, when your mom dropped you off at school she got a fine for littering.",
            "I bet your brain feels as good as new, seeing that you never use it.",
            "You bring everyone a lot of joy, when you leave the room.",
            "Two wrongs don't make a right, take your parents as an example.",
            "I'd like to see things from your point of view but I can't seem to get my head that far up my ass.",
            "I could eat a bowl of alphabet soup and shit out a smarter statement than that.",
            "If I wanted to kill myself I'd climb your ego and jump to your IQ.",
            "If laughter is the best medicine, your face must be curing the world.",
            "If you're gonna be a smartass, first you have to be smart. Otherwise you're just an ass.",
            "You're so ugly, when you popped out the doctor said Aww what a treasure and your mom said Yeah, lets bury it.",
            "I don't exactly hate you, but if you were on fire and I had water, I'd drink it.",
            "It's better to let someone think you are an Idiot than to open your mouth and prove it.",
            "Shut up, you'll never be the man your mother is.",
            "You shouldn't play hide and seek, no one would look for you.",
            "The last time I saw a face like yours I fed it a banana.",
            "Maybe if you ate some of that makeup you could be pretty on the inside.",
            "Hey, you have somthing on your chin... no, the 3rd one down",
            "I'd slap you, but shit stains.",
            "If I were to slap you, it would be considered animal abuse!",
            "Why don't you slip into something more comfortable -- like a coma.",
            "I have neither the time nor the crayons to explain this to you.",
            "You look like something I'd draw with my left hand.",
            "If you really want to know about mistakes, you should ask your parents.",
            "What are you doing here? Did someone leave your cage open?",
            "You're not funny, but your life, now that's a joke.",
            "You're as useless as a knitted condom.",
            "Oh my God, look at you. Was anyone else hurt in the accident?",
            "You're so fat, you could sell shade.",
            "You're as bright as a black hole, and twice as dense.",
            "You're so ugly, when you got robbed, the robbers made you wear their masks.",
            "You are proof that evolution CAN go in reverse.",
            "Do you still love nature, despite what it did to you?",
            "You're so ugly, the only dates you get are on a calendar.",
            "Shock me, say something intelligent.",
            "Learn from your parents' mistakes - use birth control!"
        ];

        try {
            if (!params.match(/<@[0-9]+>/g)) {
                message.channel.send(insults[Math.floor(Math.random() * insults.length)])
                    .then(m => {
                        dataLog.resolveOveralUsage(
                            m.guild.id,
                            message.author.id,
                            m.id,
                            module.exports.metaData().name
                        );
                    })
            } else {
                message.channel.send(`${params}, ${insults[Math.floor(Math.random() * insults.length)]}`)
                    .then(m => {
                        dataLog.resolveOveralUsage(
                            m.guild.id,
                            message.author.id,
                            m.id,
                            module.exports.metaData().name
                        );
                    })
            }
        } catch (e) {
            console.error(e.stack);
            message.channel.send("There was a problem with your insult.")
        }

    },
    metaData() {
        return {
            name: 'insult',
            avaliableOptions: '-',
            description: 'Send a random insult',
            usage: '<prefix> insult (<mention>)',
            example: `!c insult @carl`,
            group: 'fun',
            execWith: 'insult'
        }
    }
}