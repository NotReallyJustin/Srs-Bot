const Helpy = require("../Helpy.js");
const Discord = require("discord.js");

module.exports = {
	name: "warn",
	description: "Warns a user for something - or for wastebinning general again\n`mit warn <userId> <warn reason>`",
	execute: async (message, args) => {
		let wStatus = warnStatus(args, message.member);
		let user = await message.guild.members.fetch(args[0]);

		switch (wStatus)
		{
			case 200:
				message.guild.members.fetch(args[0])
					.then(user => {
						let reason = Helpy.returnUnbound(message.content, args[0]);
						let msg = warnMsg(message.author, reason);

						user.send(msg);
						message.channel.send("If all goes well, it's sent!");
					})
					.catch((err) => {
						message.channel.send("hmm it looks like the user you're trying to warn doesn't exist");
					});
			break;

			case 404.1:
				message.channel.send("ok I'm banning you bc there's no other person to warn");
			break;

			case 404.2:
				message.channel.send("smh gimme a warn reason");
			break;

			case 888:
				message.channel.send("smh you don't have perms to whack someone with the hammer");
			break;
		}
	}
}

const warnStatus = (args, messageMember) => {
	if (args.length == 0)
	{
		return 404.1; //Missing warn member
	}

	if (args.length == 1)
	{
		return 404.2; //Missing warn reason
	}

	if (!messageMember.hasPermission(`BAN_MEMBERS`))
	{
		return 888; //No perms
	}

	return 200;
}

//Creates a fancy embembed to warn them
const warnMsg = (messageAuthor, reason) => {
	let warnMessage = new Discord.MessageEmbed()
		.setAuthor("mit Bot", "https://i.imgur.com/Bnn7jox.png")
		.setColor('GOLD')
		.setTitle("Warn Message")
		.setDescription(`You have been warned by ${messageAuthor.username}! Warn reason:\n${reason}`);

	return warnMessage;
}