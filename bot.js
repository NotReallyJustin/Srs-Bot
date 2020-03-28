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
function Yeet(text, message) {
	return message.channel.send(text);
};

function Roll(outcomes) {
	return Math.floor(Math.random() * outcomes);
};

function Yurr(list, message) {
	if (typeof(list) !== "object") {
		console.log("smh give me a list you dummy"); //Idea from Wuzics//
	} else {
		var length = list.length
		let rolly = Roll(length);
		Yeet(list[rolly], message);
	};
};

function Substring(array, infosys) {
	if (typeof(array) !== "object") {return
	} else {let DontExposeMeh = array.map(something => something.toLowerCase()); //Plugs everything in array into function(something) and runs it
	return DontExposeMeh.includes(infosys);
	};
};

bot.on("message", async message => { //Enter portion of text code//
	//emotes owo
	const illegal = message.guild.emojis.find(emoji => emoji.name === "illegal"); //iscii code
	if (message.author.bot) return;
	if (message.channel.type === "dm") return message.channel.send("Smh I'm not a dm bot");
	// Enter easter egg portion//
	if (message.content.toUpperCase() === "MY TRIG GRADE IS RUINED!") Yeet("Smh be quiet and study\
	 for your 1580", message);
	if (message.content.toUpperCase() === "I HAVE NOTHING TO DO") Yeet("Smh then post on instagram\nStop eating egg pudding or you'll be fat\
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
			`${illegal} ${illegal} ${illegal}`,
			"I suggest you use your right to remain silent",
			"Congratulations! Your message is more hated than Space Jams!",
			"Ding Dong your brainlet opinion is wrong",
			"smh how can you be more wrong than people who try to meme on Justin's variables",
			"Go turn yourself into a JavaDerp function",
			"Go commit the NRG command"];
		Yurr(lightMode, message);
	};
	if (message.content.toLowerCase() === "pls pet play") {
		let petRock = [
			":pandaBan:",
			"*Duck Hunting Noises*",
			"OMG STOP PLAYING WITH THAT ROCK",
			"if you keep playing with that pet you'll give it infection",
			"SOCIAL DISTANCING",
			"SOCIAL DISTANCING WITH THAT THING",
			"pls meme"
		];
		Yurr(petRock, message);
	};
	if (message.content.toLowerCase() === "light theme best theme") Yeet("Correct!", message);
	if (message.content.toLowerCase() === "why are you using light mode") Yeet("Smh so he can actually see", message);
	if (message.content.toLowerCase() === "pls rich") {
		let objection = [
			"i see you",
			"how does it feel to be a thief?",
			"smh highway robbery",
			"smh stop doing criminal",
			`${illegal} ${illegal} ${illegal}`,
			"smh don't rob me",
			"when you get rich, can you pay some of my student debt?",
			"I know you want to rob owO"
		];
		Yurr(objection, message);
	};

//entering srs prefix code section
	let messageArray = message.content.split(" ");
	let command = messageArray[0];
	let args = messageArray.slice(1); 
	// Slices message by word!

	function beforeArgs(suffix, txt) {
		if(args[0] === suffix) Yeet(txt, message)
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
				"Did Justin pull a Github.opensource.IPaddress?"
			];
			Yurr(americanAirlines, message);
		};
		if (cmdDetect("cat")) {
			let ActuallyKnowsHowToCode = [
				"yes 1520 gang",
				"isn't that the kid that helped get me on full time?",
				"Oh the APCPS major kid",
				"SHHHH I'm buying milk for the cat"];
			Yurr(ActuallyKnowsHowToCode, message);
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
		beforeArgs("updatelist", "Justin is currently... oh wait, he doesn't know what to do for update 1.2.0");
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
			Yurr(chad, message);
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
  		function vestirse(temp1, temp2, txt, message) {
			if (fusion > temp1 & fusion < temp2) {
				Yeet(txt, message);
			};
		};
		vestirse(-50, 0, "where is climate change when you need it?", message);
		vestirse(-1, 20, "scarves ONLY", message);
		vestirse(19, 40, "smh wear that thick navy blue thing", message);
		vestirse(39, 50, "short sleeve and think jacket time", message);
		vestirse(49, 60, "wtf it's actually T-shirt time?", message);
		vestirse(59, 75, "quick do what JoKang is doing", message);
		vestirse(74, 85, "smh go buy a hat or smth", message);
		vestirse(84, 100, "You want to go out? Don't", message);
		vestirse(99, 1000, "wtf move to Canada", message);
		});
	};
	if (cmdDetect("advice")) {
		if (messageArray.length == "2") {Yeet("smh what am I supposed to give you advice on?"); 
		} else if ((Substring(args, "light") & Substring(args, "mode")) | (Substring(args, "dark") & Substring(args, "mode"))) {
			let seeNoEvil = [
			"Aight mate you know light mode is good",
			"Smh I'm not meming on light theme",
			"Justin patched the bug! What are you going to do now?",
			"See no evil"
			];
			Yurr(seeNoEvil, message);
		} else if ((Substring(args, "light") & Substring(args, "theme")) | (Substring(args, "dark") & Substring(args, "theme"))) {
			let feelNoEvil = [
			"smh Light theme best theme",
			"Rule #1, is that you gotta have fun. And heathen when you're done, dark mode's gotta be the first to run",
			"reference error: Srs.Betray(Justin) does not exist",
			"Internal error: You should know light mode > dark mode",
			"smh Light Mode good"
			];
			Yurr(feelNoEvil, message);
		} else {let eightWheel = [
			"smh try again I'm tired",
			"yes",
			"hell no",
			"probably",
			"i think yea",
			"i think no"
			];
			Yurr(eightWheel, message);
		};
	};
	if (cmdDetect("rate")) {
		if (messageArray.length == "2") {Yeet("smh give me something to rate", message);
		} else if (Substring(args, "light")) {
			Yeet("I give 10/10", message);
		} else if (Substring(args, "dark")) {
			let darkMode = [
				"Is there a number less than negative infinity?",
				"-50000 / 10",
				"The number would be so negative that it makes Alaska seem like a joke",
				"what are the jokes of infecting greenland? Yea, that number",
				"smh take whatever number you're thinking of, take the absolute value, then multiply it by -1",
				"less than the chances of Justin joining LAS... oh wait",
				"less than the chances of Justin going to Finance Major next y... oh wait"
			];
			Yurr(darkMode, message)
		} else {
			var dankMemez = Roll(11);
			message.channel.send("I give " + dankMemez + "/10");
		};
	};
});