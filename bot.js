const botSettings = require("./botsettings.json");
const Discord = require("discord.js");
const prefix = botSettings.prefix;

const bot = new Discord.Client();
// Big thanks to Steven and Iscii for being gods and making sure I don't brainlet the code :P

bot.login(botSettings.token);

bot.on("ready", () => {
	console.log("Printer On!");

	bot.generateInvite(["ADMINISTRATOR"]).then(link => {
		console.log(link);
	}).catch(err => {
		console.log(err.stack);
	});
});

function Yeet(text, message) {
	return message.channel.sendMessage(text);
};
//defines yeet

function Roll(outcomes) {
	RNG = Math.floor(Math.random() * outcomes);
	console.log(RNG)
};

function NRG(RNGValue, text, message) {
	if(RNG == RNGValue) javaderp.Yeet(text, message);
};

bot.on("message", async message => { //Enter portion of text code//
	if(message.author.bot) return;
	if(message.channel.type === "dm") return message.channel.sendMessage("Smh I'm not a dm bot");
	// Enter easter egg portion//
	if(message.content.toUpperCase() === "My trig grade is ruined!") Yeet("Smh be quiet and study\
	 for your 1580", message);
	if(message.content.toUpperCase() === "I have nothing to do") Yeet("Smh then post on instagram\nStop eating egg pudding or you'll be fat\
		\nSmh stop eating on your keeb and make me on 24/7", message);
	if(message.content.toUpperCase() === "EW LIGHT MODE") {
		Roll(15);
		NRG("0", "Smh at least he can read in the sun", message);
		NRG("1", "no u", message);
		NRG("2", "Smh how can you meme on eye strain when you're reading in the dark", message);
		NRG("3", "It's let there be light, not let there be heathens", message);
		NRG("4", "You dare oppose me with that dark mode", message);
		NRG("5", "Smh how are you going to say that and then call Justin the brainlet", message);
		NRG("6", "You have yeed your last haw", message);
		NRG("7", "There are 10 reasons Europe emerged from the Dark Ages; using AMOLED is not one of them", message);
		NRG("8", "Smh I would insult your intelligence, but that would mean you had some to begin with", message);
		NRG("9", ":illegal: :illegal: :illegal:", message);
		NRG("10", "I suggest you use your right to remain silent", message);
		NRG("11", "Congratulations! Your message is more hated than Space Jams!", message);
		NRG("12", "Ding Dong your brainlet opinion is wrong", message);
		NRG("13", "Are you an alkali Earth Metal? Because you're so salty Daniel would mute you for toxidity", message);
		NRG("14", "smh every say we stray further away from God", message);
	};
	if(message.content === "Light theme best theme") Yeet("Correct!", message);

//entering srs prefix code section
	let messageArray = message.content.split(" ");
	let command = messageArray[0];
	let args = messageArray.slice(1);
	// Slices message by word!

	function beforeArgs(suffix, txt) {
		if(args[0] === suffix) Yeet(txt, message)
	};

	function cmdDetect(suffix) {
		return(args[0] == suffix);
		};
		
	if(!command === prefix) {console.log(message.content);
	//if the thing isn't srs, the command would report invalid
	} else 
		// This is where Srs says stuff but
		if (cmdDetect("invite")) {
			Roll(3);
			NRG("0", "Smh didn't buy your broke college student a plane ticket", message);
			NRG("1", "Smh I'm not going to your meetups", message);
			NRG("2", "Smh you don't even have my invite code", message); 
		};
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
		beforeArgs("updatelist", "Justin currently abandoned the bot in search of coding an unpaywall");

});