const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "uwu",
	description: "uwuify swomethwing uwu",
	options: [
		{
			name: "twext",
			description: "the thwing you wwwant to uwu",
			type: ApplicationCommandOptionType.String,
			required: true
		}
	],
	execute: (interaction) => {
		const text = interaction.options.getString("twext");

		if (!text)
		{
			interaction.reply("uwu you need to provide a message to uwu");
		}
		else
		{
			let str = uwuify(text);
			interaction.reply(str);
		}
	}
}

const uwuify = msgContent => {
	let uwuMsg = msgContent.replace(/[rl]/gmi, "w"); //This will get rid of srs uwu exactly
	uwuMsg = uwuMsg.replace(/om/gmi, "um")
		.replace(/be/gmi, "bwe").replace(/de/gmi, "dwe")
		.replace(/thi/gmi, "thwi")
		.replace(/ha/gmi, "hwa")
		.replace(/mo/gmi, "mwo")
		.replace(/so/gmi, "swo")
		.replace(/bo/gmi, "bwo")
		.replace(/do/gmi, "dwo")
		.replace(/ff/gmi, "fw")
		.replace(/qu/gmi, "qw");

	return uwuMsg;
}