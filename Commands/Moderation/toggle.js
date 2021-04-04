module.exports = {
	name: "toggle",
	description: "Toggles wacky text in current channel\n`mit toggle`",
	execute: (message, args, toolkit, currentChannel) => {
		currentChannel.replyMsg = !currentChannel.replyMsg;

		var replyMsg = currentChannel.replyMsg ? "ok wacky text is on" : "ok wacky text is off";
		message.channel.send(replyMsg);
	}
}