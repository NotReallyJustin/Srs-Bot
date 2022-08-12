//The current update thing!
const currUpdate = "Currently updating to v14!";

module.exports = {
    name: "updatelist",
    description: "Get a sense of what srs bot is doing!",
    execute : (interaction) => {
        interaction.reply(currUpdate);
    }
}