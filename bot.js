//Purified Srs Bot for people who can't understand Justin language - oh also, did you know it's called JavaDerp?
const botSettings = require("./botsettings.json");
const Discord = require("discord.js");
const prefix = botSettings.prefix;
const fetch = require("node-fetch");
const weather = require("weather-js");

const bot = new Discord.Client();

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
//This used to be Yeet()

function randomGenerate(outcomes) {
	RNG = Math.floor(Math.random() * outcomes);
	console.log(RNG)
};
//If you knew how to use roll, this long thing didn't have to exist BTW

function randomResponse(RNGValue, text, message) {
	if(RNG == RNGValue) message(text, message);
};

bot.on("message", async message => { //Enter portion of text code//
	//emotes owo
	const illegal = message.guild.emojis.find(emoji => emoji.name === "illegal"); //iscii code
	if(message.author.bot) return;
	if(message.channel.type === "dm") return message.channel.sendMessage("Smh I'm not a dm bot");
	
	if(message.content.toUpperCase() === "MY TRIG GRADE IS RUINED!") message("Smh be quiet and study\
	 for your 1580", message);
	if(message.content.toUpperCase() === "I HAVE NOTHING TO DO") message("Smh then post on instagram\nStop eating egg pudding or you'll be fat\
		\nSmh stop eating on your keeb and make me on 24/7", message);
	if(message.content.toUpperCase() === "EW LIGHT MODE") {
		randomGenerate(16);
		randomResponse("0", "Smh at least he can read in the sun", message);
		randomResponse("1", "no u", message);
		randomResponse("2", "Smh how can you meme on eye strain when you're reading in the dark", message);
		randomResponse("3", "It's let there be light, not let there be heathens", message);
		randomResponse("4", "You dare oppose me with that dark mode", message);
		randomResponse("5", "Smh how are you going to say that and then call Justin the brainlet", message);
		randomResponse("6", "You have yeed your last haw", message);
		randomResponse("7", "There are 10 reasons Europe emerged from the Dark Ages; using AMOLED is not one of them", message);
		randomResponse("8", "Smh I would insult your intelligence, but that would mean you had some to begin with", message);
		randomResponse("9", `${illegal} ${illegal} ${illegal}`, message);
		randomResponse("10", "I suggest you use your right to remain silent", message);
		randomResponse("11", "Congratulations! Your message is more hated than Space Jams!", message);
		randomResponse("12", "Ding Dong your brainlet opinion is wrong", message);
		randomResponse("13", "Are you an alkali Earth Metal? Because you're so salty Daniel would mute you for toxidity", message);
		randomResponse("14", "smh every say we stray further away from God", message);
		randomResponse("15", "How can you be more of a brainlet than people who complain about Justin's variables?");
		randomResponse("16", "smh top complaining about Justin's abstractions and study for your 1520");
	};
	if(message.content === "Light theme best theme") message("Correct!", message);
	if(message.content.toLowerCase() === "why are you using light mode") message("Smh so he can actually see", message);

//Srs Prefix Code... this will be fun
	let messageArray = message.content.split(" ");
	let command = messageArray[0];
	let args = messageArray.slice(1); 
	// Slices message by word!

	function commandPromptedResponse(suffix, txt) {
		if(args[0] === suffix) message(txt, message)
	};

	function commandIs(suffix) {
		return(args[0].toLowerCase() == suffix); 
		//Dev note: message defines the thing as in the certain channel, content just listens to the words
		};
		
	if(!command === prefix) {console.log(message.content);
	//if the thing isn't srs, the command would report invalid
	} else 
		// This is where Srs says stuff but
		if (commandIs("invite")) {
			randomGenerate(4);
			randomResponse("0", "Smh didn't buy your broke college student a plane ticket", message);
			randomResponse("1", "Smh I'm not going to your meetups", message);
			randomResponse("2", "Smh you don't even have my invite code", message); 
			randomResponse("3", "What!? Did Justin opensourced my token again?", message);
		};
		commandPromptedResponse("rob", "Here take my college debt");
		commandPromptedResponse("help", "Help me help you smh");
		commandPromptedResponse("joke", "Smh you're a joke");
		commandPromptedResponse("sleep", "Smh how can you tell me to sleep when you are on DDP until 2AM");
		commandPromptedResponse("hi", "Smh pay more respects to your elder");
		commandPromptedResponse("hire", "Ew no I don't want to work your shitty job");
		commandPromptedResponse("ping", "I'm not a ping pong ball smh");
		commandPromptedResponse("profile", "Smh I'll change back my profile when you get Srs back");
		commandPromptedResponse("feed", "Smh I'm not eating on my keeb");
		commandPromptedResponse("description", "Your broke college student, on a mission to save the world from shitty moderation bots and the axis of darkness");
		commandPromptedResponse("help", "Smh does I look like work in customer support");
		commandPromptedResponse("updatelist", "Working on Update 1.1.0 : Modularity and Cleaning! Damn, are the pull requests finally going to be heard?\n \
			Also, COVID-19 awareness time");
		if (commandIs("karen")) { //Replaced Phil with Karen because Phil is an inside joke that people who don't speak JavaDerp won't get
			randomGenerate (5);
			randomResponse("0", "THIS IS UNFAIR!", message);
			randomResponse("1", "Oh come on! Where is the manager?", message);
			randomResponse("2", "Wait, is this even Srs bot anymore?", message);
			randomResponse("3", "Let's get just this done aight?", message);
			randomResponse("4", "That's it. We're screwed ._.", message);
		};
	//Srs Weather
	if (commandIs("weather")) { //I'm glad Wuzics can't find a way to mess up my thing lol
		weather.find({search: 'New York, NY', degreeType: 'F'}, function(err, result) {
 	if(err) console.log("You made an oof you brainlet");
  let weatherString = (JSON.stringify(result, null, 0)); 
  	let weatherJSON = JSON.parse(weatherString);
  		let fusion = weatherJSON[0].forecast[1].low
  		let vaporization = weatherJSON[0].forecast[1].high
  		let DihydrogenMonoxide = weatherJSON[0].forecast[1].precip
  		message.channel.send("wtf it's " + fusion + " lowest and " + vaporization + " high and " + DihydrogenMonoxide + "% chance to get wet");
  		function tellMeWhatToWearTodayBasedOnTheWeather(temp1, temp2, txt, message) {
			if (fusion > temp1 & fusion < temp2) {
				message(txt, message);
			};
		};
		tellMeWhatToWearTodayBasedOnTheWeather(-50, 0, "where is climate change when you need it?", message);
		tellMeWhatToWearTodayBasedOnTheWeather(-1, 20, "scarves ONLY", message);
		tellMeWhatToWearTodayBasedOnTheWeather(19, 40, "smh wear that thick navy blue thing", message);
		tellMeWhatToWearTodayBasedOnTheWeather(39, 50, "short sleeve and think jacket time", message);
		tellMeWhatToWearTodayBasedOnTheWeather(49, 60, "wtf it's actually T-shirt time?", message);
		tellMeWhatToWearTodayBasedOnTheWeather(59, 75, "quick do what JoKang is doing", message);
		tellMeWhatToWearTodayBasedOnTheWeather(74, 85, "smh go buy a hat or smth", message);
		tellMeWhatToWearTodayBasedOnTheWeather(84, 100, "You want to go out? Don't", message);
		tellMeWhatToWearTodayBasedOnTheWeather(99, 1000, "wtf move to Canada", message);
		});
	};
});