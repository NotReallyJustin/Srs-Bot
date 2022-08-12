/*
	Start Point of Srs Bot :)
	`$node bot.js`
*/

const fs = require("fs");
const Discord = require("discord.js");

const TempDatabase = require("./database.js");
const { bot } = require("./clientConfig.js");

TempDatabase.initialize(bot);

//---------------------BOT LOGIN & CMDS---------------------
bot.once("ready", () => {
	console.info("Invite Link Generated:" + bot.getInviteLink());

	//Discord custom status for bots when lol
	bot.user.setPresence({
	 	status: "online",  
	    activities: [{
	        name: "PlagueINC Cure Mode - Eliminating the Dark Mode virus",  
	        type: "PLAYING"
	    }]
	});

	//For every command file: register the command on the Discord side and on the client side
	//also bozo command files are stored in the JS files
	let commandData = [];

	fs.readdirSync("./Commands", {withFileTypes: true})
		.filter(smashborg => smashborg.isDirectory())
		.map(directory => directory.name)
		.forEach(dirName => {
			var path = `./Commands/${dirName}`;
			fs.readdirSync(path)
				.filter(files => files.endsWith(".js"))
				.forEach(fileName => {
					var command = require(`${path}/${fileName}`);
					bot.commands.set(command.name, command);
					commandData.push(command);
				})
		})

	//Upon holding the attack button, Ayaka will perform a frontal slash, dealing high physical damage
	let setSlash = bot.application.commands.set(commandData);
	setSlash.then(() => {
		console.log("Loading done - ready to roll!");
	});
	setSlash.catch(err => {
		console.error(err);
	});
	
	/*let setHamsterSlash = bot.guilds.cache.get("476749001912221706").commands.set(commandData);
	setHamsterSlash.then(() => {
		console.log("Guinea pig has been fed carrots - or something like that. I don't know what they eat.");
	});
	setHamsterSlash.catch(err => {
		console.error(err);
	});*/
});

//------------------------Activate All Bot Functions---------------------------
fs.readdirSync("./Functions")
	.filter(file => file.endsWith("js"))
	.forEach(fileName => {
		var costcoSeasonedShitakeMushroomsTasteGoodAlsoThisVariableDoesNothing = require(`./Functions/${fileName}`);
	});

//------------------------Alternate message move pathway--------------------------
bot.on('messageCreate', async message => {
	if (message.author.bot) return;

	let server = bot.database.getServer(message.guildId, message.guild);
	let currentChannel = server.getChannel(message.channelId, message.channel);

	server.getMoves(message.author.id)(message.content, message);
	currentChannel.getMoves(message.author.id)(message.content, message);

	//Light mode fights back
	/*if (/\btheme\b|\bmode\b|\bdiscord\b|\bthemes\b|\bmodes\b/gmi.test(message.content))
	{
		Advice.chatDefender(message);
	}*/
});

//----------------SLASH COMMANDS------------------------------------
bot.on('interactionCreate', async interaction => {
	if (interaction.type === Discord.InteractionType.ApplicationCommand)
	{
		if (interaction.inGuild())
		{
			//let currentChannel = bot.database.getServer(interaction.guildId, interaction.guild).getChannel(interaction.channelId, interaction.channel);
			bot.commands.get(interaction.commandName).execute(interaction);
			//interaction.command.execute(interaction, toolkit, currentChannel);
		}
		else
		{
			interaction.reply("sorry slash commands are only enabled in servers");
		}
	}
});