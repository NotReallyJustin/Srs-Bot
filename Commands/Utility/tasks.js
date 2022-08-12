const Discord = require("discord.js");
const ClientConfig = require("../../clientConfig.js");
const Helpy = require("../Helpy.js");
const justinId = "348208769941110784";

module.exports = {
	name: "tasks",
	description: "The go-to hub for srs tasks, which will keep track of your tasks!",
	options: [
		{
			name: "view",
			type: Discord.ApplicationCommandOptionType.Subcommand,
			description: "Stop playing your gameboy advance and fix that 2.85 😤"
		},
		{
			name: "add",
			type: Discord.ApplicationCommandOptionType.Subcommand,
			description: "Add a task to your bucket list! Oh wait it's more homework? ew",
			options: [
				{
				    name: "task",
				    description: "The task to jot down on MongoDB cloud!",
				    required: true,
				    type: Discord.ApplicationCommandOptionType.String
				}
			]
		},
		{	
			name: "delete",
			type: Discord.ApplicationCommandOptionType.Subcommand,
			description: "Congrats! You just finished a task and are ready to yeet it!",
			options: [
				{
				    name: "index",
				    description: "The task index to yeet!",
				    required: true,
				    type: Discord.ApplicationCommandOptionType.Integer
				}
			]
		},
		{
			name: "yeet",
			type: Discord.ApplicationCommandOptionType.Subcommand,
			description: "Lady Ninguang shreds all her paper and woosh! The white paper sn- wait a min that's Genshin"
		},
		{
			name: "destroy",
			type: Discord.ApplicationCommandOptionType.Subcommand,
			description: "Shut down MangoDb but if you need to wait that's cool with me",
			defaultPermission: false,
			permissions: [
				{
					id: justinId,
					type: Discord.ApplicationCommandOptionType.User,
					permissions: true
				}
			],
		}
	],
	execute: async (interaction) => {
		const collection = ClientConfig.mangoDatabase.collection("Tasks");
		const userId = interaction.user.id;

		//If database entry does not exist, make a JSON entry
		var numCnt = await collection.countDocuments({"id": userId});
		if (numCnt == 0)
		{
			await collection.insertOne({
				id: userId,
				tasks: []
			});
		}
		let userCollection = await collection.findOne({"id": userId});

		const subName = interaction.options.getSubcommand(true);
		if (!subName)
		{
			interaction.reply("smh you have an invalid subcommand");
			return;
		}

		const subCmd = interaction.options.data[0];

		//Uses the 1st argument to determine what the user wants to do
		switch(subName) 
		{
			case "view":
				interaction.reply({embeds: [taskEmbed(userCollection.tasks)]});
			break;

			case "add": //Create new task and add it to db
				let nTask = subCmd.options[0].value;
				if (!nTask) 
				{
					interaction.reply("smh there's no task for me to add");
				}
				else
				{
					await collection.updateOne({"id": userId}, {$push: {"tasks": nTask}});

					const addResp = [
						"Updated!",
						"Ur tasks has been jotted down in my nonexistent tech planner",
						"Tech bot is now working on remembering this thing",
						"the task has been assigned to a mango",
						"io ho finito"
					]

					interaction.reply(Helpy.randomResp(addResp));
				}
			break;

			case "delete": //Deletes items at a certain index
				//The parseInt converts any null or non-decimal numbers to NaN
				let num = parseInt(subCmd.options[0].value) - 1;

				try
				{
					if (!subCmd.options[0].value) throw "there's like no item number for me to delete, but I guess ur right cause 2/3 == 0";
					if (isNaN(num)) throw "smh what fake number system are you using where that's a number?";
					if ((num < 0) || (num > userCollection.tasks.length))
					{
						throw "that item index doesn't exist smh my head";
					}
				}
				catch(err)
				{
					interaction.reply(err);
					return;
				}

				let newArr = [...userCollection.tasks.slice(0, num), ...userCollection.tasks.slice(num + 1)];
				await collection.updateOne({"id": userId}, {"$set": {"tasks": newArr}});

				const delResp = [
					"Deleted!",
					"Flushed down the drain!",
					"your task is now paying for my student debt",
					"Banished to the land of weebery",
					"Task fed to Tech Bot",
					"Threw tasks and tech bot in the garbage can",
					"cheems repeat>Help task deleting scawy",
					"Tasks is longer in your tech planner!",
					"This task is now officially old tech server"
				];
				interaction.reply(Helpy.randomResp(delResp));
			break;

			case "yeet": //Removes all tasks
				await collection.updateOne({"id": userId}, {$set: {"tasks": []}});
				interaction.reply("all your tasks have been yeeted out the window");
			break;

			default:
				interaction.reply("smh the command doesn't exist what are you doing");
			break;
		

			case "end":
				if (interaction.user.id == '348208769941110784')
				{
					await mango.close();
					interaction.reply("Done!");
				}
				else
				{
					//LMAO MONGODB DATABASE VIDEO TOP NOTCH LMAO
					interaction.reply("i don't think you're seal but if you need to wait that's cool with me");
				}
			break;
		}
	}
}

const taskEmbed = (taskArray) => {
	let tDisplay = new Discord.EmbedBuilder()
		.setAuthor({
			name: "Srs Bot",
			iconURL: "https://i.imgur.com/Bnn7jox.png"
		})
		.setColor('Green')
		.setTitle("Your Tasks:");

	let description = "";
	taskArray.forEach((currVal, idx) => {
		description += `${idx + 1}) ${currVal}\n`;
	});

	//If it's still empty, encourage the user to write stuff
	if (description == "") 
	{
		description = "<There is nothing here right now, add a task>";
	}

	tDisplay.setDescription(description);
	return tDisplay;
}