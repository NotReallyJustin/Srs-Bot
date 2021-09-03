const Helpy = require("../Helpy.js");
const Discord = require("discord.js");

module.exports = {
	name: "warn",
	description: "Warns a user for something - or for wastebinning general again",
	options: [
		{
		    name: "snowflake",
		    description: "The person you're warning for weebery",
		    required: true,
		    type: "USER"
		},
		{
		    name: "reason",
		    description: "Why are you warning them?",
		    required: true,
		    type: "STRING"
		}
	],
	execute: async (interaction) => {
		let user;
		let reason;

		try
		{
			user = interaction.options.getUser("snowflake", true);
			reason = interaction.options.getString("reason", true);
		}
		catch(err)
		{
			interaction.reply("smh a parameter wasn't filled in");
			return;
		}

		var x = warnMsg(interaction.user, reason);
		user.send({embeds: [x]});

		interaction.reply("If all goes well, it's sent!");
	}
}

//Creates a fancy embembed to warn them
const warnMsg = (messageAuthor, reason) => {
	let warnMessage = new Discord.MessageEmbed()
		.setAuthor("Srs Bot", "https://i.imgur.com/Bnn7jox.png")
		.setColor('GOLD')
		.setTitle("Warn Message")
		.setDescription(`You have been warned by ${messageAuthor.username}! Warn reason:\n${reason}`);

	return warnMessage;
}