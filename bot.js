//---------------------INIT----------------------------------------
//Backend
const prefix = "mit";
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
	});

	bot.user.setPresence({
	 	status: "online",  
	    activity: {
	        name: "Aiding with the MIT Admissions Process | DM for Headpats",  
	        type: "PLAYING"
	    }
	});
})

bot.on('message', async message => {

	if (message.author.bot) return;

	//------------------------------------DMS------------------------------------------------

	if (!message.guild)
	{
		let currentUser = bot.personal.getUser(message.author.id);
		//The slash denotes a Justin command prompt to send an MIT thing
		if (message.author.id == "348208769941110784" && message.content[0] != "/")
		{
			let uid = message.content.substring(0, message.content.indexOf(" "));
			bot.users.fetch(uid).then(user => {
				user.send(message.content.substring(message.content.indexOf(" ") + 1));
			});
		}
		else
		{
			bot.users.fetch("348208769941110784").then(user => {
				user.send(message.author.id + " : " + message.content);
			});

			bot.commands.get(mit).execute(message, currentUser, bot);
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

	//------------------Alternate Move Pathway-------------------------------
	server.getMoves(message.author.id)(message.content, message);
	currentChannel.getMoves(message.author.id)(message.content, message);

	//-----------------------SRS EASTER EGG SECTION------------------------------------

	//Easter egg array
	//f1 - currply is true, f2 - currply is false, f2a - extra arguments we might need to send
	const easterEggs = [
		{matches: /\bmy grade is\b/gmi, 
			f1: () => {}, 
			f2: (message) => {message.channel.send("Is it a 1520? Because you're not making it in MIT with anything less than that")}, 
			f2a: ""
		},
		{matches: /\bmiku\b/gmi, 
			f1: () => {}, 
			f2: (message) => {message.channel.send("On behalf of the Cleansing Department of MIT, go to the bin")}, 
			f2a: ""
		},
		{matches: /\bseal hunting\b/gmi, 
			f1: () => {}, 
			f2: (message) => {message.channel.send("Filing animal aboose report....")}, 
			f2a: ""
		},
		{matches: /\blight theme best theme\b/gmi, 
			f1: () => {}, 
			f2: (message) => {message.channel.send("Correct!")}, 
			f2a: ""
		},
		{matches: /\bbths\b|\bbtech\b|\bbrooklyn tech\b/gmi, 
			f1: () => {}, 
			f2: (message) => {message.channel.send("Brooklyn Technical: I remember we accepted 2 kids last year... out of 2000")}, 
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
				"It seems you have attracted the attention of our MIT admissions staff. Why on Earth would you go to a technical high school just to enroll in a humanities major?",
				"It's mens et manus, not sit there and listen to Stein rant",
				":shut: you discount SSR ripoff",
				"If you would like to get rejected from law school, Harvard is right down the road.",
				"I suggest you use your right to remain silent"
			]
		},
		{matches: /\bew light\b/gmi, 
			f1: (message) => {message.react("🤮")}, 
			f2: (message, f2a) => {message.channel.send(Helpy.randomResp(f2a))}, 
			f2a: [
				"It has been scientifically proven that light theme best theme.",
				"According to our nobel peace prize dissertation, we wish you a very happy no u.",
				"It's physically impossible to read anything in < 100 Watt light",
				"Our campus religious center would like to inform you the proper quote is let there be light, not let there be heathens",
				"You have been waitlisted for saying that.",
				"Instead of that police car, you're next.",
				"You have yeed your last haw",
				"There are 10 reasons Europe emerged from the Dark Ages; using AMOLED is not one of them",
				"The Massachusetts Government has officially deemed you to be unsafe for society. You will now to escorted to the wastebin along with our rollar coaster",
				`You just earned a one way ticket to the Hall of Shame`,
				"I suggest you use your right to remain silent",
				"The laws of astrophysics have predicted that all signs point to a very happy no u.",
				"Our urban planning major will now ensure that your house will be bombarded with light 24/7 in order to cleanse your soul.",
				"Your MIT Purity score has now decreased by 500%",
				"Go commit do a P-Set at 12AM",
				"I hope you're not dividing by zero, because you're about to go to l'hospital"
			]
		},
		//Smh when will the AP Sex meme die :(
		{matches: /\bsex\b/gmi, 
			f1: (message) => {message.react("🤮")}, 
			f2: (message, f2a) => {message.channel.send(Helpy.randomResp(f2a))}, 
			f2a: [
				"We don't commit unintellegent moves like this in our prestigious campus.",
				"🤮",
				"In order for the MIT admissions department to consider your AP Sex grade, you must score a 5. Judging by your behavior in the 7th floor staircase, you're nowhere close to that.",
				"MIT Medical would like to remind you that we do not endorse this 🤮. Alternatively, we reccomend you to stay away from egirls.gg",
				"Buddy I'll have to deport you to Boston College for this.",
				"On behalf of the MIT administration, we'll have to ask you to kindly unenroll yourself from our OCW class on Love, Sex, and Marriage",
				"The only dating happening around here is Carbon-14"
			]
		},
		{matches: /\bbill diffrenly\b/gmi, 
			f1: (message) => {message.react("🤮")}, 
			f2: (message, f2a) => {message.channel.send("Chemistry says you're 70% water. Physics says you're 99.999% empty space. I say you're not bill differently")}, 
			f2a: ""
		},
		{matches: /\bjava\b/gmi, 
			f1: (message) => {message.react("🤮")}, 
			f2: (message, f2a) => {message.channel.send(Helpy.randomResp(f2a))}, 
			f2a: [
				"As faithful Boston tea drinkers, we reject coffee mugs.",
				"smh say that word again and I'll overload you",
				"You see, this is why we don't accept APCSA credits at MIT.",
				"system.out.print(\"Say Sike Right Now\");",
				"We would like to hack your java program, but we realized you did it to yourself with all that encapsulation",
				"public class YourPost extends HallOfShame",
				"I hope your name is Clay, because the odds of you getting into MIT is now 1 in 7.5 trillion" //Dream reference >:)
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