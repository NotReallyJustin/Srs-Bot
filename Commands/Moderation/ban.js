const Helpy = require("../Helpy.js");
const Discord = require("discord.js");

module.exports = {
	name: "ban",
	description: "Whammm someone with the ban hammer! You need ban perms tho",
	options: [
		{
            name: "snowflake",
            description: "The person about to get smashed",
            required: true,
            type: "USER"
        },
        {
            name: "reason",
            description: "discord.gg/go_touch_some_grass",
            required: true,
            type: "STRING"
        },
        {
        	name: "days",
        	description: "How long to ban them for",
        	required: false,
        	type: "INTEGER"
        }
	],
	execute: (interaction) => {
		let user;
		let reason;
		let days;

		try
		{
			user = interaction.options.getMember("snowflake");
			if (!user) throw "ok I'm banning you bc you didn't tell me who to ban";

			reason = interaction.options.getString("reason");
			if (!reason) throw "smh give me a ban reason";

			if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.BAN_MEMBERS))
			{
				throw "smh you don't have perms to whack someone with the hammer";
			}

			if (user.permissions.has(Discord.Permissions.FLAGS.BAN_MEMBERS))
			{
				throw "smh why are you trying to ban a staff";
			}

			days = interaction.options.getInteger("days");
			if (days && days < 1) throw "smh I can't ban for that number of days";
		}
		catch(err)
		{
			if (typeof err == 'string')
			{
				interaction.reply(err);
			}
			else
			{
				console.error(err);
				interaction.reply("smh I don't have perms");
			}
			return;
		}

		let collective = {reason: reason};
		if (days)
		{
			collective["days"] = days;
		}

		user.send(`You have been banned from ${interaction.guild.name}! Ban reason: ${reason}`);
		user.ban(collective);

		interaction.reply("Done! Now gimee a cookie!");
	}
}