const Discord = require("discord.js");
const Helpy = require("../Helpy.js");

module.exports = {
	name: "tasks",
	description: "The go-to hub for mit tasks, which will keep track of your tasks!\nCheck `mit commands` to see the full mit tasks!",
	execute: async (message, args, toolkit) => {
		const collection = toolkit.mangoDatabase.collection("Tasks");
		const userId = message.author.id;

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

		//Uses the 1st argument to determine what the user wants to do
		switch(args[0]) 
		{
			case "view":
			case undefined: //Display tasks in embed
				message.channel.send(taskEmbed(userCollection.tasks));
			break;

			case "add": //Create new task and add it to db
				let nTask = Helpy.returnUnbound(message.content, "add");
				await collection.updateOne({"id": userId}, {$push: {"tasks": nTask}});

				const addResp = [
					"Updated!",
					"Ur tasks has been jotted down in my nonexistent tech planner",
					"Tech bot is now working on remembering this thing",
					"the task has been assigned to a mango",
					"io ho finito"
				]

				message.channel.send(Helpy.randomResp(addResp));
			break;

			case "delete": //Deletes items at a certain index
				let num = parseInt(args[1]) - 1;
				let status = taskDeleteStatus(args, userCollection.tasks.length, num);

				switch (status)
				{
					case 200:
						//Array slice basically is substring
						let newArr = [...userCollection.tasks.slice(0, num), ...userCollection.tasks.slice(num +1)];
						await collection.updateOne({"id": userId}, {$set: {"tasks": newArr}});

							const delResp = [
								"Deleted!",
								"Flushed down the drain!",
								"your task is now paying for my student debt",
								"Banished to the land of weebery",
								"Task fed to Tech Bot",
								"Threw tasks and tech bot in the garbage can",
								"cheems repeat>Help task deleting scawy",
								"Tasks is longer in your tech planner!"
							];
							message.channel.send(Helpy.randomResp(delResp));
						break;

						case 400:
							message.channel.send("there's like no item number for me to delete, but I guess ur right cause 2+2 sometimes equals 5");
						break;

						case 404:
							message.channel.send("smh what fake number system are you using where that's a number?");
						break;

						case 500:
							message.channel.send("that item index doesn't exist smh my head");
						break;

						default:
							message.channel.send("woah how did we get here?");
						break;
				}

			break;

			case "yeet": //Removes all tasks
				await collection.updateOne({"id": userId}, {$set: {"tasks": []}});
				message.channel.send("all your tasks have been yeeted out the window");
			break;

			default:
				message.channel.send("smh the command doesn't exist what are you doing");
			break;
		

			case "end":
				if (message.author.id == '348208769941110784')
				{
					await mango.close();
					message.channel.send("Done!");
				}
				else
				{
					//LMAO MONGODB DATABASE VIDEO TOP NOTCH LMAO
					message.channel.send("i don't think you're seal but if you need to wait that's cool with me");
				}
			break;
		}
	}
}

const taskEmbed = (taskArray) => {
	let tDisplay = new Discord.MessageEmbed()
		.setAuthor("mit Bot", "https://i.imgur.com/Bnn7jox.png")
		.setColor('GREEN')
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

//Checks whether the user can delete the tasks
const taskDeleteStatus = (args, uColLength, num) => {

	if (args.length == 1)
	{
		return 400; // Delete index does not exist
	}

	if (isNaN(num))
	{
		return 404; //Index is not a number 
	}

	if ((num < 0) || (num > uColLength))
	{
		return 500; //Index out of bounds
	}

	return 200;
}