//---------------------INIT----------------------------------------
//Backend
const prefix = "srs";
const Database = require("./database.js");
const Helpy = require("./Commands/Helpy.js");

const fs = require("fs");
const Discord = require("discord.js");
const bot = new Discord.Client();

Database.initialize(bot);
bot.commands = new Discord.Collection();

const commandPaths = [
	"./Commands/Events",
	"./Commands/Fun",
	"./Commands/Moderation",
	"./Commands/Blab",
	"./Commands/Utility"
];

commandPaths.forEach(path => {
	fs.readdirSync(path).filter(files => files.endsWith(".js")).forEach(fileName => {
		let command = require(`${path}/${fileName}`);
		bot.commands.set(command.name, command);
	});
});

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

bot.on("ready", () => {
	console.log("I'm clearly confused");

	bot.generateInvite(["ADMINISTRATOR"]).then(link => {
		console.log(link);
	}).catch(err => {
		console.log(err.stack);
	})
})

bot.on('message', async message => {

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
		currentChannel.messageCount += 1;
	}

	//-----------------------SRS EASTER EGG SECTION------------------------------------

	//Easter egg array
	//f1 - currply is true, f2 - currply is false, f2a - extra arguments we might need to send
	const easterEggs = [
		{matches: /\bmy grade is/gmi, 
			f1: () => {}, 
			f2: (message) => {message.channel.send("smh be quiet and study for your 1520")}, 
			f2a: ""
		},
		{matches: /\bmiku/gmi, 
			f1: () => {}, 
			f2: (message) => {message.channel.send("congrats you earned a one way ticket to #wastebin")}, 
			f2a: ""
		},
		{matches: /\bseal hunting/gmi, 
			f1: () => {}, 
			f2: (message) => {message.channel.send("you better run before I put you in char siu fan")}, 
			f2a: ""
		},
		{matches: /\blight theme best theme/gmi, 
			f1: () => {}, 
			f2: (message) => {message.channel.send("Correct!")}, 
			f2a: ""
		},
		{matches: /\bbths|\bbtech|\bbrooklyn tech/gmi, 
			f1: () => {}, 
			f2: (message) => {message.channel.send("smh bths")}, 
			f2a: ""
		},
		{matches: /\bchizu|\bcheez|\bcheese/gmi, 
			f1: (message) => {message.react("🧀")}, 
			f2: (message) => {message.react("🧀")}, 
			f2a: ""
		},
		{matches: /\blas/gmi, 
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
		{matches: /\bew light/gmi, 
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
		{matches: /\bsex/gmi, 
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
		{matches: /\bbill diffrenly/gmi, 
			f1: (message) => {message.react("🤮")}, 
			f2: (message, f2a) => {message.channel.send("IDK bub you're also made out of DNA")}, 
			f2a: ""
		},
		{matches: /\bjava/gmi, 
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
		{matches: /\bmaclean/gmi, 
			f1: (message) => {message.react("🤮")}, 
			f2: (message, f2a) => {message.channel.send(Helpy.randomResp(f2a))}, 
			f2a: [
				"smh since you like democracy so much, democracy this into the hall of shame",
				"free speech doesn't mean you can keep yappping",
				"🤮🤮🤮",
				"when we say think critically we don't mean sentence your transcript to death",
				"I thought we live in a society",
				"I am only loyal to Lord Silverman!",
				"ew smh the only god I worship is silverman",
				"it's called ma-clean because your transcript average will be power washed into oblivon",
				"smh go kermit read 5 chapters of the American Yawp",
				"freeze for the good of society",
				"everyone has life, liberty, and pursuit of happiness - well until maclean pulls a last minute grade upload",
				"are your grades the articles of confederation? Because they look like they're about to fall apart",
				"liberate me from my 89% smh",
				"are you bri ish? Cause we're about to throw your king's 'T' into the harbor",
				"call this a second great awakening, I need that for my next LEQ",
				"<Insert angry cliff emote here>"
			]
		},
		{matches: /\bsilverman/gmi, 
			f1: (message) => {message.react("🤮")}, 
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

	//Takes the first match (bc if we spam all 10 easter eggs, it would be rly weird) and execute functions attached with it
	let matchRes = easterEggs.filter((item) => item.matches.test(message.content))[0];
	if (matchRes)
	{
		currentChannel.replyMsg || matchRes.f1(message);
		!currentChannel.replyMsg || matchRes.f2(message, matchRes.f2a);
	}

	//----------------ACTUAL SRS COMMANDS----------------------

	messageArray = message.content.split(" ");
	command = messageArray[1];
	args = messageArray.slice(2);

	if (messageArray[0] == prefix) //Entering Srs bot prefix code section
	{
		if (bot.commands.has(command))
		{
			bot.commands.get(command).execute(message, args, toolkit, currentChannel);
		}
		else
		{
			message.channel.send("Buddy that command does not exist");
		}
	}
})