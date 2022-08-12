const Discord = require("discord.js");
const { bot } = require("../../clientConfig.js");

module.exports = {
	name: "writestream",
	description: "Creates a write stream to a specific channel! Why does this feel like Node.js?",
	options: [
		{
			name: "id",
			description: "The channel id you're writing to - requires MANAGE_MESSAGES perms there",
			type: Discord.ApplicationCommandOptionType.String,
			required: true
		},
		{
			name: "toggle",
			description: "Whether you're toggling the writestream on or off",
			type: Discord.ApplicationCommandOptionType.Boolean,
			required: true
		}
	],
	execute: async (interaction) => {
		const currentChannel = bot.database.searchMessageChannel(interaction);
		const toggle = interaction.options.getBoolean("toggle", true);

		let channel;
		let guildUser;
		if (toggle)
		{
			try
			{
				let id = interaction.options.getString("id", true);
				if (!id) throw "smh give me a channel id";

				channel = await bot.channels.fetch(id);
				if (!channel.type == Discord.ChannelType.GuildText || !channel.guild) throw "smh this isn't a text channel";
				if (!channel.viewable) throw "smh I can't view this channel";

				//Bot perm check
				if (!channel.permissionsFor(bot.user.id).has(Discord.PermissionsBitField.Flags.SendMessages)) throw "smh I don't have write perms";

				//User perm check
				guildUser = await channel.guild.members.fetch(interaction.user.id);
				if (!guildUser) throw "smh you're not even in that guild";
				if (!guildUser.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages)) throw "smh you don't have writeStream perms";
			}
			catch(err)
			{
				if (typeof err == "string") 
				{
					interaction.reply(err);
				}
				else
				{
					interaction.reply("hmm either that doesn't exist or I don't have perms");
				}

				return;
			}

			const writeToStream = (messageContent, message) => {
				try
				{
					channel.send(messageContent);
					message.react("❄️"); //lol pun on snowflake data type
				}
				catch(err)
				{
					message.channel.send("smh I don't have write perms or that channel doesn't exist anymore");
				}
			}
			currentChannel.addMoves(interaction.user.id, writeToStream);

			interaction.reply("Write stream created!");
		}
		else
		{
			if (currentChannel.hasValidMoves(interaction.user.id))
			{
				currentChannel.deleteMoves(interaction.user.id);
				interaction.reply("Write stream closed!");
			}
			else
			{
				interaction.reply("smh you have like nothing active rn what are you even closing");
			}
		}
	}
}