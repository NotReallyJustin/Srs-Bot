module.exports = {
	name: "mention",
	description: "Mention a group and unleash the mass ping! You just need to also be part of the group.\n`mit mention <groupname>`",
	execute: (message, args) => {
		if (args.length == 0)
		{
			message.channel.send("smh what am I mentioning?");
		}
		else
		{
			const filtered = mentionJSON[args[0].toLowerCase()];

			if (filtered)
			{
				if (filtered.indexOf(message.author.id + "") == -1)
				{
					message.channel.send("smh don't be a rulebreaker, you're not in that group to ping");
				}
				else
				{
					let x = filtered.reduce((cumL, curr) => cumL + ` <@${curr}>`, `From ${message.author}: `);
					message.channel.send(x);
				}
			}
			else
			{
				message.channel.send("smh that group doesn't exist, what are you pinging");
			}
		}
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