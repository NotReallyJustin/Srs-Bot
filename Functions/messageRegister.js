//Registers messages as they come in for slowmode

const { bot } = require("../clientConfig.js");

bot.on('messageCreate', async message => {

	if (message.author.bot) return;

    const currentChannel = bot.database.searchMessageChannel(message);
    currentChannel.inSlowmode && currentChannel.messageCount++;
});