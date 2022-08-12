const { bot } = require("../../clientConfig");

module.exports = {
	name: "toggle",
	description: "No cap on a stack fr fr yeet that wacky text sirrrrr",
	execute: (interaction) => {
		const currentChannel = bot.database.searchMessageChannel(interaction);
		currentChannel.replyMsg = !currentChannel.replyMsg;

		var replyMsg = currentChannel.replyMsg ? "ok wacky text is on" : "ok wacky text is off";
		interaction.reply(replyMsg);
	}
}