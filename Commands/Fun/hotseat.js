const Discord = require("discord.js");
const ClientConfig = require("../../clientConfig.js");
const Helpy = require("../Helpy.js");

//Anonymously send an item to a channel
//It's called hotseat because that's the game pls no meme i swear it's not shameful or anything
//Thinking about it tho- isn't this basically reverse srs dm
//Also see /Functions/hotseat.js
module.exports = {
	name: "hotseat",
	description: "It's an anon hotseat game! Try to guess who that person is!",
	options: [
		{
			name: "destroy",
			type: Discord.ApplicationCommandOptionType.Subcommand,
			description: "Snap that hotseat game out of existence"
		},
		{
			name: "remove",
			type: Discord.ApplicationCommandOptionType.Subcommand,
			description: "Kick someone from the hotseat for being unresponsive smh",
			options: [
				{
				    name: "snowflake",
				    description: "Who's getting da boot?",
				    required: true,
				    type: Discord.ApplicationCommandOptionType.User
				},
				{
					name: "channel",
					description: "The channel to hotseat into",
					required: true,
					type: Discord.ApplicationCommandOptionType.Channel
				}
			]
		},
		{
			name: "add",
			type: Discord.ApplicationCommandOptionType.Subcommand,
			description: "It's an anon hotseat game! Try to guess who that person is!",
			options: [
				{
				    name: "snowflake",
				    description: "Who got the million dollar hotseat ticket?",
				    required: true,
				    type: Discord.ApplicationCommandOptionType.User
				},
				{
					name: "channel",
					description: "The TEXT channel to hotseat into",
					required: true,
					type: Discord.ApplicationCommandOptionType.Channel
				}
			]
		}
	],
	execute: async (interaction) => {
		const subName = interaction.options.getSubcommand(true);
		if (!subName)
		{
			interaction.reply("smh what do you want me to do with hotseat?");
			return;
		}
		const subCmd = interaction.options.data[0];
		const collection = ClientConfig.mangoDatabase.collection("Hot Seat");

		//Check admin perms
		if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages))
		{
			interaction.reply("smh you need staff perms to run hotseat");
			return;
		}

		switch (subName)
		{
			case "destroy":
				await collection.deleteMany({"channel": interaction.channelId}); //uncomment below if goes wrong
				/*var iterateNum = await collection.countDocuments({"channel" : interaction.channelId});
				
				//Recursion + Delete b/c didn't want to use for loop
				let findNDelete = async (i, max, channelId) => {
					await collection.findOneAndDelete({"channel": channelId});

					if (i < max)
					{
						return await findNDelete(++i, max, collection, channelId);
					}
				}

				await findNDelete(0, iterateNum, interaction.channelId);*/
				interaction.reply("done!");
			break;

			case "remove":
				if (!subCmd.options[1].channel.type == Discord.ChannelType.GuildText)
				{
					interaction.reply("smh this is not a text channel");
					return;
				}

				var bool = await collection.countDocuments({"channel": subCmd.options[1].channel.id, "id": subCmd.options[0].value});

				if (!bool)
				{
					interaction.reply("i don't think that person is allowed to send messages in this channel .-.");
				}
				else
				{
					await collection.findOneAndDelete({"channel": subCmd.options[1].channel.id, "id": subCmd.options[0].value});

					interaction.guild.members.fetch(subCmd.options[0].value).then(user => {
						user.send("Your hotseat perms are over - thank you for participating in the party event :)");
						interaction.reply("Done!");
					});
				}
			break;

			case "add":
				if (!subCmd.options[1].channel.type == Discord.ChannelType.GuildText)
				{
					interaction.reply("smh this is not a text channel");
					return;
				}

				if (!interaction.guild.members.me.permissionsIn(subCmd.options[1]).has(Discord.PermissionsBitField.Flags.SendMessages, Discord.PermissionsBitField.Flags.ReadMessageHistory))
                {
                    interaction.editReply("smh give me write and view message history perms to that channel\nOr alternatively Gabe gimme admin perms");
                    return;
                }
				
				var bool = await collection.countDocuments({"channel": interaction.channelId, "id": subCmd.options[0].value});

				if (!bool)
				{
					await collection.insertOne({
						id: subCmd.options[0].value,
						channel: subCmd.options[1].channel.id
					});

					interaction.guild.members.fetch(subCmd.options[0].value).then(user => {
						user.send("Welcome to hot seat! You can now send messages through srs bot and have it appears in the hotseat channel!");
						interaction.reply({ content: "Done!", ephemeral: true });
					});
				}
				else
				{
					interaction.reply({ content: "That person is already allowed to send messages here", ephemeral: true });
				}
			break;
		}
	}
}
