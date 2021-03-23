const Helpy = require("../Helpy.js");

//Anonymously send an item to a channel
//It's called hotseat because that's the game pls no meme i swear it's not shameful or anything
//Thinking about it tho- isn't this basically reverse srs dm
module.exports = {
	name: "hotseat",
	description: "It's an anon hotseat game! Try to guess who that person is!\nCheck out `srs commands` to check the hotseat hubs",
	execute: async (message, args, toolkit) => {
		let hStatus = hotseatStatus(args, message.member);

		switch (hStatus)
		{
			case 200.1:
				var collection = toolkit.mangoDatabase.collection("Hot Seat");
				var iterateNum = await collection.countDocuments({"channel" : message.channel.id});
				
				//Recursion + Delete b/c didn't want to use for loop
				let findNDelete = (i, max, channelId) => {
					collection.findOneAndDelete({"channel": channelId});

					if (i < max)
					{
						return findNDelete(++i, max, collection, channelId);
					}
				}

				findNDelete(0, iterateNum, message.channel.id);
				message.channel.send("done!");
			break;

			case 200.2:
				var collection = toolkit.mangoDatabase.collection("Hot Seat");
				var bool = await collection.countDocuments({"channel": message.channel.id, "id": args[1]});

				if (!bool)
				{
					message.channel.send("i don't think that person is allowed to send messages in this channel .-.");
				}
				else
				{
					await collection.findOneAndDelete({"channel": message.channel.id, "id": args[1]});


					message.guild.members.fetch(args[1]).then(user => {
						user.send("Your hotseat perms are over - thank you for participating in the party event :)");
					});

					message.channel.send("done!");
				}
			break;

			case 200.3:
				var collection = toolkit.mangoDatabase.collection("Hot Seat");
				var bool = await collection.countDocuments({"channel": message.channel.id, "id": args[1]});

				if (!bool)
				{
					await collection.insertOne({
						id: args[1],
						channel: message.channel.id
					});

					message.guild.members.fetch(args[1]).then(user => {
						user.send("Welcome to hot seat! You can now send messages through srs bot and have it appears in the hotseat channel!");
					})

					message.channel.send("done!");
				}
				else
				{
					message.channel.send("that person is already allowed to send messages here");
				}
			break;

			case 400.1:
				message.channel.send("smh what am I supposed to do");
			break;

			case 400.2:
				message.channel.send("smh give me a user ID");
			break;

			case 404:
				message.channel.send("i don't think you gave me a keyword for what to do")
			break;

			case 888:
				message.channel.send("smh you don't have perms to do this");
			break;

			default:
				message.channel.send("woah... if you're reading this... something went wrong");
			break;
		}
	}
}

const hotseatStatus = (args, messageMember) => {
	if (!messageMember.hasPermission("BAN_MEMBERS"))
	{
		return 888; //No perms to launch hotseat status in the channels
	}

	if (args.length == 0)
	{		
		return 400.1; //Missing hotseat keyword
	}

	if (args[0] == "destroy")
	{
		return 200.1; //Eradicate all hotseat entries for this channel
	}

	if (args.length == 1)
	{
		return 400.2; //Missing user id
	}

	if (args[0] == "remove")
	{
		return 200.2; //Adds a user to the hotseat array
	}

	if (args[0] == "add")
	{
		return 200.3; //Deletes a user from the hotseat array tray perms
	}

	return 404; //Keyword not found
}