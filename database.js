/*	The class for Srs Bot temporary database. 
	This stuff is in charge of slowmode and vc stuff, and also srs games */
const Discord = require("discord.js");

//Initializes bot temp database
module.exports.initialize = (bot) => {
	bot.database = new Discord.Collection();

	/**
	 * @param {Discord.Snowflake} id Server ID to look for
	 * @param {Discord.Guild} guild Server object
	 * @returns Temp database's storage of message guild. If it doesn't exist then make one
	 */
	bot.database.getServer = function(id, guild) {
		let server = this.get(id);

		if (server) //Discord slowflakes will never be 0
		{
			return server;
		}
		else
		{
			var tempServer = new Server(guild);
			this.set(id, tempServer);

			return tempServer;
		}
	}

	/**
	 * Recursively searches for the temp database's storage of the message/interaction's channel
	 * @param {(Discord.Message | Discord.CommandInteraction)} action Discord action event taken from events
	 */
	bot.database.searchMessageChannel = function(action) {
		return this.getServer(action.guildId, action.guild).getChannel(action.channelId, action.channel);
	}
}

/**
 * Server class to create a ... server.
 * Yes very creative constructor naming 🤣
 * @param {Discord.Guild} guild I used to play Hypixel Guild PVP but then Skyblock came out
 */
function Server(guild)
{
	this.vcConnection = null;
	this.vcSubscription = null;
	this.channels = new Discord.Collection();
	this.discordServer = guild;

	//External function calls that bypass normal input flow
	//All moves should only have one parameter - the message content
	this.moves = new Discord.Collection();
}

/**
 * @param {Discord.Snowflake} id Snowflake of channel
 * @param {Discord.GuildChannel} messageChannel Guild channel to look for in temp database
 * @returns Temp database's storage of the message's channel. If it doesn't exist, make one.
 */
Server.prototype.getChannel = function(id, messageChannel) {
	let channel = this.channels.get(id);

	if (channel)
	{
		return channel;
	}
	else
	{
		var tempChannel = new Channel(messageChannel);
		this.channels.set(id, tempChannel);

		return tempChannel;
	}
}

/**
 * If have move, get move
 * @param {Discord.Snowflake} authorID ID of user
 */
Server.prototype.getMoves = function(authorID) {
	return this.moves.get(authorID) || (function() {});
}

/**
 * @param {Discord.Snowflake} authorID How many different ways can you say user?
 * @returns If have move
 */
Server.prototype.hasValidMoves = function(authorID) {
	return !!this.moves.get(authorID);
}

/**
 * If the executing user has an existing move, don't let them start a new move (read: game). If not, start a new move (read: game)
 * @param {Discord.Snowflake} authorID I hope these variable names make sense, we've gone a long way since Yeet();
 * @param {Function} method Callback to execute. Should only contain a message parameter
 * @returns Whether a move was added
 */
Server.prototype.addMoves = function(authorID, method) {

	if (this.moves.get(authorID))
	{
		return false;
	}
	
	this.moves.set(authorID, method);
	return true;
}

/**
 * If have move remove move
 * @param {Discord.Snowflake} authorID Why more word when few word do trick
 */
Server.prototype.deleteMoves = function(authorID) {

	if (this.moves.get(authorID))
	{
		this.moves.delete(authorID);
	}
}

/**
 * For the record, the *Channel*ing enchantment in Minecraft sucks 
 * Mojang pls fix literally unplayable
 * @param {Discord.GuildChannel} messageChannel 🙏🏽
 */
function Channel(messageChannel)
{
	this.slowmodeId = -1; //Slowmode id keeps track of the timer number to clear
	this.inSlowmode = false;
	this.maxNum = -1;
	this.messageCount = 0;
	this.slowmoding = false; //Slowmoding tells if the channel is act on slowmode
	this.decentMessageCount = 0;
	this.replyMsg = false;
	this.discordChannel = messageChannel;
	this.moves = new Discord.Collection(); 
	this.christmasPlayer = null;
}

//Manually inheriting it for scalability in case we decide to add more features to server class
Channel.prototype.getMoves = Server.prototype.getMoves;
Channel.prototype.addMoves = Server.prototype.addMoves;
Channel.prototype.deleteMoves = Server.prototype.deleteMoves;
Channel.prototype.hasValidMoves = Server.prototype.hasValidMoves;
