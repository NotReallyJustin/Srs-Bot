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
}

bot.on("message", async message => { //Enter portion of text code//
	const illegal = message.guild.emojis.find(e => e.name == "illegal");
	const yeetMsgs = [
		"Smh at least he can read in the sun",
		"no u",
		"Smh how can you meme on eye strain when you're reading in the dark",
		"It's let there be light, not let there be heathens",
		"You dare oppose me with that dark mode",
		"Smh how are you going to say that and then call Justin the brainlet",
		"You have yeed your last haw",
		"There are 10 reasons Europe emerged from the dark ages; using AMOLED is not one of them",
		"Smh I would insult your intelligence, but that would mean you had some to begin with",
		`${illegal} ${illegal} ${illegal}`, //msg.channel.send(`${illegal}`);
		"I suggest you use to right to remain silent",
		"Smh take your dark mode into minecraft",
		"Ding Dong your brainlet opinion is wrong",
		"Are you an alkali Earth Metal? Because your so salty Daniel would mute you for toxidity",
		"smh every say we stray further away from god"
	]
	if(message.author.bot) return;
	if(message.channel.type === "dm") return message.channel.sendMessage("Smh I'm not a dm bot");
	// Enter easter egg portion
	if(message.content === "My trig grade is ruined!") Yeet("Smh be quiet and study\
	 for your 1580", message);
	if(message.content === "I have nothing to do") Yeet("Smh then post on instagram\nStop eating egg pudding or you'll be fat\
		\nSmh stop eating on your keeb and make me on 24/7", message);
	if(message.content.toUpperCase === "EW LIGHT MODE") { //so many smhs e.e
		let RNG = Math.floor(Math.random() * 15);
		Yeet(yeetMsgs[RNG], message);
	}
	if(message.content === "Light theme best theme") Yeet("Correct!", message);

//entering srs prefix code section
	let messageArray = message.content.split(" ");
	let command = messageArray[0];
	let args = messageArray.slice(1);
	// Slices message by word!

	function beforeArgs(suffix, txt) {
	if(args[0] === suffix) Yeet(txt, message)
	};

	if(!command === prefix) {console.log(message.content);
	//if the thing isn't srs, the command would report invalid
	} else 
		// This is where Srs says stuff but
		beforeArgs("invite", "Smh didn't buy your broke college alum a plane ticket");
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
