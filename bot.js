//---------------------INIT----------------------------------------
//Backend
const Discord = require("discord.js");
const bot = new Discord.Client();
const pure = require("./pure.js"); //Wanted to do javaderp here lmao but it's too long
const prefix = "srs";

//Cloud
const Mango = new require("mongodb").MongoClient;
const mango = new Mango(process.env.MANGO_CONNECTION);
let connectionPromise = mango.connect()
connectionPromise.then(() => {
	console.log("Let that mango, we connected to someone else's computer");
	mangoDatabase = mango.db("BotData");
})
connectionPromise.catch(err => {
	console.log(err.stack);
});

//--------------------------SLOWMODE TOOLKIT----------------------------------------
//Not exporting to database because mango database would literally get 10,000 reads a minute otherwise lmao
//Treat this thing as a database, not as a 

function Server(serverId) 
{
	this.channelArray = []; //Starts hash table for these too because I'm lazy
	this.id = serverId;
}

function Channel(channelId) 
{
	this.slowmodeId = -1; //Slowmode id keeps track of the timer number to clear
	this.inSlowmode = false;
	this.maxNum = -1;
	this.id = channelId;
	this.messageCount = 0;
	this.slowmoding = false; //Slowmoding tells if the channel is act on slowmode
	this.decentMessageCount = 0;
}

/* Array to keep track of all the servers; can't make a hash table because Array(1E18) doesn't work */
//The most unpure thing here >:(
serverArray = [];

//---------------------BOT LOGIN & CMDS---------------------
bot.login(process.env.BOT_TOKEN);

bot.on("ready", () => {
	console.log("I'm clearly confused");

	bot.generateInvite(["ADMINISTRATOR"]).then(link => {
		console.log(link);
	}).catch(err => {
		console.log(err.stack);
	})
})

bot.on('message', async message => {

	//----------------------------------msg init-------------------------------------------
	/*Three parts to this section
	If the author is a bot, do nothing
	If the author is tech bot, shame it
	If the author is not a bot, jot down the slowmode messages*/

	if ((message.author.bot) && (message.author.id != "542408239946661898"))
	{
		return;
	}
	if (message.author.id == "542408239946661898")
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
			"smh go back to debug mode",
			"https://comradediamond.github.io/Happy-Halloween/",
			"Smh go back to debug mode >:("
		];
		message.channel.send(pure.randomResp(techBotList));
		return;
	}

	//---------------------------SLOWMODE ITEMS-----------------------------------------------

	//Adds the server and channel to the array so we can keep track of it later if it does not already exist
	let serverSearchIdx = pure.arrayIndexSearch(serverArray, (item) => item.id == message.guild.id);

	if (serverSearchIdx == -1) //LMAO discount pure function - basically a funnier version of discount cheems
	{
		serverArray = [...serverArray, new Server(message.guild.id)];

		//Reinit serverSearchIdx --> the new satisfactory query will be at the end of array
		serverSearchIdx = serverArray.length - 1;
	}

	let channelSearchIdx = pure.arrayIndexSearch(serverArray[serverSearchIdx].channelArray, (channel) => channel.id == message.channel.id);

	if (channelSearchIdx == -1)
	{
		//Literally this is so discount cheems LMAO - This is why pure functions are a pain kids
		serverArray[serverSearchIdx].channelArray = [...serverArray[serverSearchIdx].channelArray, new Channel(message.channel.id)];

		//Reinit again
		channelSearchIdx = serverArray[serverSearchIdx].channelArray.length - 1;
	}

	//Registers number of messages for the slowmode. If the author is not a bot, regiser it.
	//If it is not in slowmode detection mode, do not register the messages
	let currentChannel = serverArray[serverSearchIdx].channelArray[channelSearchIdx];

	if ((!message.author.bot) && (currentChannel.inSlowmode))
	{
		currentChannel.messageCount += 1;
	}

	//-----------------------SRS EASTER EGG SECTION------------------------------------

	//Cat - If it contains Btech, smh it
	if (/bths|btech|brooklyn tech/gmi.test(message.content))
	{
		message.channel.send("Smh BTHS");
		return;
	}

	if (/Math/gmi.test(message.content))
	{
		message.channel.send(pure.fuckMath());
		return;
	}

	//Maybe we could DRY idk - experiment with changing arrays first
	!pure.uppercaseMatch(message, "my grade is") || message.channel.send("smh be quiet and study for you 1520");
	!pure.uppercaseMatch(message, "miku") || message.channel.send("congrats you earned a one way ticket to #wastebin");
	!pure.uppercaseMatch(message, "seal hunting") || message.channel.send("You better run before I put you in char siu fan");
	!pure.uppercaseMatch(message, "light theme best theme") || message.channel.send("Correct!");

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
		`You just earned a one way ticket to the Hall of Shame`,
		"I suggest you use your right to remain silent",
		"Ding Dong your brainlet opinion is wrong",
		"smh how can you be more wrong than people who try to meme on Justin's variables",
		"Go turn yourself into a JavaDerp function",
		"Go commit the NRG command"
	];
	!pure.uppercaseMatch(message, "ew light") || message.channel.send(pure.randomResp(lightMode));

	let apSex = [
		"congrats you earned yourself a one way ticket to the hall of shame",
		"🤮",
		"oh mercy me",
		"for the love of democracy, get that thing in the hall of shame",
		"wym you failed at that subject the last time you tried it in the 7th floor staircase",
		"When we say people like vanilla, we don't mean this stuff 🤮"
	];
	!pure.uppercaseMatch(message, "ap sex") || message.channel.send(pure.randomResp(apSex));

	let elCafe = [
		"OOP 🤮",
		"delete dis right now",
		"Tfw the first version of my bot has better code than college board",
		"Tfw Yandere Dev has more understandable code than college board",
		"System.out.print(\"Say Sike Right Now\");",
		"go import java.commonSense smh head",
		"smh go kermit use jgrasp",
		"that's it you're going in the hall of shame"
	];
	!pure.uppercaseMatch(message, "java") || message.channel.send(pure.randomResp(elCafe));


	//---------------------------ACTUAL SRS COMMANDS => To Do: Make node.js command handlers---------------------------

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
				"WHAT!? Did Justin opensource my token again?",
				"hol up did Justin pull a Github.opensource.IPAddress",
				"can't make it sorry, im at a frat party"
				];
				message.channel.send(pure.randomResp(americanAirlines));
			break;

			case "cat":
				let smh = [
				"yes 1520 gang",
				"isn't that the kid that helped get me on full time?",
				"oh the APCPS major kid",
				"SHHHH I'm buying milk for the cat",
				"so this is what happens when you remove Web Dev"
				];
				message.channel.send(pure.randomResp(smh));
			break;

			case "rob":
				message.channel.send("Here take my college debt");
			break;

			case "help":
				let helpResp = [
					"Help me help you smh",
					"Smh does it look like I work in customer support"
				];
				message.channel.send(pure.randomResp(helpResp));
			break;

			case "joke":
				message.channel.send("Smh you're a joke");
			break;

			case "sleep":
				let sleepResp = [
					"Smh how can you tell me to sleep when you're up at horny hour",
					"Smh stop staying up until 3AM and actually hit the bed",
					"i don't need sleep, I need answers"
				]
				message.channel.send(pure.randomResp(sleepResp));
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
				message.channel.send("Stan Aster. Hate on mobile devices.");
			break;

			case "commands":
				message.channel.send("https://github.com/ComradeDiamond/Srs-Bot/wiki");
			break;

			case "website":
				message.channel.send("https://comradediamond.github.io/Happy-Halloween/");
			break;

			case "philip": 
				let chad = [
					"THIS IS UNFAIR!",
					"Wait, is this even Srs bot anymore?",
					"Let's just get this done, aight?",
					"LETS DO THIS",
					"That's it. We're screwed ._.",
					"Aight buddy you need to have some coffee"
				];
				message.channel.send(pure.randomResp(chad));
			break;

			case "christmas": //Finds out how many days it is until Christmas
				let merryChristmas = new Date(2020, 11, 25);

				message.channel.send(`${pure.dateDistance(new Date(), merryChristmas)} days until Christmas!`);
				message.channel.send("when the time comes, we'll make this place more festive 😃");
			break;

			//Srs weather - returns the weather
			case "weather":
				pure.weatherFind()
					.then(result => {
						//NYC returns the entire JSON from weatherAPI, lows and highs, and the precip chance
						let nycJSON = pure.parseWeather(result);

						if ((args[1] != undefined) && (args[1] == "advanced"))
						{
							let weatherMessage = pure.createWeatherEmbed(nycJSON);
							message.channel.send(weatherMessage);
						}
						else
						{
							message.channel.send(`wtf it's ${nycJSON.low} lowest and ${nycJSON.high} highest with ${nycJSON.precipChance}% chance to get wet`);
						}

						message.channel.send(pure.weatherRec(nycJSON.high));
					})
					.catch(err => {
						message.channel.send("hmm there's an error - better check those console logs");
						console.log(err);
					});
			break;

			case "coinflip":
				if ((Math.random() *2) < 1)
				{
					message.channel.send("Heads");
				}
				else
				{
					message.channel.send("Tails");
				}
			break;

			//srs answers your burning questions about life
			case "advice":
				let status = pure.rateStatus(messageArray, args);

				switch (status)
				{
					case 200:
						let eightWheel = [
							"smh try again I'm tired",
							"yes",
							"hell no",
							"probably",
							"i think yea",
							"i think no"
						];
						message.channel.send(pure.randomResp(eightWheel));
					break;

					case 202:
					case 204:
						let seeNoEvil = [
							"smh Light theme best theme",
							"I swear I will launch the Spanish Inquisition against dark mode",
							"reference error: Srs.Betray(Justin) does not exist",
							"Internal error: You should know light mode > dark mode",
							"smh Light Mode good"
						];
						message.channel.send(pure.randomResp(seeNoEvil));
					break;

					case 203:
						message.channel.send("Yes don't be those dark mode brainlets and use amoled");
					break;

					case 404:
						message.channel.send("smh what am I supposed to give you advice on?"); 
					break;

					case 400:
						message.channel.send(pure.shame());
					break;

					default:
						message.channel.send("Uh... you should probably ping Justin. Send him this number: " + status);
					break;
				}
			break;

			case "rate":
				let rateStatus = pure.rateStatus(messageArray, args);

				switch (rateStatus)
				{
					case 200:
					case 203:
						var dankMemes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
						message.channel.send(`I give ${pure.randomResp(dankMemes)}/10`);
					break;

					case 202:
						message.channel.send("I give 10/10");
					break;

					case 204:
						let darkMode = [
							"message.channel.send(Double.MIN_VALUE);",
							"-50000 / 10",
							"what are the chances of infecting greenland? Yea, that number",
							"smh take whatever number you're thinking of, take the absolute value, then multiply it by -1",
							"less than the chances of Justin joining LAS... oh wait",
							"less than the chances of Justin going to Finance Major next y... oh wait",
							"less than the chances of Justin reinstalling Clean Master",
						];
						randomResp(darkMode, message)
					break;

					case 400:
						message.channel.send(pure.shame());
					break;

					case 404:
						message.channel.send("smh what am I supposed to rate?");
					break;

					default:
						message.channel.send("Uh... you should probably ping Justin. Send him this number: " + status);
					break;
				}			
			break;

			case "dm":
				let dmstatus = pure.dmStatus(messageArray, args);

				switch (dmstatus)
				{
					case 200:
						//Bday callback triggers only when bday kid sends a message for dm acc. purposes
						let bdayCallback = (newArgs, bot, userId) => {
						bot.channels.get("701858995299942482").send(`Invalid User has sent "${newArgs}" to ${bot.users.get(userId).username}!`);
						}

						let sendTxt = pure.dmCompile(message, messageArray, bdayCallback, bot);

						message.guild.members.fetch(args[1]).then((user) => { //Sends the message!
							user.send(sendTxt);
							message.channel.send("If all goes well, message is sent!");
						}); 
					break;

					case 404:
						message.channel.send("smh what am I supposed to say");
					break;

					case 800:
						message.channel.send("Give me a user ID smh");
					break;

					default:
						message.channel.send("Woah what happened here?");
					break;
				}
			break;

			case "mention": //Srs mentions certain people if conditions are met
				if (messageArray.length == 2) //Checks for extra mandatory args
				{
					message.channel.send("What am I pinging?");
					return;
				}
				message.channel.send(pure.returnMention(messageArray[2], message.author));
			break;

			case "uwu": //Turns something into uwu
				if (messageArray.length < 3)
				{
					message.channel.send("uwu I thwink you need to add sum text");
				}
				else
				{
					let uwuMsg = pure.uwu(message.content);
					message.channel.send(uwuMsg);
				}
			break;

			//*SRS MODERATION*//

			case "ban":
				let user = await message.guild.members.fetch(args[1]);
				let banStatus = pure.banStatus(messageArray, message.member, user);

				switch (banStatus) //to do: ban model && which server you're banned from
				{
					case 200:
						let reason = pure.returnUnbound(message.content, args[1]);
						user.send("You have been banned! Ban reason: " + reason);
						user.ban({reason: reason});

						message.channel.send("Done! Now gimmee a cookie!");
					break;

					case 404.1:
						message.channel.send("Give me someone to ban smh");
					break;

					case 404.2:
						message.channel.send("Give me a ban reason smh");
					break;

					case 404.3:
						message.channel.send("smh that person doesn't exist");
					break;

					case 888.1:
						message.channel.send("woah woah woah you can't just ban a moderator");
					break;

					case 888.2:
						message.channel.send("You don't have perms lmao");
					break;
				}
				
			break;

			case "warn":
				let warnStatus = pure.warnStatus(messageArray, message.member);

				switch (warnStatus)
				{
					case 200:
						message.guild.members.fetch(args[1])
							.then(user => {
								let reason = pure.returnUnbound(message.content, args[1]);
								user.send(pure.warnMsg(message.author, reason));

								message.channel.send("If all goes well, it's sent!");
							})
							.catch(() => {
								message.channel.send("hmm it looks like the user you're trying to warn doesn't exist");
							})
					break;

					case 404.1:
						message.channel.send("Give me someone to warn smh");
					break;

					case 404.2:
						message.channel.send("give me a warn reason smh");
					break;

					case 888:
						message.channel.send("Bruh you have no perms");
					break;
				}

				var warnUser = args[1].toString();

				var reason = messageArray.slice(3);
				warn(warnUser, reason);
			break;

			/*Smart slowmode - An alternative to slowmode en masse
			If the chat has a certain number of messages in an alloted time frame, turn on slowmode to prevent it from getting hectic
			Moderator customizable*/
			case "slowmode":
				let slowStatus = pure.slowmodeStatus(messageArray, message.member);

				//There's a ton of status code but don't worry lmao
				//If it's not 200 then someone made a Justin moment
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
							currentChannel.maxNum = messageArray[4];

							//Slowmode reset timer - this checks for slowmode message interval and determines if slowmode needs to be added

							slowmodeReset = setInterval(() => {

								if (currentChannel.slowmoding)
								{
									if (currentChannel.messageCount < currentChannel.maxNum)
									{
										currentChannel.decentMessageCount++;

										if (currentChannel.decentMessageCount == 5) //After 5 good streaks, clear the slowmode
										{
											bot.channels.cache.get(currentChannel.id).setRateLimitPerUser(0); //Clears slowmode
											currentChannel.slowmoding = false;
											currentChannel.decentMessageCount = 0;
											bot.channels.cache.get(currentChannel.id).send("Slowmode off!");
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
									bot.channels.cache.get(currentChannel.id).setRateLimitPerUser(5);
									bot.channels.cache.get(currentChannel.id).send("Aight because you kiddos can't stop yapping, slowmode is on");
									currentChannel.slowmoding = true;
								}

								currentChannel.messageCount = 0;

							}, (messageArray[3]*1000));
					
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

						message.channel.send(pure.randomResp(smh));
					break;

					default:
						message.channel.send("woah what happened here");
					break;
				}
			break;

			//Srs Utility
			case "translate":

				//Keyword array basically is just a collection of shortcuts because I'm lazy
				const keywordArray = [
					{"keyword" : "english", "kw1" : "auto", "kw2" : "en"},
					{"keyword" : "spanglish", "kw1" : "en", "kw2" : "es"}
				];

				let transStatus = pure.translateStatus(messageArray, keywordArray);
				let updatedThingy;

				switch (transStatus)
				{
					case 200:
						updatedThingy = pure.translateUpdated(args, message.content, []);

						pure.translate(updatedThingy)
							.then(response => {
								message.channel.send(pure.translateEmbed(response));
							})
							.catch(err => {
								console.log(err);
								message.channel.send("hmm something went wrong... maybe ping a dwerpy seal about it .-.");
							});
					break;

					case 300:
						const langArray = [
							{"lang" : "Spanish", "shortcut" : "es"},
							{"lang" : "German", "shortcut" : "de"},
							{"lang" : "French", "shortcut" : "fr"},
							{"lang" : "Portugese", "shortcut" : "pt"},
							{"lang" : "Italian", "shortcut" : "it"},
							{"lang" : "Dutch", "shortcut" : "nl"},
							{"lang" : "Polish", "shortcut" : "pl"},
							{"lang" : "Russian", "shortcut" : "ru"},
							{"lang" : "Japanese", "shortcut" : "ja"},
							{"lang" : "Chinese", "shortcut" : "zh"},
							{"lang" : "Swedish", "shortcut" : "sv"},
							{"lang" : "Latin", "shortcut" : "la"},
							{"lang" : "Greek", "shortcut" : "el"},
							{"lang" : "Korean", "shortcut" : "ko"},
							{"lang" : "English", "shortcut" : "en"}
						];

						message.channel.send(pure.translateHelpEmbed(langArray));
					break;

					case 400.1:
						message.channel.send("smh specify the language for the 1st input language");
						message.channel.send("use `srs help` for a full guide, or check `srs commands` for syntax");
					break;

					case 400.2:
						message.channel.send("smh specify the language for the 2nd input language");
						message.channel.send("use `srs help` for a full guide, or check `srs commands` for syntax");
					break;

					case 400.3:
						message.channel.send("smh what am I translating?");
					break;

					case 404.1:
						message.channel.send("Looks like your 1st input language does not exist or isn't supported yet, or you just oofed up");
					break;

					case 404.2:
						message.channel.send("Looks like your 2nd input language does not exist or isn't supported yet, or you just oofed up");
					break;

					//Hey, sometimes your eyes lie to you and js does not behave like js
					//This default is controlled. The only way you get here is if keywordArray gets returned as a staus
					default:
						updatedThingy = pure.translateUpdated(args, message.content, transStatus[0]);

						pure.translate(updatedThingy)
							.then(response => {
								message.channel.send(pure.translateEmbed(response));
							})
							.catch(err => {
								console.log(err);
								message.channel.send("hmm something went wrong... maybe ping a dwerpy seal about it .-.");
							});
					break;
				}

			break;

			case "tasks": //Srs Task Reminder
				let collection = mangoDatabase.collection("Tasks");
				let userId = message.author.id;

				//If database entry does not exist, make a JSON entry
				var matchNum = await collection.countDocuments({"id": userId});
				if (matchNum == 0)
				{
					await collection.insertOne({
						id: userId,
						tasks: []
					})
				}

				let userCollection = await collection.findOne({"id": userId});

				switch(args[1]) //Arguments
				{
					case "view":
					case undefined: //Display tasks in embed
						message.channel.send(pure.taskEmbed(userCollection.tasks));
					break;

					case "add": //Create new task and add it to db
						let nTask = pure.returnUnbound(message.content, "add");
						await collection.updateOne({"id": userId}, {$push: {"tasks": nTask}});

						const addResp = [
							"Updated!",
							"Ur tasks has been jotted down in my nonexistent tech planner",
							"Tech bot is now working on remembering this thing",
							"the task has been assigned to a mango",
							"io ho finito"
						]

						message.channel.send(pure.randomResp(addResp));
					break;

					case "delete": //Deletes items at a certain index
						let num = parseInt(args[2]) - 1;
						let status = pure.taskDeleteStatus(args, userCollection.tasks.length, num);

						switch (status)
						{
							case 200:
								//Array slice basically is substring
								let newArr = [...userCollection.tasks.slice(0, num), ...userCollection.tasks.slice(num +1)];
								await collection.updateOne({"id": userId}, {$set: {"tasks": newArr}});

									const delResp = [
										"Deleted!",
										"Flushed down the drain!",
										"yor task is now paying for my student debt",
										"Banished to the land of weebery",
										"Task fed to Tech Bot",
										"Threw tasks and tech bot in the garbage can",
										"cheems repeat>Help task deleting scawy",
										"Tasks is longer in your tech planner!"
									];
									message.channel.send(pure.randomResp(delResp));
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
							message.channel.send("i don't think you're seal but if you need to wait that's cool with me");
						}
					break;
				}

			break;
		}
	}
})