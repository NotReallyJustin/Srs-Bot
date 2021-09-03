const Helpy = require("../Helpy.js");

//Anonymously send an item to a channel
//It's called hotseat because that's the game pls no meme i swear it's not shameful or anything
//Thinking about it tho- isn't this basically reverse srs dm
module.exports = {
	name: "hotseat",
	description: "It's an anon hotseat game! Try to guess who that person is!",
	type: "SUB_COMMAND_GROUP",
	options: [
		{
			name: "destroy",
			type: "SUB_COMMAND",
			description: "Snap that hotseat game out of existence"
		},
		{
			name: "remove",
			type: "SUB_COMMAND",
			description: "Kick someone from the hotseat for being unresponsive smh",
			options: [
				{
				    name: "snowflake",
				    description: "Who's getting da boot?",
				    required: true,
				    type: "USER"
				}
			]
		},
		{
			name: "add",
			type: "SUB_COMMAND",
			description: "It's an anon hotseat game! Try to guess who that person is!",
			options: [
				{
				    name: "snowflake",
				    description: "Who got the million dollar hotseat ticket?",
				    required: true,
				    type: "USER"
				}
			]
		}
	],
	execute: async (interaction, toolkit) => {
		const subName = interaction.options.getSubcommand(true);
		if (!subName)
		{
			interaction.reply("smh what do you want me to do with hotseat?");
			return;
		}
		const subCmd = interaction.options.data[0];

		switch (subName)
		{
			case "destroy":
				var collection = toolkit.mangoDatabase.collection("Hot Seat");
				var iterateNum = await collection.countDocuments({"channel" : interaction.channelId});
				
				//Recursion + Delete b/c didn't want to use for loop
				let findNDelete = (i, max, channelId) => {
					collection.findOneAndDelete({"channel": channelId});

					if (i < max)
					{
						return findNDelete(++i, max, collection, channelId);
					}
				}

				findNDelete(0, iterateNum, interaction.channelId);
				interaction.reply("done!");
			break;

			case "remove":
				var collection = toolkit.mangoDatabase.collection("Hot Seat");
				var bool = await collection.countDocuments({"channel": interaction.channelId, "id": subCmd.options[0].value});

				if (!bool)
				{
					interaction.reply("i don't think that person is allowed to send messages in this channel .-.");
				}
				else
				{
					await collection.findOneAndDelete({"channel": interaction.channelId, "id": subCmd.options[0].value});

					interaction.guild.members.fetch(subCmd.options[0].value).then(user => {
						user.send("Your hotseat perms are over - thank you for participating in the party event :)");
						interaction.reply("Done!");
					});
				}
			break;

			case "add":
				var collection = toolkit.mangoDatabase.collection("Hot Seat");
				var bool = await collection.countDocuments({"channel": interaction.channelId, "id": subCmd.options[0].value});

				if (!bool)
				{
					await collection.insertOne({
						id: subCmd.options[0].value,
						channel: interaction.channelId
					});

					interaction.guild.members.fetch(subCmd.options[0].value).then(user => {
						user.send("Welcome to hot seat! You can now send messages through srs bot and have it appears in the hotseat channel!");
						interaction.reply("Done!");
					});
				}
				else
				{
					interaction.reply("That person is already allowed to send messages here");
				}
			break;
		}
	}
}