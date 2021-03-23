const Helpy = require("../Helpy.js");
const bdayId = "";
const justinId = "348208769941110784";

//A nickname list for Justin lmao
const justinNicknames = [
	"Egg Pudding",
	"Valdictorian", //Justin exclusive nicknames
	"Seal",
	"United States Navy Seals",
	"PlyerTheDefender",
	"Srs Bot Owner"
];

module.exports = {
	name : "dm",
	description : "Use srs bot to send an anonymous message to someone!\n`srs dm <userID> <message to send>`\nIf it's your bday it becomes anon",
	execute: async (message, args, toolbox) => {
		const bot = toolbox.bot;
		let status = dmStatus(args);

		switch (status)
		{
			case 200:
				let sendTxt = Helpy.returnUnbound(message.content, args[0]);

				//Add different easter egg endings depending on who is sending the message :P
				switch (message.author.id)
				{
					//Bday anon message send which will send the log to Justin's workshop for accountability purposes :hype:
					//Also if this happens, we don't add the author's name to sendTxt
					case bdayId:
						bot.channels.fetch(bdayId)
							.then(channel => {
								channel.send(`Birthday user has sent "${newArgs}" to ${bot.users.get(args[0]).username}!`);
							});
					break;

					case justinId:
						var x = Helpy.randomResp(justinNicknames);
						sendTxt += `  (frum ${x})`;
					break;

					default:
						sendTxt += ` (frum ${message.author.username})`;
					break;
				}

				message.guild.members.fetch(args[0]).then((user) => { //Sends the message!
					user.send(sendTxt);
					message.channel.send("If all goes well, message is sent!");
				}); 
			break;

			case 404:
				message.channel.send("smh what am I supposed to say");
			break;

			case 800:
				message.channel.send("Give me a user ID smh");
			break;

			default:
				message.channel.send("Woah what happened here?");
			break;
		}
	}
}

//All status functions are set so we can expand the number of errors in the future
const dmStatus = (args) => {
	if (isNaN(args[0]))
	{
		return 800; //Not an ID. Also happens to catch null indexes for args 0
	}

	if (!args[1])
	{
		return 404; //Missing args in args[1], aka missing statement to send
	}

	return 200;
}