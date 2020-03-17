const botSettings = require("./botsettings.json");
const Discord = require("discord.js");
const prefix = botSettings.prefix;
const fetch = require("node-fetch");
const weather = require("weather-js");

const bot = new Discord.Client();
// Big thanks to Steven and Iscii for being gods and making sure I don't brainlet the code :P

bot.login(botSettings.token);

bot.on("ready", () => {
	console.log("Where did JavaDerp go?");

	bot.generateInvite(["ADMINISTRATOR"]).then(link => {
		console.log(link);
	}).catch(err => {
		console.log(err.stack);
	});
});

function message(text, message) {
	return message.channel.send(text);
};
//defines yeet

function randomGenerate(outcomes) {
	return Math.floor(Math.random() * outcomes);
};

function selectiveMessaging(list, message) {
	if (typeof(list) !== "object") {
		console.log("smh give me a list you dummy"); //Idea from Wuzics//
	} else {
		var length = list.length
		let number = Roll(length);
		message(list[number], message);
	};
};

bot.on("message", async message => { //Enter portion of text code//
	//emotes owo
	const illegal = message.guild.emojis.find(emoji => emoji.name === "illegal"); //iscii code
	if (message.author.bot) return;
	if (message.channel.type === "dm") return message.channel.sendMessage("Smh I'm not a dm bot");
	// Enter easter egg portion//
	if (message.content.toUpperCase() === "MY TRIG GRADE IS RUINED!") message("Smh be quiet and study\
	 for your 1580", message);
	if (message.content.toUpperCase() === "I HAVE NOTHING TO DO") message("Smh then post on instagram\nStop eating egg pudding or you'll be fat\
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
			"Go turn yourself into a Javaderp function",
			"Go commit the NRG command"];
		selectiveMessaging(lightMode, message);
	};
	if (message.content === "Light theme best theme") message("Correct!", message);
	if (message.content.toLowerCase() === "why are you using light mode") message("Smh so he can actually see", message);

//entering srs prefix code section
	let messageArray = message.content.split(" ");
	let command = messageArray[0];
	let args = messageArray.slice(1); 
	// Slices message by word!

	function beforeArgs(suffix, txt) {
		if(args[0] === suffix) message(txt, message)
	};

	function cmdDetect(suffix) {
		return(args[0].toLowerCase() == suffix); 
		//Dev note: message defines the thing as in the certain channel, content just listens to the words
		};
		
	if (!command === prefix) {console.log(message.content);
	//if the thing isn't srs, the command would report invalid
	} else 
		// This is where Srs says stuff but
		if (cmdDetect("invite")) {
			let Response = [
				"smh didn't buy your broke college student a plane ticket",
				"smh I'm not going to your meetups",
				"smh you don't even have my invite code",
				"invite me when Justin runs me in the cloud",
				"I'm too busy enjoying the fancy sublime text colors",
				"What!? Did Justin opensource my token again?",
				"Did Justin pull a Github.opensource.IPAddress?"
			];
			selectiveMessaging(Response, message);
		};
		if (cmdDetect("cat")) {
			let CatResponse = [
				"yes 1520 gang",
				"isn't that the kid that helped get me on full time?",
				"Oh the APCPS major kid",
				"SHHHH I'm buying milk for the cat"];
			selectiveMessaging(CatResponse, message);
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
		if (cmdDetect("Karen")) {
			let Response = [
				"THIS IN UNFAIR!",
				"Oh come on! Where is the manager?",
				"Wait, is this even Srs bot anymore?",
				"Let's just get this done, aight?",
				"LETS DO THIS",
				"That's it. We're screwed ._."
			];
			selectiveMessaging(Response, message);
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
				message(txt, message);
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
});
