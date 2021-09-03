//The current update thing!
const currUpdate = "we're currently trying to do some POS tagging with srs rate + hidden markov model calculus stuff that's rly confusing";

module.exports = {
    name: "updatelist",
    description: "Get a sense of what srs bot is doing!",
    execute : (interaction) => {
        interaction.reply(currUpdate);
    }
}