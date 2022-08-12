const { ApplicationCommandOptionType } = require("discord.js");
const Helpy = require("../Helpy.js");
const { bot } = require("../../clientConfig.js");
const bdayId = "";
const justinId = "348208769941110784";
const channelId = "701858995299942482";

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
	description : "Send a secret dm to someone - OK IT USED TO BE A SECRET DM PLS DON'T HOS ME",
	options: [
        {
            name: "snowflake",
            description: "Le person you're sending",
            required: true,
            type: ApplicationCommandOptionType.User
        },
        {
            name: "message",
            description: "Super secret message - we promise this is totally hashed and encrypted by RapidSSL",
            required: true,
            type: ApplicationCommandOptionType.String
        }
    ],
	execute: async (interaction) => {
		//Discord *should* be parsing the arguments normally but Justin Case we'll do something
		let username;
		let message;
		let user;

		try
		{
			user = interaction.options.getUser("snowflake", true);
			if (!user) throw "smh the user doesn't even exist";

			username = user.id;

			message = interaction.options.getString("message", true);
			if (!message) throw "smh what am I supposed to say?";
		}
		catch(err)
		{
			interaction.reply(err);
			return;
		}

		switch(interaction.user.id)
		{
			case bdayId:
				bot.channels.fetch(channelId)
					.then(channel => {
						channel.send(`Birthday user <@${bdayId}> has sent "${message}" to <@${username}> !`)
					});
			break;

			case justinId:
				var x = Helpy.randomResp(justinNicknames);
				message += `	(frum ${x})`;
			break;

			default:
				message += `	(frum ${interaction.user.username})`;
			break;
		}

		var promise = user.send(message);
		promise.then(() => {
			interaction.reply('Message sent successfully!');
			setTimeout(() => {
				interaction.deleteReply();
			}, 3000);
		});
		promise.catch(() => {
			interaction.reply('whoops smth went wrong - maybe ping Justin');
		});
	}
}
