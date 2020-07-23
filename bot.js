const Discord = require("discord.js");
const prefix = "srs";
const weather = require("weather-js");
const bot = new Discord.Client();

bot.login(process.env.BOT_TOKEN);

bot.on("ready", () => {
	console.log("I'm clearly confused");

	/* Array to keep track of all the servers; can't make a hash table because Array(1E18) doesn't work */
	serverArray = [];

	bot.generateInvite(["ADMINISTRATOR"]).then(link => {
		console.log(link);
	}).catch(err => {
		console.log(err.stack);
	})
})

//Basic functions

//Roll generates a random integer
function roll(outcomes) {
	return Math.floor(Math.random() * outcomes);
}

//Takes something in a list, and randomly sends something in it
function randomResp(list, message) {
	if (typeof list != "object")
	{
		console.log("Give me a list you brainlet");
	}
	else
	{
		var rollNum = roll(list.length);
		message.channel.send(list[rollNum]);
	}
}

function shame(plyerTheKnight, message) { //Only people who played fight club would know
	let response = [
		"I don't see any substring function for you to exploit there buddy",
		"Liked how Justin patched the bug?",
		"Get rekt by data analytics",
		"So I think a brainlet did data analytics, and now I can't meme on light mode anymore",
		"shameLightMode.exe not found",
		"You may have the Github code and Cat, but I have data analytics",
		"Get yourself into the hall of shame of exploiting ``Substring()``",
		"The substring command has an parameter called infosys... that sounds like what Justin used to meme on you all",
		"Really? Exploiting the code?",
		"Messing with the substring command... daring today, are we?",
		"Go commit the NRG command",
		"smh substring exploiter",
		"Hey substring exploiter, meet my friend big data",
		"It's actually not that hard to analyze data... especially with heathens like you",
		"Srs bot lesson 1: always make functions... you'll thank yourself when you take literally 3 minutes to stop substring exploiters",
		"Always pretend that the user is Justin and will brainlet and will do something very justin moment... wait, is that talking about you?",
		"Go commit setTimeOut 100ms in a while loop",
		"smh substring exploiter go commit setTimeOut 100ms in a while loop",
		"Go commit setTimeOut 100ms in a while loop",
		"Smh I'm not memeing on light mode",
		"Go kermit futaba and palpitate",
		"I'll make you see the light eventually",
		`/warn trying to make me meme on light mode`,
		"smh I would insult your intelligence, but that meant you had some to begin with",
		"You have yeed your last haw",
		"calling you a brainlet would assume you have a brain to know Justin would go data analytics on ya",
		"not memeing on light mode- THAT'S HOW THE MAFIA WORKS",
		"The person above me is now the daily special at Shop Lift Up",
		"Hey, how do you like the substring function?",
		"smh go kermit substring function", 
		"smh go kermit substring function", 
		"The power of tier III technologies stop you from exploiting srs rate",
		"Go kermit palpitate"
	]; //Now that I think of it, if Cat tries to infiltrate this code, the new variable names would give it all away
	randomResp(response, message);

	if (plyerTheKnight) 
	{
		message.channel.send("Light theme best theme");
	}
	else 
	{
		message.channel.send("I give dark mode 0/10");
	}
}

//Keeps track of the server's slowmode status and all that
function Server(serverId) {
	this.channelArray = []; //Starts hash table for these too because I'm lazy
	this.id = serverId;
}
function Channel(channelId) {
	this.slowmodeId = -1; //Slowmode id keeps track of the timer number to clear
	this.inSlowmode = false;
	this.maxNum = -1;
	this.id = channelId;
	this.messageCount = 0;
	this.slowmoding = false; //Slowmoding tells if the channel is act on slowmode
	this.decentMessageCount = 0;
}

//Returns the server/channel object in a server or channel list given the snowflake ID
function findItem(list, requestedId)
{
	for (var i=0; i<list.length; i++)
	{
		if (list[i].id == requestedId)
		{
			return list[i];
		}
	}

	return null; //If it can't find anything, return null
}

bot.on('message', async message => {

	//Returns a value if it matches the uppercase
	function uppercaseMatch(queryMatch, reply) {
		if (message.content.toUpperCase() == queryMatch.toUpperCase())
		{
			message.channel.send(reply);
		}
	}	

	//beforeArgs sends a message if the arguments match
	function beforeArgs(suffix, response) {
		if (args[0] == suffix)
		{
			message.channel.send(response);
		}
	}

	//cmdDetect takes the first argument to the srs command chain, and returns the command from that.
	//It returns whether the srs command matches a certain designated command
	function cmdDetect(suffix) {
		return (args[0].toLowerCase() == suffix);
	}

	/*Three parts to this section
	If the author is a bot, do nothing
	If the author is tech bot, shame it
	If the author is not a bot, jot down the slowmode messages
	*/

	if ((message.author.bot) && (message.author.id != "542408239946661898"))
	{
		return;
	}
	if (message.author.id == "542408239946661898=")
	{
		let techBotList = [
			"Shut up degenerate",
			"smh go kermit substring function",
			"The person who made you anti-light mode is a brainlet",
			`If your username is "imagine using light mode," your author is a brainlet`,
			"Hey! That's my quote!",
			"BE QUIET YOU PIECE OF CHINESE ADWARE",
			"Go kermit download Clean Master you donkey bot",
			"Go back to the time out corner you bot",
			"It's not horny hour, no Cheetah Mobile spyware yet",
			"BE QUIET YOU PIECE OF STEVENWARE",
			"BE QUIET YOU PIECE OF STEVENWARE",
			"Be quiet you bot and go kermit palpitate",
			"smh go back to debug mode"
		];
		randomResp(techBotList, message);
		return;
	}

	//Adds the server and channel to the array so we can keep track of it later if it does not already exist
	if (findItem(serverArray, message.guild.id) == null) //Checking to see if server objects exist so we can clear the damn timers
	{
		let tempServer = new Server(message.guild.id);
		serverArray.push(tempServer);
	}
	if (findItem(findItem(serverArray, message.guild.id).channelArray, message.channel.id) == null)
	{
		let tempChannel = new Channel(message.channel.id);
		findItem(serverArray, message.guild.id).channelArray.push(tempChannel);
	}

	//Registers number of messages for the slowmode. If the author is not a bot, regiser it.
	//If it is not in slowmode detection mode, do not register the messages
	let currentChannel = findItem(findItem(serverArray, message.guild.id).channelArray, message.channel.id);
	if ((!message.author.bot) && (currentChannel.inSlowmode))
	{
		currentChannel.messageCount += 1;
	}

	//Srs easter egg section

	//Cat - If it contains Btech, smh it
	if (/bths|btech|brooklyn tech/gmi.test(message.content))
	{
		message.channel.send("Smh BTHS");
		return;
	}

	uppercaseMatch("My trig grade is ruined", "smh be quiet and study for your 1520");
	uppercaseMatch("Daily miku!", "smh stop being a degenerate and worshipping some egirl");
	uppercaseMatch("Seal hunting time", "You better start running before I put you in char su fan");
	uppercaseMatch("Light theme best theme", "Correct!");

	let lightMode = [
		"Smh at least he can read in the sun",
		"no u",
		"Smh how can you meme on eye strain when you're reading in the dark",
		"It's let there be light, not let there be heathens",
		"You dare oppose me with that dark mode",
		"smh how are you going to say that and then call Justin the brainlet",
		"You have yeed your last haw",
		"There are 10 reasons Europe emerged from the Dark Ages; using AMOLED is not one of them",
		"smh I would insult your intelligence, but that would mean you had some to begin with",
		//`${illegal} ${illegal} ${illegal}`,
		"I suggest you use your right to remain silent",
		"Congratulations! Your message is more hated than Space Jams!",
		"Ding Dong your brainlet opinion is wrong",
		"smh how can you be more wrong than people who try to meme on Justin's variables",
		"Go turn yourself into a JavaDerp function",
		"Go commit the NRG command"
	];
	uppercaseMatch("ew light mode", lightMode[roll(lightMode.length)]);

	/*messageArray converts the command into an array of text, which are used to determine srs commands
	Accordingly, command is the first item inside the array (srs)
	Anything after that are args to the command - although args will be used very sparingly due to confusion*/

	messageArray = message.content.split(" ");
	command = messageArray[0];
	args = messageArray.slice(1); 

	if (command == prefix) //Entering Srs bot prefix code section
	{
		switch (args[0].toLowerCase())
		{
			case "invite":
				let americanAirlines = [
				"smh didn't buy your broke college student a plane ticket",
				"smh how am I going to get there",
				"I better see a shellfish tower and lobster ravioli when i get there",
				"I'm too busy enjoying colorful sublime text",
				"WHAT!? Did Justin opensource my token again?",
				"hol up did Justin pull a Github.opensource.IPAddress"
				];
				randomResp(americanAirlines, message);
			break;

			case "cat":
				let smh = [
				"yes 1520 gang",
				"isn't that the kid that helped get me on full time?",
				"Oh the APCPS major kid",
				"SHHHH I'm buying milk for the cat"
				];
				randomResp(smh, message);
			break;

			case "rob":
				message.channel.send("Here take my college debt");
			break;

			case "help":
				let helpResp = [
					"Help me help you smh",
					"Smh does it look like I work in customer support"
				];
				randomResp(helpResp, message);
			break;

			case "joke":
				message.channel.send("Smh you're a joke");
			break;

			case "sleep":
				let sleepResp = [
					"Smh how can you tell me to sleep when you're up at horny hour",
					"Smh stop staying up until 3AM and actually hit the bed"
				]
				randomResp(sleepResp, message);
			break;

			case "hi":
				message.channel.send("smh pay more respects to your elder");
			break;

			case "hire":
				message.channel.send("Ew no I don't want to work your shitty job");
			break;

			case "ping": //Might do smth cool here in the future
				message.channel.send("I'm not a ping pong ball smh");
			break;

			case "profile":
				message.channel.send("What even is my profile? Oh...");
			break;

			case "feed":
				message.channel.send("Smh I'm not eating on my keeb");
			break;

			case "description":
				message.channel.send("Your broke college student, on a mission to save the world from shitty moderation bots and the axis of darkness");
			break;

			case "updatelist":
				message.channel.send("Justin rewrote me agai- wait. Isn't this the 4th time he rewrote the bot code");
			break;

			case "commands":
				message.channel.send("https://github.com/ComradeDiamond/Srs-Bot/wiki");
			break;

			case "website":
				message.channel.send("Patience, young Jedi, patience. \nNow go binge starwars or something");
			break;

			case "philip":
				let chad = [
				"THIS IN UNFAIR!",
				"Oh come on! Where is the manager?",
				"Wait, is this even Srs bot anymore?",
				"Let's just get this done, aight?",
				"LETS DO THIS",
				"That's it. We're screwed ._."
				];
				randomResp(chad, message);
			break;

			//Srs weather - returns the weather
			case "weather":

				//Weather API fetches NYC temp, and returns it
				//Think of these as weather.find(stuff, callback) and the code uses reject and result as the variables in there
				weather.find({search: 'New York, NY', degreeType: 'F'}, function(reject, result) {
					if (reject)
					{
						console.log("You made an oof you brainlet");
					}
					else
					{
						//NYC returns the entire JSON from weatherAPI, lows and highs, and the precip chance
						let nyc = JSON.parse(JSON.stringify(result, null, 2));
						let low = nyc[0].forecast[1].low;
						let high = nyc[0].forecast[1].high;
						let precipChance = nyc[0].forecast[1].precip;

						message.channel.send(`wtf it's ${low} lowest and ${high} highest with ${precipChance}% chance to get wet`);

						//If the second argument is advanced, give advanced feedback


						let weatherRec = function(temp1, temp2, text) { //Srs bot reccomends you what to wear sorta
  							if ((high > temp1) && (high < temp2))
  							{
  								message.channel.send(text);

  								if (parseInt(precipChance) > 30)
  								{
  								message.channel.send("bring an umbrella with you");
  								}
  							}
  						}

  						weatherRec(-50, 0, "where is climate change when you need it?");
						weatherRec(-1, 20, "scarves ONLY");
						weatherRec(19, 40, "smh wear that thick navy blue thing");
						weatherRec(39, 50, "short sleeve and thick jacket time");
						weatherRec(49, 60, "wtf it's actually T-shirt time?");
						weatherRec(59, 75, "quick do what JoKang is doing");
						weatherRec(74, 85, "smh go buy a hat or smth");
						weatherRec(84, 100, "You want to go out? Don't");
						weatherRec(99, 1000, "It's so hot wtf move to Canada");
						weatherRec(1000, 5000, "What planet do you live on?")
					}
				})
			break;

			case "advice": //Srs answers your most burning questions
				if (cmdDetect("advice")) {
					if (messageArray.length == "2") //Checks whether there are additional arguments. srs advice == length of 2
					{
						message.channel.send("smh what am I supposed to give you advice on?"); 
					} 
					else if (/[^\w\d, .;'@#<>!:?]/ig.test(args)) //Uses regEx to filter out any anti-light mode treachery
					{ 
						shame(true, message);
						return;
					} 
					else if ((/light/ig.test(args)) || (/dark/ig.test(args))) //If there is light mode and dark mode, praise the light
					{
						let seeNoEvil = [
							"smh Light theme best theme",
							"I swear I will launch the Spanish Inquisition against dark mode",
							"reference error: Srs.Betray(Justin) does not exist",
							"Internal error: You should know light mode > dark mode",
							"smh Light Mode good"
						];
						randomResp(seeNoEvil, message);
					} 
					else if (/amoled/ig.test(args)) //AMOLED users are respectable
					{
						message.channel.send("Yes don't be those dark mode brainlets and use amoled in the dark");
					} 
					else 
					{
						let eightWheel = [
							"smh try again I'm tired",
							"yes",
							"hell no",
							"probably",
							"i think yea",
							"i think no"
						];
						randomResp(eightWheel, message);
					}
				}
			break;

			case "rate":
				if (messageArray.length == 2)
				{
					message.channel.send("smh what am I supposed to rate?"); //Sees if there are arguments
				}
				else if (/[^\w\d,.; <>'!@#:?]/ig.test(args)) //If there are invalid characters, stop them from ruining light mode
				{
					shame(true, message);
				}
				else if (/light|amoled/ig.test(args)) //Light theme best theme
				{
					if ((!(/\bdiscord\b|\bdiscord's\b|\byoutube\b|\bchrome\b/ig.test(args))) && (messageArray.length > 4))
					{
						shame(true, message); //If there are additional words, shame them for trying to make light mode sound bad
						return;
					}
					if (messageArray.length > 5)
					{
						shame(true, message);
						return;
					}
					message.channel.send("I give 10/10");
				}
				else if (/dark/ig.test(args)) //Ew dark mode
				{
					if ((!(/\bdiscord\b|\bdiscord's\b|\byoutube\b|\bchrome\b/ig.test(args))) && (messageArray.length > 4))
					{
						shame(false, message); //Same for the shame part in light mode
						return;
					}
					if (messageArray.length > 5)
					{
						shame(false, message);
						return;
					}

					let darkMode = [
						"Is there a number less than negative infinity?",
						"-50000 / 10",
						"The number would be so negative that it makes Alaska seem like a joke",
						"what are the jokes of infecting greenland? Yea, that number",
						"smh take whatever number you're thinking of, take the absolute value, then multiply it by -1",
						"less than the chances of Justin joining LAS... oh wait",
						"less than the chances of Justin going to Finance Major next y... oh wait",
						"less than the chances of Justin reinstalling Clean Master",
					];
					randomResp(darkMode, message)
				}
				else
				{
					var dankMemes = roll(11);
					message.channel.send(`I give ${dankMemes}/10`)
				}				
			break;

			case "dm":
				//Detects if they have a user ID in the first place
				if (isNaN(args[1])) 
				{
					message.channel.send("Give me a user ID smh");
				}
				else if (messageArray.length == 3) //Makes sure they have something to send
				{
					message.channel.send("smh what am I supposed to say");
				}
				else
				{
				//Takes the message array and turns it to a string, which we replace the array commas to form a legible sentence
				//then we send the message
					userId = args[1].toString(); 
					newArgs = messageArray.slice(3);
					newArgs = newArgs.toString();
					newArgs = newArgs.replace(/,/g, " ");

					if (message.author.id != '269971449328959488' && message.author.id != '0') 
					{
						newArgs += ` (frum ${message.author.username})` 
					}
					else if (message.author.id == '0') //Birthday gift of private messaging
					{
						bot.channels.get("701858995299942482").send(`Invalid User has sent "${newArgs}" to ${bot.users.get(userId).username}!`);
					}
					else 
					{
						let randomList = [
							"Egg Pudding",
							"Valdictorian", //Justin exclusive nicknames
							"Seal Team 6",
							"United States Navy Seals",
							"PlyerTheDefender",
							"Srs Bot Owner"
						];
						newArgs += ` (frum ${randomList[roll(6)]})`
					}
				}

				message.guild.fetchMember(userId).then((user) => { //Sends the message!
					user.send(newArgs);
				}); 
				message.channel.send("If all goes well, message is sent!");
			break;

			case "mention": //Srs mentions certain people if conditions are met
				if (messageArray.length == 2) //Checks for extra mandatory args
				{
					message.channel.send("What am I pinging?");
					return;
				}
				if (messageArray[2] == "owner") //Pings Justin
				{
					message.channel.send("<@348208769941110784>");
					return;
				}
				if (messageArray[2] == "band") //Pings the band kids
				{
					let bandList = [
						"458997270227058698", 
						"309494444925911041",
						"464229820994158615", 
						"360859374870331414",
						"348208769941110784"
					];

					if (bandList.indexOf(message.author.id) == -1)
					{
						message.channel.send("smh don't be a rulerbreaker you're not in band");
					}
					else
					{
						//This section makes life easier in case we want to add more names: go through the for loop and tag them all
						let mentionMessage = `From ${message.author}:`;

						for (var i in bandList)
						{
							mentionMessage += ` <@${bandList[i]}>`;
						}

						message.channel.send(mentionMessage);
					}
					return;
				}
				message.channel.send("No matches\nIf you don't know the code word, chances are, you can't mass ping")
			break;

			//*SRS MODERATION*//

			//Maybe one day I'll make a command handler and use the trash eval function

			function ban(ID, reason) { //If the executor has ban perms and the offender doesn't, ban the user and send them a DM.
				message.guild.fetchMember(ID).then((user) => {
					if (message.member.hasPermission(`BAN_MEMBERS`) && !user.hasPermission(`BAN_MEMBERS`)) 
					{
						user.send("You have been banned! Ban reason: " + reason);
						user.ban({reason: reason}); //Lowercase reason might cause some errors
						message.channel.send("Done! Now gimme a cookie");
					}
					else 
					{
						message.channel.send("You don't have ban permissions lol");
					}
				})
			}
	
			//Can't mute because that requires a designated mute role

			function warn(ID, reason) { //Warns the user
				message.guild.fetchMember(ID).then((user) => {
					if (message.member.hasPermission(`BAN_MEMBERS`)) 
					{
						let warnMessage = new Discord.RichEmbed(); //Creates a fancy embembed to warn them
						warnMessage.setAuthor("Srs Bot", "https://i.imgur.com/Bnn7jox.png");
						warnMessage.setColor('GOLD');
						warnMessage.setTitle("Warn Message");
						warnMessage.setDescription(`You have been warned by ${message.author.username}! Warn reason:\n${reason}`);
				
						user.send(warnMessage);
						message.channel.send("If your ID exists, it's done!");
					} 
					else 
					{
						message.channel.send("You don't have perms bruv");
					}
				})
			}

			case "ban":
				if (messageArray.length == "2") //Preventing Justin moments with args
				{
					message.channel.send("Give me someone to ban");
					return;
				} 
				else if (messageArray.length == "3") //Bans are severe - srs bot requires a reason
				{
					message.channel.send("Give me a ban reason smh");
					return;
				} 

				var banUser = args[1].toString();

				var reason = messageArray.slice(3);
				reason = reason.toString(); //Could use come concats here, but to string is easier to understand
				reason = reason.replace(/,/g, " ");

				ban(banUser, reason);
			break;

			case "warn":
				if (messageArray.length == 2) //Checks for the second arg
				{
					message.channel.send("Give me someone to warn smh", message);
					return;
				} 
				else if (messageArray.length == 3) //Checks for a message
				{
					message.channel.send("give me a warn reason smh", message);
					return;
				}

				var warnUser = args[1].toString();

				var reason = messageArray.slice(3);
				reason = reason.toString();
				reason = reason.replace(/,/g, " ");
				warn(warnUser, reason);
			break;

			/*Smart slowmode - An alternative to slowmode en masse
			If the chat has a certain number of messages in an alloted time frame, turn on slowmode to prevent it from getting hectic
			Moderator customizable*/
			case "slowmode":
				if (messageArray.length == 2) //Checks for args
				{
					message.channel.send("smh give me a command");
					return;
				}

				if (!message.member.hasPermission(`BAN_MEMBERS`)) //Only staff can turn on slowmode, because slowmode sucks
				{
					message.channel.send("You don't have perms to unleash the nuclear weapon");
					return;
				}

				//Starts the smart slowmode
				if (messageArray[2] == "start") 
				{
					switch(messageArray.length)
					//Checks for the length of all the stuff. 
					//length of the messageArray corresponds to whether an argument is placed for the cmd parameters
					{
						case 3:
							message.channel.send("smh set a timer interval"); //Missing a timer for the bot to check
							return;
						case 4:
							message.channel.send("smh set a message limit"); //Missing number of messages 
							return;
						default:
							break;
					}

					//Makes sure we don't have any buggy code that can be exploited by weird arguments, 
					//and makes sure mods aren't too abusive with slowmode
					if (isNaN(messageArray[3]))
					{
						message.channel.send("Bruh you need a valid number for your timer interval");
						return;
					}
					if (messageArray[3] < 10)
					{
						message.channel.send("The time limit is too short buddy, try more than 10s");
						return;
					}
					if (isNaN(messageArray[4]) || (messageArray[4] < 5))
					{
						message.channel.send("Enter a valid message number more than 5")
						return;
					}

					//Prevents retriggering of slowmode while it is on
					if (currentChannel.inSlowmode)
					{
						message.channel.send("Buddy slowmode detection is already on");
					}
					else //If all the parameters and arguments are all clear, start the slowmode
					{
						currentChannel.inSlowmode = true; //Stores that slowmode is on backend
						currentChannel.maxNum = messageArray[4]; //Stores the customizations in the backend
						slowmodeReset = setInterval(function () {
							if (currentChannel.slowmoding)
							{
								if (currentChannel.messageCount < currentChannel.maxNum)
								{
									currentChannel.decentMessageCount++;

									if (currentChannel.decentMessageCount == 5) //After 5 good streaks, clear the slowmode
									{
										bot.channels.get(currentChannel.id).setRateLimitPerUser(0); //Clears slowmode
										currentChannel.slowmoding = false;
										currentChannel.decentMessageCount = 0;
										bot.channels.get(currentChannel.id).send("Slowmode off!");
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
								bot.channels.get(currentChannel.id).setRateLimitPerUser(5);
								bot.channels.get(currentChannel.id).send("Aight because you kiddos can't stop yapping, slowmode is on");
								currentChannel.slowmoding = true;
							}

							currentChannel.messageCount = 0;

						}, (messageArray[3]*1000));

						//Message array 3 is the time in seconds, message array 4 is the number of messages before slowmode
					
						//Logs the interval id so we can clear it
						currentChannel.slowmodeId = slowmodeReset;

						//Alerts the user slowmode has started
						message.channel.send("Slowmode detection on!");
					}
					return;
				}

				if (messageArray[2] == "stop") //Stops the clowmode in the channel
				{
					if (currentChannel.inSlowmode) //If slowmode is on, do the command - or else bot will return a bunch of errors
					{
						//Resets the interval and all the channel stats
						clearInterval(currentChannel.slowmodeId); //Uses the stored backend intervalID to clear the slowmode
						message.channel.setRateLimitPerUser(0);
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
					return;
				}

				//This gets executed if it's neither start or stop; kinda like staten Island
				message.channel.send("Buddy your command doesn't exist");
			break;
		}
	}
})