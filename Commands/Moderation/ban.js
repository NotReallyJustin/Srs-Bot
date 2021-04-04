const Helpy = require("../Helpy.js")

module.exports = {
	name: "ban",
	description: "Launches the ban hammer\n`mit ban <userId> <ban reason>`",
	execute: async (message, args) => {
		let user = await message.guild.members.fetch(args[0]);
		let bStatus = banStatus(args, message.member, user);

		switch (bStatus)
		{
			case 200:
				let reason = Helpy.returnUnbound(message.content, args[0]);
				user.send("You have been banned! Ban reason: " + reason);
				user.ban({reason: reason});

				message.channel.send("Done! Now gimmee a cookie!");
			break;

			case 404.1:
				message.channel.send("ok I'm banning you bc there's no other person to ban");
			break;

			case 404.2:
				message.channel.send("smh gimme a ban reason");
			break;

			case 888.1:
				message.channel.send("smh why are you trying to ban a staff");
			break;

			case 888.2:
				message.channel.send("smh you don't have perms to whack someone with the hammer");
			break;
		}
	}
}

const banStatus = (args, messageMember, user) => {

	if (args.length == 0)
	{
		return 404.1; //missing user
	}

	if (args.length == 1)
	{
		return 404.2; //missing reason
	}

	if (user.hasPermission("BAN_MEMBERS"))
	{
		return 888.1; //Ban person is a staff
	}

	if (!messageMember.hasPermission("BAN_MEMBERS"))
	{
		return 888.2; //No perms
	}

	return 200;
}