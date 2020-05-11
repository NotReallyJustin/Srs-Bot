const Discord = require("discord.js");
const prefix = "srs";
const weather = require("weather-js");

const bot = new Discord.Client();
// Big thanks to Steven and Iscii for being gods and making sure I don't brainlet the code :P

bot.login(process.env.BOT_TOKEN);

bot.on("ready", () => {
	console.log("I'm clearly confused");

	bot.generateInvite(["ADMINISTRATOR"]).then(link => {
		console.log(link);
	}).catch(err => {
		console.log(err.stack);
	});
});

//definition section//
function textMessage(text, message) {
	return message.channel.send(text);
};

function Roll(outcomes) {
	return Math.floor(Math.random() * outcomes);
};

function randomResp(list, message) {
	if (typeof(list) !== "object") {
		console.log("smh give me a list you dummy"); //Idea from Wuzics//
	} else {
		var length = list.length
		let rolly = Roll(length);
		textMessage(list[rolly], message);
	};
};

/*function Substring(array, infosys) {
	if (typeof(array) !== "object") {return
	} else {let DontExposeMeh = array.map(something => something.toLowerCase()); //Plugs everything in array into function(something) and runs it
	return DontExposeMeh.includes(infosys);
	};
}; */

function regEx(searchQuery, searchObject) {
	return searchQuery.test(searchObject);
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
		"Always pretend that the user is Justin and will brainlet anddo something very justin moment... wait, is that talking about you?",
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
		"The power of tier III technologies stop you from exploiting srs rate"
	]; //Now that I think of it, if Cat tries to infiltrate this code, the new variable names would give it all away
	randomResp(response, message);
	if (plyerTheKnight) {
		textMessage("Light theme best theme", message);
	}else {
		textMessage("I give dark mode 0/10", message);
	}
}

bot.on("message", async message => { //Enter portion of text code//
	//emotes owo
	//const illegal = message.guild.emojis.find(emoji => emoji.name == "illegal"); //iscii code
	if (message.author.bot) return;
	// Enter easter egg portion//
	if (message.content.toUpperCase() === "MY TRIG GRADE IS RUINED!") textMessage("Smh be quiet and study\
	 for your 1580", message);
	if (message.content.toUpperCase() === "I HAVE NOTHING TO DO") textMessage("Smh then post on instagram\nStop eating egg pudding or you'll be fat\
		\nSmh stop being lazy and update me", message);
	if (message.content.toUpperCase() === "EW LIGHT MODE") {
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
			"Go commit the NRG command"];
		randomResp(lightMode, message);
	};
	if (message.content.toLowerCase() === "light theme best theme") textMessage("Correct!", message);
	if (message.content.toLowerCase() === "why are you using light mode") textMessage("Smh so he can actually see", message);

//entering srs prefix code section
	messageArray = message.content.split(" ");
	command = messageArray[0];
	args = messageArray.slice(1); 
	// Slices message by word!

	function beforeArgs(suffix, txt) {
		if(args[0] === suffix) textMessage(txt, message)
	};

	function cmdDetect(suffix) {
		return(args[0].toLowerCase() == suffix); 
		//Dev note: message defines the thing as in the certain channel, content just listens to the words
		};
		
	if (command !== prefix) {return;
	//if the thing isn't srs, the command would report invalid
	} else 
		// This is where Srs says stuff but
		if (cmdDetect("invite")) {
			let americanAirlines = [
				"smh didn't buy your broke college student a plane ticket",
				"smh I'm not going to your meetups",
				"smh you don't even have my invite code",
				"invite me when Justin runs me in the cloud",
				"I'm too busy enjoying the fancy sublime text colors",
				"What!? Did Justin opensource my token again?",
				"hol up did Justin pull a Github.opensource.IPaddress?"
			];
			randomResp(americanAirlines, message);
		};
		if (cmdDetect("cat")) {
			let ActuallyKnowsHowToCode = [
				"yes 1520 gang",
				"isn't that the kid that helped get me on full time?",
				"Oh the APCPS major kid",
				"SHHHH I'm buying milk for the cat"];
			randomResp(ActuallyKnowsHowToCode, message);
		}
		beforeArgs("rob", "Here take my college debt");
		beforeArgs("help", "Help me help you smh");
		beforeArgs("joke", "Smh you're a joke");
		beforeArgs("sleep", "Smh how can you tell me to sleep when you are on DDP until 2AM");
		beforeArgs("hi", "Smh pay more respects to your elder");
		beforeArgs("hire", "Ew no I don't want to work your shitty job");
		beforeArgs("ping", "I'm not a ping pong ball smh");
		beforeArgs("profile", "Smh I'll change back my profile when you get Srs back");
		beforeArgs("feed", "Smh I'm not eating on my keeb");
		beforeArgs("description", "Your broke college student, on a mission to save the world from shitty moderation bots and the axis of darkness");
		beforeArgs("help", "Smh does I look like work in customer support");
		beforeArgs("updatelist", "Justin is finishing up web dev!");
		beforeArgs("commands", "https://github.com/ComradeDiamond/Srs-Bot/wiki");
		if (cmdDetect("philip")) {
			let chad = [
				"THIS IN UNFAIR!",
				"Oh come on! Where is the manager?",
				"Wait, is this even Srs bot anymore?",
				"Let's just get this done, aight?",
				"LETS DO THIS",
				"That's it. We're screwed ._."
			];
			randomResp(chad, message);
		};
	//Srs Weather
	if (cmdDetect("weather")) { //Dev Note: Fetch, thenResponse, thenResult
		weather.find({search: 'New York, NY', degreeType: 'F'}, function(err, result) {
 	if(err) console.log("You made an oof you brainlet");
  	let Fakenyc = (JSON.stringify(result, null, 0)); 
  	let nyc = JSON.parse(Fakenyc);
  		let fusion = nyc[0].forecast[1].low
  		let vaporization = nyc[0].forecast[1].high
  		let DihydrogenMonoxide = nyc[0].forecast[1].precip
  		message.channel.send("wtf it's " + fusion + " lowest and " + vaporization + " high and " + DihydrogenMonoxide + "% chance to get wet");
  		function weatherRec(temp1, temp2, txt, message) {
			if (fusion > temp1 & fusion < temp2) {
				textMessage(txt, message);
			};
		};
		weatherRec(-50, 0, "where is climate change when you need it?", message);
		weatherRec(-1, 20, "scarves ONLY", message);
		weatherRec(19, 40, "smh wear that thick navy blue thing", message);
		weatherRec(39, 50, "short sleeve and think jacket time", message);
		weatherRec(49, 60, "wtf it's actually T-shirt time?", message);
		weatherRec(59, 75, "quick do what JoKang is doing", message);
		weatherRec(74, 85, "smh go buy a hat or smth", message);
		weatherRec(84, 100, "You want to go out? Don't", message);
		weatherRec(99, 1000, "wtf move to Canada", message);
		});
	};
	if (cmdDetect("advice")) {
		if (messageArray.length == "2") {textMessage("smh what am I supposed to give you advice on?"); 
		} else if (regEx(/[^\w\d, .;!:?]/ig, args)) {
			shame(true, message);
			return;
		} else if ((regEx(/light/ig, args)) || regEx(/dark/ig, args)) {
			let feelNoEvil = [
			"smh Light theme best theme",
			"Rule #1, is that you gotta have fun. And heathen when you're done, dark mode's gotta be the first to run",
			"reference error: Srs.Betray(Justin) does not exist",
			"Internal error: You should know light mode > dark mode",
			"smh Light Mode good"
			];
			randomResp(feelNoEvil, message);
		} else if (regEx(/amoled/ig, args)) {
			"Yes don't be those dark mode brainlets and use amoled in the dark"
		} else {let eightWheel = [
			"smh try again I'm tired",
			"yes",
			"hell no",
			"probably",
			"i think yea",
			"i think no"
			];
			randomResp(eightWheel, message);
		};
	};
	if (cmdDetect("rate")) {
		if (messageArray.length == "2") {textMessage("smh give me something to rate", message);
		} else if (regEx(/[^\w\d,.; '!:?]/ig, args)) {
			shame(true, message); //Maybe I'll come up with smth creative
			return;
		} else if (regEx(/light|amoled/ig, args)) {
			if ((!regEx(/\bdiscord\b|\bdiscord's\b|\byoutube\b|\bchrome\b/ig, args)) && messageArray.length > 4) {
				shame(true, message);
				return;
			}
			if (messageArray.length > 5) {
				shame(true, message);
				return;
			}
			textMessage("I give 10/10", message);
		} else if (regEx(/dark/ig, args)) {
			if ((!regEx(/\bdiscord\b|\bdiscord's\b|\byoutube\b|\bchrome\b/ig, args)) && messageArray.length > 4) {
				shame(false, message);
				return;
			}
			if (messageArray.length > 5) {
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
				"less than the chances of Justin going to Finance Major next y... oh wait"
			];
			randomResp(darkMode, message)
		} else {
			var dankMemez = Roll(11);
			message.channel.send("I give " + dankMemez + "/10");
		};
	};
	if (cmdDetect('dm')) {
		if (isNaN(args[1])) {
			textMessage("Give me a user ID smh, I need to DM them secretly", message);
		}
		else if (messageArray.length == 3) {
			textMessage("smh what am I supposed to say", message);
		}
		else
		{
			let userId = args[1].toString();
			let newArgs = messageArray.slice(3);
			newArgs = newArgs.toString();
			newArgs = newArgs.replace(/,/g, " ");

			if (message.author.id != '269971449328959488' || message.author.id == '348208769941110784') {
				newArgs = newArgs + ` (frum ${message.author.username})` 
			}else if (message.author.id == '0'){
				bot.channels.get("701858995299942482").send(`Inva;id User has sent "${newArgs}" to ${bot.users.get(userId).username}!`);
			}else {
				let randomList = [
					"Egg Pudding",
					"Valdictorian", //Justin exclusive nicknames
					"Seal Team 6",
					"United States Navy Seals",
					"PlyerTheDefender",
					"Srs Bot Owner"
				];
				newArgs += `(${randomList[Roll(6)]})`
			}

			message.guild.fetchMember(userId).then((user) => { //user=> is function(user)
				user.send(newArgs);
			}); //Need smth like if UserId does not exist on guild
			textMessage("If all goes well, message is sent!", message);
		}
	};
	//Moderation
	function ban(ID, reason) { //If the executor has ban perms and the offender doesn't, ban the user and send them a DM.
		message.guild.fetchMember(ID).then((user) => {
			if (message.member.hasPermission(`BAN_MEMBERS`) && !user.hasPermission(`BAN_MEMBERS`)) { //If user has ban perms
				user.send("You have been banned! Ban reason: " + reason);
				user.ban({reason: reason}); //Capped reason to prevent confusion with built in reason
				textMessage("Done! Now gimme a cookie", message);
			}else {
				textMessage("You don't have ban permissions lol", message);
			}
		})
	}
	function mute(ID, time, reason) { //not executing mute b/c IDK which server has mute perms
		message.guild.fetchMember(ID).then((user) => {
			if (message.member.hasPermission(`BAN_MEMBERS`)) {

				user.Permissions.remove(`SEND_MESSAGES`);

				let muteMessage = new Discord.RichEmbed();
				warnMessage.setAuthor("Srs Bot", "https://i.imgur.com/Bnn7jox.png");
				warnMessage.setColor('CYAN');
				warnMessage.setTitle("Muted Message");
				warnMessage.setDescription(`You have been muted by ${message.author.username}! Mute reason:\n${reason}`);
				user.send(warnMessage);

				textMessage("Just like DistrictPvP Days - Muted!", message);
			} else {
				textMessage("You don't have perms bruv", message);
			}
		})
	}
	function warn(ID, reason) {
		message.guild.fetchMember(ID).then((user) => {
			if (message.member.hasPermission(`BAN_MEMBERS`)) {

				let warnMessage = new Discord.RichEmbed();
				warnMessage.setAuthor("Srs Bot", "https://i.imgur.com/Bnn7jox.png");
				warnMessage.setColor('GOLD');
				warnMessage.setTitle("Warn Message");
				warnMessage.setDescription(`You have been warned by ${message.author.username}! Warn reason:\n${reason}`);
				
				user.send(warnMessage);
				textMessage("If your ID exists, it's done!", message);
			} else {
				textMessage("You don't have perms bruv", message);
			}
		})
	}
	if (cmdDetect("ban")) {
		if (messageArray.length == "2") {
			textMessage("Give me someone to ban", message);
			return;
		} else if (messageArray.length == "3") {
			textMessage("Give me a ban reason smh", message);
			return;
		} 
		let banUser = args[1].toString();
		let reason = messageArray.slice(3);
		reason = reason.toString(); //Could use come concats here, but to string is easier to understand
		reason = reason.replace(/,/g, " ");
		ban(banUser, reason);
	}
	if (cmdDetect("warn")) {
		if (messageArray.length == 2) {
			textMessage("Give me someone to warn smh", message);
			return;
		} else if (messageArray.length == 3) {
			textMessage("give me a warn reason smh", message);
			return;
		}
		let warnUser = args[1];
		let reason = messageArray.slice(3);
		reason = reason.toString();
		reason = reason.replace(/,/g, " ");
		warn(warnUser, reason);
	}
});