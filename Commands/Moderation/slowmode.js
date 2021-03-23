const Helpy = require("../Helpy.js");
const slowmodeDesc = "Smart slowmode - A moderator customizable alternative to slowmode en masse\
	\nIf the chat has a certain number of messages in an alloted time frame, turn on slowmode to prevent it from getting hectic\
	\n`srs slowmode <start|stop> <time check interval> <message limit>`";

module.exports = {
	name: "slowmode",
	description: slowmodeDesc,
	execute: async (message, args, toolkit, currentChannel) => {
		let slowStatus = slowmodeStatus(args, message.member);

		switch (slowStatus)
		{
			case 200.1:
				if (currentChannel.inSlowmode)
				{
					message.channel.send("Buddy slowmode detection is already on");
				}
				else
				{
					//Stores slowmode customizations in serverArray
					currentChannel.inSlowmode = true;
					currentChannel.maxNum = args[2];

					//Slowmode reset timer - this checks for slowmode message interval and determines if slowmode needs to be added

					let slowmodeReset = setInterval(() => {

						if (currentChannel.slowmoding)
						{
							if (currentChannel.messageCount < currentChannel.maxNum)
							{
								currentChannel.decentMessageCount++;

								if (currentChannel.decentMessageCount == 5) //After 5 good streaks, clear the slowmode
								{
									currentChannel.discordChannel.setRateLimitPerUser(0); //Clears slowmode
									currentChannel.slowmoding = false;
									currentChannel.decentMessageCount = 0;
									currentChannel.discordChannel.send("Slowmode off!");
								}
							}
							else //If the slowmode message count is broken, reset the whole streak
							{
								currentChannel.decentMessageCount = 0;
							}
						}

						if ((currentChannel.messageCount > currentChannel.maxNum) && (!currentChannel.slowmoding)) 

						//If there are too many messages, start the slowmode
						{
							currentChannel.discordChannel.setRateLimitPerUser(5);
							currentChannel.discordChannel.send("Aight because you kiddos can't stop yapping, slowmode is on");
							currentChannel.slowmoding = true;
						}

						currentChannel.messageCount = 0;

					}, (args[1] * 1000));
			
					//Logs the interval id so we can clear it
					currentChannel.slowmodeId = slowmodeReset;

					message.channel.send("Slowmode detection on!");
				}
			break;

			case 200.2:
				if (currentChannel.inSlowmode)
				{
					//Resets the interval and all the channel stats
					clearInterval(currentChannel.slowmodeId); //Uses the stored backend intervalID to clear the slowmode
					currentChannel.discordChannel.setRateLimitPerUser(0);
					currentChannel.inSlowmode = false;
					currentChannel.slowmoding = false;
					currentChannel.slowmodeId = -1;
					currentChannel.decentMessageCount = 0;
					currentChannel.messageCount = 0;
					currentChannel.maxNum = -1;

					message.channel.send("Slowmode detction off!");
				}
				else
				{
					message.channel.send("There's no slowmode lmao don't be paranoid");
				}
			break;

			case 400.0:
				message.channel.send("smh give me a command");
			break;

			case 400.1:
				message.channel.send("Bruh enter a timer interval more than 10");
			break;

			case 400.2:
				message.channel.send("Enter a valid message number more than 5");
			break;

			//404.1 and 404.2 stops mods from being abusive
			case 404.1:
				message.channel.send("Bruh enter a timer interval more than 10");
			break;

			case 404.2:
				message.channel.send("Enter a valid message number more than 5");
			break;

			case 404.3:
				message.channel.send("Buddy the command doesn't exist smh");
			break;

			case 888:
				const smh = [
					"You don't have the perms to unleash the nuclear weapon",
					"Sir I don't think your non-mod peers want to witness a cyberattack",
					"I'm sorry but you can't use the nuclear option",
					"so uh... where are we dropping, because I know it's not going to be in this server",
					"smh if you slowmode, half the server would revolt or smth",
					"I can ban you",
					"You better not split that command like 2 and 3 from 5",
				];

				message.channel.send(Helpy.randomResp(smh));
			break;

			default:
				message.channel.send("woah what happened here");
			break;
		}
	}
}

const slowmodeStatus = (args, messageMember) => {
	if (args.length == 0)
	{
		return 400.0; //Command not found
	}

	if (!messageMember.hasPermission(`BAN_MEMBERS`))
	{
		return 888; //No perms
	}

	//Status codes to start slowmode
	if (args[0] == "start")
	{
		if (args.length == 1) 
		{
			return 400.1; //Missing timer interval
		}

		if (args.length == 2)
		{
			return 400.2; //Missing message limit
		}

		if (isNaN(args[1]) || args[1] < 10)
		{
			return 404.1; //Invalid timer interval
		}

		if (isNaN(args[2]) || (args[2] < 5))
		{
			return 404.2; //Invalid message limit
		}

		return 200.1;
	}

	if (args[0] == "stop")
	{
		return 200.2;
	}

	return 404.3; //Invalid command
}