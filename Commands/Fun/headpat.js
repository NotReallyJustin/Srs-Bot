const https = require("https");
const Discord = require("discord.js");
const Helpy = require("../Helpy.js");

module.exports = {
	name: "headpat",
	description: "smh I am not giving you weeb headpats smh",
	execute: (interaction) => {
		https.get("https://www.reddit.com/r/headpats/new.json?limit=50", response => {
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

				var x = headpatEmbed(post.data.title, post.data.author, redditImg);
				interaction.reply({embeds: [x]});
			});
		});
	}
}

const headpatEmbed = (text, author, image) => {
	let embed = new Discord.MessageEmbed();
	embed.setTitle(text);
	embed.setDescription("u/" + author);
	embed.setColor("GREEN");

	embed.setImage(image);

	return embed;
}