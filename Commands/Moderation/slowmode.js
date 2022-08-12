const Helpy = require("../Helpy.js");
const Discord = require("discord.js");
const { bot } = require("../../clientConfig.js");
/*const slowmodeDesc = "Smart slowmode - A moderator customizable alternative to slowmode en masse\
	\nIf the chat has a certain number of messages in an alloted time frame, turn on slowmode to prevent it from getting hectic\
	\n`srs slowmode <start|stop> <time check interval> <message limit>`";*/

//Also see - messageRegister.js
module.exports = {
	name: "slowmode",
	description: "yeet",
	options: [
		{
			name: "start",
			type: Discord.ApplicationCommandOptionType.Subcommand,
			description: "Smart slowmode auto-toggle based on user activity!",
			options: [
				{
				    name: "interval",
				    description: "How often srs does a interval check/assesses the chat (>= 10s)",
				    required: true,
				    type: Discord.ApplicationCommandOptionType.Integer
				},
				{
				    name: "limit",
				    description: "The acceptable message limit you'll allow in the interval check (>= 5 messages)",
				    required: true,
				    type: Discord.ApplicationCommandOptionType.Integer
				},
				{
				    name: "ratelimit",
				    description: "If we do turn on slowmode, how long should it be? (>= 5 sec)",
				    required: true,
				    type: Discord.ApplicationCommandOptionType.Integer
				}
			]
		},
		{
			name: "stop",
			type: Discord.ApplicationCommandOptionType.Subcommand,
			description: "Is your server complaining? Great! Stop the slowmode here!"
		}
	],
	execute: async (interaction) => {
		const currentChannel = bot.database.searchMessageChannel(interaction);
		const commandName = interaction.options.getSubcommand(true);
		const subCmd = interaction.options.data[0];

		switch (commandName)
		{
			case "start":
				//args[0] == interval, args[1] == limit, args[2] == ratelimit
				let interval;
				let limit;
				let ratelimit;

				try
				{
					interval = subCmd.options[0].value;
					if (interval < 10)
					{
						throw "Bruh enter a timer interval more than 10";
					}

					limit = subCmd.options[1].value;
					if (subCmd.options[1].value < 5)
					{
						throw "Cmon enter something more than 5; you know you'll cause a riot this way";
					}

					ratelimit = subCmd.options[2].value;
					if (ratelimit < 5)
					{	
						throw "ok I know you're probably going to disappoint me with a < 1520 SAT but at least try to read the command before sending it";
					}

					if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages))
					{
						throw "smh you don't have perms to unleash the WMD. Come back when you have manage message perms";
					}
				}
				catch(err)
				{
					if (typeof err == 'string')
					{
						interaction.reply(err);
					}
					else
					{
						console.error(err);
						interaction.reply("Something went wrong with your discord bot perms. If this persists, ping Justin");
					}
					return;
				}

				if (currentChannel.inSlowmode)
				{
					interaction.reply("Buddy slowmode detection is already on");
				}
				else
				{
					//Stores slowmode customizations in serverArray
					currentChannel.inSlowmode = true;
					currentChannel.maxNum = limit;

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

						//If there are too many messages, start the slowmode
						//console.log(currentChannel.messageCount)
						if ((currentChannel.messageCount > currentChannel.maxNum) && (!currentChannel.slowmoding)) 
						{
							currentChannel.discordChannel.setRateLimitPerUser(ratelimit);
							currentChannel.discordChannel.send("Aight because you kiddos can't stop yapping, slowmode is on");
							currentChannel.slowmoding = true;
						}

						currentChannel.messageCount = 0;

					}, (interval * 1000));
			
					//Logs the interval id so we can clear it
					currentChannel.slowmodeId = slowmodeReset;

					interaction.reply("Slowmode detection on!");
				}
			break;

			case "stop":
				if (currentChannel.inSlowmode)
				{
					try
					{
						if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages))
						{
							throw "smh you don't have perms to fix the WMD. Come back when you have manage message perms";
						}
					}
					catch(err)
					{
						if (typeof err == 'string')
						{
							interaction.reply(err);
						}
						else
						{
							console.error(err);
							interaction.reply("Something went wrong with your discord bot perms. If this persists, ping Justin");
						}
						return;
					}
					
					//Resets the interval and all the channel stats
					clearInterval(currentChannel.slowmodeId); //Uses the stored backend intervalID to clear the slowmode
					currentChannel.discordChannel.setRateLimitPerUser(0);
					currentChannel.inSlowmode = false;
					currentChannel.slowmoding = false;
					currentChannel.slowmodeId = -1;
					currentChannel.decentMessageCount = 0;
					currentChannel.messageCount = 0;
					currentChannel.maxNum = -1;

					interaction.reply("Slowmode detction off!");
				}
				else
				{
					interaction.reply("There's no slowmode lmao don't be paranoid");
				}
			break;
		}
	}
}