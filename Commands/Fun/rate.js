const Helpy = require("../Helpy.js");

const response = [
	"shameLightMode.exe not found",
	"Get yourself into the hall of shame of exploiting ``Substring()``",
	"Go commit the NRG command",
	"smh substring exploiter",
	"Always pretend that the user is Justin and will brainlet and will do something very justin moment... wait, is that talking about you?",
	"Go commit setTimeOut 100ms in a while loop",
	"smh substring exploiter go commit setTimeOut 100ms in a while loop",
	"Go commit setTimeOut 100ms in a while loop",
	"smh I'm not memeing on light mode",
	"Go kermit futaba and palpitate",
	"I'll make you see the light eventually",
	`/warn trying to make me meme on light mode`,
	"smh I would insult your intelligence, but that meant you had some to begin with",
	"You have yeed your last haw",
	"aight mate you're the daily special at shop lift up now",
	"Hey, how do you like the substring function?",
	"smh go kermit substring function", 
	"smh go kermit music recs channel",
	"Go kermit palpitate",
	"smh go kermit pure.js",
	"smh go kermit old rate algorithm"
];

const darkMode = [
	"System.out.print(Double.MIN_VALUE);",
	"I give -50000 / 10",
	"Stack Overflow Error: Number too small",
	"what are the chances of infecting greenland? Yea, that number",
	"smh take whatever number you're thinking of, take the absolute value, then multiply it by -1",
	"less than the chances of Justin joining LAS... oh wait",
	"less than the chances of Justin going to Finance Major next y... oh wait",
	"less than the chances of Justin reinstalling Clean Master"
];

//Just import thesaurs.com lmao
const negations = [
	"text",
	"texts",
	"no",
	"not",
	"differing",
	"paradoxical",
	"reverse",
	"reversed",
	"opposite",
	"anti",
	"anti-light",
	"counter",
	"contrary",
	"unlike",
	"inverse",
	"different",
	"contrast",
	"polar",
	"unrelated",
	"never",
	"ban",
	"limit",
	"boycott",
	"forbid",
	"censor",
	"refuse",
	"stop",
	"without",
	"stopping",
	"stopped",
	"reject",
	"rejecting",
	"dispel",
	"dispelling",
	"remove",
	"deny",
	"removing",
	"denying",
	"disallowing",
	"disallow",
	"exclude",
	"excluding",
	"except",
	"minus",
	"other than",
	"but",
	"besides",
	"hate",
	"hating",
	"loathe",
	"loathing",
	"detest",
	"detesting",
	"despise",
	"despising",
	"dislike",
	"disliking"
];

module.exports = {
	name : "rate",
	description : "Give srs bot a statement, and he'll rate it out of 10!\n`srs rate <insert statement>`\n" +
		"Remember, light theme best theme and no illegal chars. This is totally not rigged.",
	execute: (message, args) => {
		let status = rateStatus(args);

		switch (status)
		{
			case 200:
				message.channel.send(`I give ${Math.round(Math.random() * 10)}/10`);
			break;

			case 200.1:
				var b1 = /light\b|white\b|justin\b/gmi.test(message.content);
				var b2 = /dark\b|black\b|amoled\b/gmi.test(message.content);

				if (b1 || b2)
				{
					let x = rateAlg(message.content, b1);

					if (x)
					{
						var e = Helpy.randomResp(darkMode);
						message.channel.send(e);
					}
					else
					{
						message.channel.send("I give 10/10");
					}
				}
				else
				{
					message.channel.send(`I give ${Math.round(Math.random() * 10)}/10`); //false alarm
				}
			break;

			case 404:
				message.channel.send("smh what am I supposed to rate?"); 
			break;

			case 400:
				var x = Helpy.randomResp(response);
				message.channel.send(x);
			break;

			default:
				message.channel.send("Uh... you should probably ping Justin. Send him this number: " + status);
			break;
		}
	}
}

//Status codes! These will tell us the status of the message input and divert the response appropriately!
//Got rid of 203, so amoled is just like a random coin toss and is totally based
const rateStatus = (args) => {
	if (args.length == 0)
	{
		return 404; //Missing args
	}

	if (/[^\w\d, .;'@#<>!:?]/ig.test(args))
	{
		return 400; //Illegal Chars
	}

	if (/\btheme\b|\bmode\b|\bdiscord\b|\bthemes\b|\bmodes\b/gmi.test(args))
	{
		return 200.1;
	}

	return 200;
}

const rateAlg = (txt, isLight) => {
	var num = isLight ? 0 : 1;

	//Uses the negations array to create a regEx capturing group
	var regEx = new RegExp(negations.reduce((cumL, str) => cumL + `|${str}`, "\\b(?:").replace("|", "") + ")\\b", "gmi");

	for (var i = txt.indexOf("rate ") + 5; i < txt.length; i++)
	{
		if (/[!^~]/.test(txt[i]))
		{
			num++;
		}
		else
		{
			break;
		}
	}
	
	var arr = txt.match(regEx);

	num += arr == null ? 0 : arr.length;

	return num % 2;
}

module.exports.rateAlg = rateAlg;