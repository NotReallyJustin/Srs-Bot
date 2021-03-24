const Helpy = require("../Helpy.js");
const Discord = require("discord.js");
const https = require("https");

module.exports = {
	name: "seal",
	description: "Seal the seal goes on r/seal to see a seal with a seal sealing the seal with a seal under a seal!",
	execute: (message, args) => {

		https.get("https://www.reddit.com/r/seals/new.json?limit=15", response => {

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

				var x = sealEmbed(post.data.title, post.data.author, redditImg);
				message.channel.send(x);
			})
		})
	}
}

const sealEmbed = (text, author, image) => {
	let embed = new Discord.MessageEmbed();
	embed.setTitle(text);
	embed.setDescription("u/" + author);
	embed.setColor("GOLD");

	embed.setImage(image);

	return embed;
}