const https = require("https");
const Discord = require("discord.js");
const Helpy = require("../Helpy.js");

module.exports = {
	name: "foodporn",
	description: "Imma be frank with you - this is porn. Well, foodporn. Don't HOS me pls",
	execute: async (interaction) => {
		await interaction.deferReply();
		https.get("https://www.reddit.com/r/FoodPorn/new.json?limit=50", response => {

			var packets = "";

			response.on("data", data => {
				packets += data;
			});

			response.on("end", () => {
				let dataJSON = JSON.parse(packets);
				let post = Helpy.randomResp(dataJSON.data.children);

				let redditImg;

				if (post.data.url_overridden_by_dest.includes("i.redd.it"))
				{
					redditImg = post.data.url_overridden_by_dest;
				}
				else
				{
					redditImg = post.data.thumbnail;
				}

				var x = foodpornEmbed(post.data.title, post.data.author, redditImg);
				interaction.editReply({embeds: [x]});
			});

			response.on("error", (err) => {
				console.error(err);
				interaction.editReply("there was an error :think:");
			})
		});
	}
}

const foodpornEmbed = (text, author, image) => {
	let embed = new Discord.MessageEmbed();
	embed.setTitle(text);
	embed.setDescription("u/" + author);
	embed.setColor("BROWN");

	embed.setImage(image);

	return embed;
}