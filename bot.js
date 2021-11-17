//---------------------INIT----------------------------------------
//Backend
const Database = require("./database.js");
const Helpy = require("./Commands/Helpy.js");
const Advice = require("./Commands/Fun/advice.js");

const fs = require("fs");
const Discord = require("discord.js");
const INTENT = Discord.Intents.FLAGS;
const bot = new Discord.Client({intents:[
	INTENT.GUILDS, 
	INTENT.GUILD_MEMBERS, 
	INTENT.GUILD_BANS, 
	INTENT.GUILD_EMOJIS_AND_STICKERS, 
	INTENT.GUILD_MESSAGES, 
	INTENT.GUILD_MESSAGE_REACTIONS,
	INTENT.GUILD_MESSAGE_TYPING,
	INTENT.DIRECT_MESSAGES,
	INTENT.DIRECT_MESSAGE_REACTIONS,
	INTENT.DIRECT_MESSAGE_TYPING
]});

//Not mongodb
Database.initialize(bot);

//Cloud
const Mango = new require("mongodb").MongoClient;
const mango = new Mango(process.env.MANGO_CONNECTION);

let connectionPromise = mango.connect()
connectionPromise.then(() => {
	console.log("Let that mango, we connected to someone else's computer");

	mangoDatabase = mango.db("BotData");

	//Toolkit to be parsed around
	toolkit = {
		"bot" : bot,
		"mangoDatabase" : mangoDatabase,
		"mango" : mango
	};
});

connectionPromise.catch(err => {
	console.log(err.stack);
});

//---------------------BOT LOGIN & CMDS---------------------
bot.login(process.env.BOT_TOKEN);
bot.once("ready", () => {

	let botPromise = bot.generateInvite({
		scopes: ["bot", "applications.commands"],
		permissions: [Discord.Permissions.FLAGS.ADMINISTRATOR]
	});
	console.info(botPromise);

	//Discord custom status for bots when lol
	bot.user.setPresence({
	 	status: "online",  
	    activities: [{
	        name: "PlagueINC Cure Mode - Eliminating the Dark Mode virus",  
	        type: "PLAYING"
	    }]
	});

	bot.commands = new Discord.Collection();
	const commandPaths = [
		"./Commands/Blab",
		"./Commands/Utility",
		"./Commands/Moderation",
		"./Commands/Fun"
	];
	
	let commandData = [];

	commandPaths.forEach(path => {
		fs.readdirSync(path).filter(files => files.endsWith(".js")).forEach(fileName => {
			let command = require(`${path}/${fileName}`);
			bot.commands.set(command.name, command);
			commandData.push(command);
		});
	});

	//Upon holding the attack button, Ayaka will perform a frontal slash, dealing high physical damage
	let setSlash = bot.application.commands.set(commandData);

	setSlash.then(() => {
		console.log("Loading done - ready to roll!");
	});
	setSlash.catch(err => {
		console.error(err);
	});
});

//----------------------------------EXTRANEOUS EASTER EGG DATA--------------------------------------------

//Easter egg array
//f1 - currply is true, f2 - currply is false, f2a - extra arguments we might need to send
const easterEggs = [
	{matches: /\bmy grade is\b/gmi, 
		f1: () => {}, 
		f2: (message) => {message.channel.send("smh be quiet and study for your 1520")}, 
		f2a: ""
	},
	{matches: /\bmiku\b/gmi, 
		f1: () => {}, 
		f2: (message) => {message.channel.send("congrats you earned a one way ticket to #wastebin")}, 
		f2a: ""
	},
	{matches: /\bseal hunting\b/gmi, 
		f1: () => {}, 
		f2: (message) => {message.channel.send("you better run before I put you in char siu fan")}, 
		f2a: ""
	},
	{matches: /\bbths\b|\bbtech\b|\bbrooklyn tech\b/gmi, 
		f1: () => {}, 
		f2: (message) => {message.channel.send("smh bths")}, 
		f2a: ""
	},
	{matches: /\bchizu\b|\bcheez\b|\bcheese\b/gmi, 
		f1: (message) => {message.react("🧀")}, 
		f2: (message) => {message.react("🧀")}, 
		f2a: ""
	},
	{matches: /\blas\b/gmi, 
		f1: (message) => {message.react("🤮")}, 
		f2: (message, f2a) => {message.channel.send(Helpy.randomResp(f2a))}, 
		f2a: [
			"Software Major is superior kek",
			"ok sir now go Pheniox Wright yourself into the Hall of Shame",
			":shut: you discount SSR ripoff",
			"ok kiddo that's three strikes. Go sit in the time out corner for 20 years", //idk much about 3 strikes law but iirc it goes like dis
			"i suggest you use your right to remain silent"
		]
	},
	{matches: /\bew light\b/gmi, 
		f1: (message) => {message.react("🤮")}, 
		f2: (message, f2a) => {message.channel.send(Helpy.randomResp(f2a))}, 
		f2a: [
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
		]
	},
	//Smh when will the AP Sex meme die :(
	{matches: /\bsex\b/gmi, 
		f1: (message) => {message.react("🤮")}, 
		f2: (message, f2a) => {message.channel.send(Helpy.randomResp(f2a))}, 
		f2a: [
			"congrats you earned yourself a one way ticket to the hall of shame",
			"🤮",
			"oh mercy me",
			"for the love of democracy, get that thing in the hall of shame",
			"wym you failed at that subject the last time you tried it in the 7th floor staircase",
			"When we say people like vanilla, we don't mean this stuff 🤮"
		]
	},
	{matches: /\bbill diffrenly\b/gmi, 
		f1: (message) => {message.react("🤮")}, 
		f2: (message, f2a) => {message.channel.send("IDK bub you're also made out of DNA")}, 
		f2a: ""
	},
	{matches: /\bjava\b/gmi, 
		f1: (message) => {message.react("🤮")}, 
		f2: (message, f2a) => {message.channel.send(Helpy.randomResp(f2a))}, 
		f2a: [
			"Which bored person invented strict type 🤮",
			"smh say that word again and I'll overload you",
			"Yandere Dev has more understandable code than college board",
			"system.out.print(\"Say Sike Right Now\");",
			"smh go kermit use jgrasp",
			"public class YourPost extends HallOfShame",
			"smh go slap a private access modifier on youself",
			"smh the probability of a green blob attacking you is small, but never 0 (he's very lucky)" //Dream reference >:)
		]
	},
	{matches: /\bsilverman\b/gmi, 
		f1: (message) => {message.react("⭐")}, 
		f2: (message, f2a) => {message.channel.send(Helpy.randomResp(f2a))}, 
		f2a: [
			"whomst have summoned the lord ⭐",
			"wow that's some SPICEy hot take",
			"there's a myriad of different way to exploit this bot if you think about it",
			"that's almost as wonderful as the almighty board notes uwu",
			"i heard someone summoning the king of apwh and sociology"
		]
	}
];

//----------------------Functionalities Begin----------------------------------------

bot.on('messageCreate', async message => {

	if (message.author.bot) return;

	//------------------------------------DMS------------------------------------------------

	if (!message.guild)
	{

		var collection = mangoDatabase.collection("Hot Seat");
		var regHotSeat = await collection.countDocuments({"id": message.author.id});

		//If the person is registered for hot seat, send the hot seat
		if (!!regHotSeat)
		{
			let hotseatUser = await collection.findOne({"id": message.author.id});
			bot.channels.fetch(hotseatUser.channel)
				.then(channel => {
					let output = Helpy.messageCompile("Hot Seat Message: \n" + message.content + "\n", message.attachments);
					channel.send(output);
				});

			message.react("🧀");
		}

		return;
	}

	//-----------------MESSAGE REGISTERING--------------------------------------

	const server = bot.database.getServer(message.guild.id, message.guild);
	const currentChannel = server.getChannel(message.channel.id, message.channel);

	if (currentChannel.inSlowmode)
	{
		currentChannel.messageCount++;
	}

	//------------------Alternate Move Pathway-------------------------------
	server.getMoves(message.author.id)(message.content, message);
	currentChannel.getMoves(message.author.id)(message.content, message);

	//-----------------Srs Bot Easter Eggs - Add more after Christmas update----------------

	//Takes the first match (bc if we spam all 10 easter eggs, it would be rly weird) and execute functions attached with it
	let matchRes = easterEggs.filter((item) => item.matches.test(message.content))[0];
	if (matchRes)
	{
		currentChannel.replyMsg || matchRes.f1(message);
		!currentChannel.replyMsg || matchRes.f2(message, matchRes.f2a);
		return;
	}

	//-----------------LIGHT MODE FIGHTS BACK------------------
	return;
	if (/\btheme\b|\bmode\b|\bdiscord\b|\bthemes\b|\bmodes\b/gmi.test(message.content))
	{
		Advice.chatDefender(message);
	}
});

//----------------COMMANDS------------------------------------

bot.on('interactionCreate', async interaction => {
	if (interaction.isCommand())
	{
		if (interaction.inGuild())
		{
			let currentChannel = bot.database.getServer(interaction.guildId, interaction.guild).getChannel(interaction.channelId, interaction.channel);
			bot.commands.get(interaction.commandName).execute(interaction, toolkit, currentChannel);
			//interaction.command.execute(interaction, toolkit, currentChannel);
		}
		else
		{
			interaction.reply("smh don't pretend that you have hotseat");
		}
	}
});