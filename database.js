/*	The class for Srs Bot temporary database.
	This stuff is in charge of slowmode and vc stuff, and also srs games */
const Discord = require("discord.js");

module.exports.initialize = (bot) => {
	bot.database = new Discord.Collection();

	//Note future: Don't change to =>
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

	bot.personal = new Discord.Collection();

	bot.personal.getUser = function(id) {
		let user = this.get(id);

		if (user)
		{
			return user;
		}
		else
		{
			var tempUser = new User(id);
			this.set(id, tempUser);
			return tempUser;
		}
	}
}

//Server class to create a ... server. 
//Yes very creative constructor naming
function Server(guild)
{
	this.vcConnection = null;
	this.channels = new Discord.Collection();
	this.discordServer = guild;

	//External function calls that bypass normal input flow
	//All moves should only have one parameter - the message content!
	this.moves = new Discord.Collection();
}

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

Server.prototype.getMoves = function(authorID) {

	if (this.moves.get(authorID))
	{
		return this.moves.get(authorID);
	}

	return () => {};
}

Server.prototype.hasValidMoves = function(authorID) {
	return !!this.moves.get(authorID);
}

Server.prototype.addMoves = function(authorID, method) {

	if (this.moves.get(authorID))
	{
		return false;
	}
	
	this.moves.set(authorID, method);
	return true;
}


Server.prototype.deleteMoves = function(authorID) {

	if (this.moves.get(authorID))
	{
		this.moves.delete(authorID);
	}
}

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
}

//Manually inheriting it for scalability in case we decide to add more features to server class
Channel.prototype.getMoves = Server.prototype.getMoves;
Channel.prototype.addMoves = Server.prototype.addMoves;
Channel.prototype.deleteMoves = Server.prototype.deleteMoves;
Channel.prototype.hasValidMoves = Server.prototype.hasValidMoves;

//------------------- DM Databases for MIT Day ---------------------
function User(uid)
{
	this.id = uid;
	this.responseLogs = () => {};
	this.name = "";
	this.school = "";
	this.acceptanceRate = 0.001;
}

//Logs must be a moveLog object that takes message object and currentUser database object as execute
User.prototype.swapLogs = function(logs) {
	this.responseLogs = logs.execute;
}

User.prototype.clearLogs = function() {
	this.responseLogs = () => {};
}