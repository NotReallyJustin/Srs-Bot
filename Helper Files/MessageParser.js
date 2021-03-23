/* 
 *	JS code to parse the discord messages we fetched using Srs Bot.
 *	Probably used in hangman games or smth, who knows?
*/
const fs = require("fs");
const inputFile = "Brooklyn Technical 🎿 - Showcase - hall-of-fame [659445931170725918].json";
const outputTxtFile = "HOF.txt";
const outputLinkFile = "HOFLink.txt";

fs.readFile("./" + inputFile, (err, txt) => {
	let data = JSON.parse(txt).messages;
	parseHalls(data);
});

//----------------------------Separated Barrier-------------------------------------

//Parses messages in HOF and HOS, or basically any Carl Bot showcase channel
function parseHalls(data)
{
	let writeData = "";
	let writeLinkData = "";

	data.forEach(post => {
		//Handle attachments
		post.attachments.forEach(attachment => {
			writeLinkData += attachment.url + "\n";
		});

		let embed = post.embeds[0];
		if (post.embeds.length != 0)
		{
			//Embed text
			let brokenArr = embed.description.split("**");
			if (/\w/gmi.test(brokenArr) && !/https/gmi.test(brokenArr[brokenArr.length - 1]))
			{
				writeData += brokenArr[brokenArr.length - 1].replace(/[^a-z ]/gmi, "") + "\n";
			}

			//Embed image
			if (embed.image)
			{
				writeLinkData += embed.image.url + "\n";
			}
		}
	});

	fs.writeFileSync(outputTxtFile, writeData);
	fs.writeFileSync(outputLinkFile, writeLinkData);
	console.log("done!");
}