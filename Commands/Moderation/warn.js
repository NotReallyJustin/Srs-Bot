const { ApplicationCommandOptionType } = require("discord.js");
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
		    type: ApplicationCommandOptionType.User
		},
		{
		    name: "reason",
		    description: "Why are you warning them?",
		    required: true,
		    type: ApplicationCommandOptionType.String
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

		//Check for user perms
		if (interaction.member.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages))
		{
			var x = warnMsg(interaction.user, reason);
			let sendPromise = user.send({embeds: [x]});

			sendPromise.then(() => {
				interaction.reply("If all goes well, it's sent!");
			});
			
			sendPromise.catch(err => {
				interaction.reply("Something went wrong with sent - check error logs. But likely, the user just blocked srs bot");
				console.error(err);
			})
		}
		else
		{
			interaction.reply("smh you don't have warn perms");
		}
	}
}

//Creates a fancy embembed to warn them
const warnMsg = (messageAuthor, reason) => {
	let warnMessage = new Discord.EmbedBuilder()
		.setAuthor({
			name: "Srs Bot",
			iconURL: "https://i.imgur.com/Bnn7jox.png"
		})
		.setColor('Gold')
		.setTitle("Warn Message")
		.setDescription(`_You have been warned by ${messageAuthor.username}!_ \n**Warn reason:** ${reason}`);

	return warnMessage;
}