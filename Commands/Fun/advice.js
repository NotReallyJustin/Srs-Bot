const Helpy = require("../Helpy.js");
const Rate = require("./rate.js");

const eightWheel = [
	"smh try again I'm tired",
	"yes",
	"hell no",
	"probably",
	"i think yea",
	"i think no"
];

const seeNoEvil = [
	"smh Light theme best theme",
	"I swear I will launch the Spanish Inquisition against dark mode",
	"reference error: mit.Betray(Justin) does not exist",
	"Internal error: You should know light mode > dark mode",
	"smh Light Mode good",
	"no matter how much you try to exploit this, it's still light theme best theme smh"
];

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
	"smh go kermit pure.js"
];

module.exports = {
	name : "advice",
	description : "Ask mit bot a question, and he'll give a yes or no answer like a 8ball!\n`mit advice <insert statement>`\n" +
		"Remember, light theme best theme and no illegal chars",
	execute: (message, args) => {
		let status = rateStatus(args);

		switch (status)
		{
			case 200:
				var x = Helpy.randomResp(eightWheel);
				message.channel.send(x);
			break;

			case 200.1:
				var b1 = /light\b|white\b|justin\b/gmi.test(message.content);
				var b2 = /dark\b|black\b|amoled\b/gmi.test(message.content);

				if (b1 || b2)
				{
					let x = Rate.rateAlg(message.content, b1);

					if (x)
					{
						var e = Helpy.randomResp(seeNoEvil);
						message.channel.send("hell no \n" + e);
					}
					else
					{
						message.channel.send("yes");
					}
				}
				else
				{
					message.channel.send("If it's for light mode, yes. If it's not, then no.");
				}
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