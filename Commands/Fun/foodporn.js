const https = require("https");
const Discord = require("discord.js");
const Helpy = require("../Helpy.js");

module.exports = {
	name: "foodporn",
	description: "It's porn. But it has to do with food so you can't HOS me.\nSyntax: `mit foodporn`",
	execute: (message) => {

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
				else if (post.data.secure_media != undefined)
				{
					redditImg = post.data.secure_media.oembed.thumbnail_url;
				}
				else
				{
					redditImg = post.data.thumbnail;
				}

				var x = foodpornEmbed(post.data.title, post.data.author, redditImg);
				message.channel.send(x);
			})
		})
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