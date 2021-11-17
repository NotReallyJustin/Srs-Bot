const Helpy = require("../Helpy.js");
const { autoExtract } = require("./Defense Arsenal/RelationExtraction.js");
const SentimentAnalysis = require('./Defense Arsenal/SentimentAnalysis.js');
const POS = require('./Defense Arsenal/POS.js');
const Response = require('./Defense Arsenal/Response.js');

module.exports = {
	name : "rate",
	description : "Give srs bot a statement, and he'll rate it out of 10! No illegal chars btw",
	options: [
		{
			name: "item",
            description: "Glory to light mode, and its everlasting reign!",
            required: true,
            type: "STRING"
		} //Ok at this point we're not even hiding that this is light mode propaganda lmao
	],
	execute: async (interaction) => {
		const item = interaction.options.getString("item", true);

		if (!item)
		{
			interaction.reply('smh what am I supposed to rate?');
			return;
		}

		if (/[^\w\d, .;'@#<>!:?]/ig.test(item)) //Illegal Chars
		{
			interaction.reply(Helpy.randomResp(Response.response) + "\n\n||If you didn't get that, it just meant you entered an illegal character||");
			return;
		}

		await interaction.deferReply();
		POS.calculate(item)
			.then(arr => {
				POS.chunk(arr)
					.then(chunkRay => {
						let root = autoExtract(chunkRay);
						interaction.editReply(determineReaction(SentimentAnalysis(root, 0.01)));
					})
			});
	}
}

function determineReaction(saScore)
{
	if (saScore == 0)
	{
		return `I give ${Math.round(Math.random() * 10)}/10`;
	}
	else if (saScore < 0)
	{
		return Helpy.randomResp(Response.darkMode);
	}
	else if (saScore > 0)
	{
		return "I rate 10/10";
	}
	else
	{
		return "hmm something went wrong... ping Justin";
	}
}