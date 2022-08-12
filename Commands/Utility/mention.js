const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "mention",
	description: "Mention a group and unleash the mass ping! We don't cover deaths by riots 🐸",
	options: [
		{
            name: "group",
            description: "which poor soul is getting a ping blast today?",
            required: true,
            type: ApplicationCommandOptionType.String
        }
	],
	execute: (interaction) => {
		let filtered;

		try
		{
			var g = interaction.options.getString("group", true);
			if (!g) throw "wtf how did you manage to not add a group";
			
			filtered = mentionJSON[g.toLowerCase()];
			if (!filtered) throw "smh that group doesn't exist, what are you pinging";

			if (filtered.indexOf(interaction.user.id + "") == -1)
			{
				throw "smh don't be a rulebreaker, you're not in that group to ping";
			}
		}
		catch(err)
		{
			interaction.reply(err);
			return;
		}

		let x = filtered.reduce((cumL, curr) => cumL + `<@${curr}>`, `From ${interaction.user}: `);
		interaction.channel.send(x);
		interaction.reply({content: 'Done! Here comes the woogPing emotes!', ephemeral: true});
	}
}

const mentionJSON = {
	band: [
		"458997270227058698", 
		"309494444925911041",
		"464229820994158615", 
		"360859374870331414",
		"348208769941110784",
		"436264683909939211",
		"363037388655820813"
	],
	cap: [
		"407991817049604096",
		"248273876902084608",
		"605801976508448788",
		"322450486517301259",
		"315294557904306187",
		"267029537169211392"
	]
};