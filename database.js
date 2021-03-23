/*	The class for Srs Bot temporary database.
	This stuff is in charge of slowmode and vc stuff */
const Discord = require("discord.js");

module.exports.initialize = (bot) => {
	bot.database = new Discord.Collection();

	//Note future: Don't change to => because this is inherited lexically
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
}

//Server class to create a ... server. 
//Yes very creative constructor naming
function Server(guild)
{
	this.vcConnection = null;
	this.channels = new Discord.Collection();
	this.discordServer = guild;
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
}