const { ApplicationCommandOptionType } = require("discord.js");
const Helpy = require("../Helpy.js"); 
const { autoExtract } = require("./Defense Arsenal/RelationExtraction.js");
const SentimentAnalysis = require('./Defense Arsenal/SentimentAnalysis.js');
const POS = require('./Defense Arsenal/POS.js');
const Response = require('./Defense Arsenal/Response.js');

const eightWheel = [
	"smh try again I'm tired",
	"yes",
	"hell no",
	"probably",
	"i think yea",
	"i think no"
];

module.exports = {
	name : "advice",
	description : "Consult the wisdom of the noble alumni with 2x more life experience than you",
	options: [
		{
			name: "request",
			description: "If you forget light theme best theme, the Defenders would be too happy to remind you ;)",
			type: ApplicationCommandOptionType.String,
			required: true
		}
	],
	execute: async (interaction) => {

		//Error checks before
		let request = interaction.options.getString("request", true);
		if (!request)
		{
			interaction.reply("smh what am I giving advice on?");
			return;
		}

		if (/[^\w\d, .;'@#<>!:?]/ig.test(request))
		{
			interaction.reply(Helpy.randomResp(Response.response) + "\n\n||If you didn't get that, it just meant you entered an illegal character||");
			return;
		}

		await interaction.deferReply();

		//HERE WE GOOOOOOOO
		//Literal https://www.youtube.com/watch?v=Ge-eSFgKLkY moment
		POS.calculate(request)
			.then(arr => {
				POS.chunk(arr)
					.then(chunkRay => {
						//console.log(chunkRay)
						let root = autoExtract(chunkRay);
						interaction.editReply(determineReaction(SentimentAnalysis(root, 0.01)));
					})
			});

	}
}

function determineReaction(num)
{
	if (num == 0) return Helpy.randomResp(eightWheel);
	if (num > 0) return Helpy.randomResp(Response.slightLM);
	if (num < 0) return Helpy.randomResp(Response.slightDM);
}

module.exports.chatDefender = function(message, currChanRepMsg) {
	if (!currChanRepMsg) return;
	POS.calculate(message.content)
		.then(arr => {
			POS.chunk(arr)
				.then(chunkRay => {
					//let root = autoExtract(chunkRay);
					let sentNum = SentimentAnalysis(autoExtract(chunkRay));
					if (sentNum != 0)
					{
						message.reply(determineReaction(sentNum));
					}
				})
		});
}
