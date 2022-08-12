const { ApplicationCommandOptionType } = require("discord.js");
const Discord = require("discord.js");
const { hasGuildPerm } = require("../Helpy");

module.exports = {
	name: "ban",
	description: "Wham someone with the ban hammer! You need ban perms tho",
	options: [
		{
            name: "snowflake",
            description: "The person about to get smashed",
            required: true,
            type: ApplicationCommandOptionType.User
        },
        {
            name: "reason",
            description: "discord.gg/go_touch_some_grass",
            required: true,
            type: ApplicationCommandOptionType.String
        },
        {
        	name: "days",
        	description: "How long to ban them for",
        	required: false,
        	type: ApplicationCommandOptionType.Integer
        }
	],
	execute: (interaction) => {
		let user;
		let reason;
		let days;

		try
		{
			if (!hasGuildPerm(interaction, Discord.PermissionsBitField.Flags.BanMembers)) throw "hey I don't have ban perms";

			user = interaction.options.getMember("snowflake");
			if (!user) throw "ok I'm banning you bc you didn't tell me who to ban";

			reason = interaction.options.getString("reason");
			if (!reason) throw "smh give me a ban reason";

			if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.BanMembers))
			{
				throw "smh you don't have perms to whack someone with the hammer";
			}

			if (user.permissions.has(Discord.PermissionsBitField.Flags.BanMembers))
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

		// user.send(`You have been banned from ${interaction.guild.name}! Ban reason: ${reason}`)
		// 	.catch(err => {
		// 		console.error(err);
		// 	});

		const x = banMsg(interaction.user, reason);
		user.send({embeds: [x]})
			.then(() => {
				user.ban(collective)
					.then(() => {
						interaction.reply("Done! Now gimee a cookie!");
					}).catch(err => {
						interaction.reply(`Ban not successful. See error logs.`);
						console.error(err);
					}) 
			})
			.catch(err => {
				console.error(err);
			});
	}
}

const banMsg = (messageAuthor, reason) => {
	let banMessage = new Discord.EmbedBuilder()
		.setAuthor({
			name: "Srs Bot",
			iconURL: "https://i.imgur.com/Bnn7jox.png"
		})
		.setColor('Red')
		.setTitle("Ban Message")
		.setDescription(`_You have been banned by ${messageAuthor.username}!_ \n**Ban reason:** ${reason}`);

	return banMessage;
}