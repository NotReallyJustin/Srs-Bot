//CLIENTCONFIG file configures anything that has a username/password instance in it so bot.js can focus on initializing

//---------------------------------------Configures bot with all v14 scopes/perms---------------------------------------------
const Discord = require("discord.js");

const bot = new Discord.Client({ 
	intents: [   
	Discord.GatewayIntentBits.DirectMessages, 
	Discord.GatewayIntentBits.GuildMessageReactions,
	Discord.GatewayIntentBits.GuildMessages,
	Discord.GatewayIntentBits.MessageContent,
	Discord.GatewayIntentBits.Guilds
	],
	partials: [
		Discord.Partials.Message,
		Discord.Partials.Channel,
		Discord.Partials.Reaction
	]
}); 

bot.login(process.env.BOT_TOKEN);
bot.getInviteLink = function() {
	return this.generateInvite({
		scopes: ["bot", "applications.commands"],
		permissions: [Discord.PermissionsBitField.Flags.Administrator]
	})
}

bot.commands = new Discord.Collection();

module.exports.bot = bot;
//------------------------------------Configures Mango------------------------------------------------------------------
const Mango = new require("mongodb").MongoClient;
const mango = new Mango(process.env.MANGO_CONNECTION);

let connectionPromise = mango.connect()
connectionPromise.then(() => {
	//mangoDatabase = mango.db("BotData");
	module.exports.mangoDatabase = mango.db("BotData");
	console.log("Let that mango, we connected to someone else's computer");
});

connectionPromise.catch(err => {
	console.log(err.stack);
});