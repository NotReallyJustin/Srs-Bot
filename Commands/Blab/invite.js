const { bot } = require("../../clientConfig")

module.exports = {
    name: "invite",
    description: "Generates an invite link for srs bot! You used to be able to invite him to vacation but COVID hit.",
    execute : (interaction) => {
		interaction.reply(bot.getInviteLink());
    }
}