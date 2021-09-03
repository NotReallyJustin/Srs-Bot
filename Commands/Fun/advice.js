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
	"reference error: Srs.Betray(Justin) does not exist",
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
	description : "Consult the wisdom of the noble alumni with 2x more life experience than you!",
	options: [
		{
			name: "request",
			description: "Remember light theme best theme and no illegal chars!",
			type: "STRING",
			required: true
		}
	],
	execute: (interaction) => {
		let request;

		try
		{
			request = interaction.options.getString("request", true);
			if (!request) throw "smh what am I giving advice on?";
			if (/[^\w\d, .;'@#<>!:?]/ig.test(request)) throw Helpy.randomResp(response);
		}
		catch(err)
		{
			interaction.reply(err);
			console.error(err);
		}

		if (/\btheme\b|\bmode\b|\bdiscord\b|\bthemes\b|\bmodes\b/gmi.test(request))
		{
			var b1 = /light\b|white\b|justin\b/gmi.test(request);
			var b2 = /dark\b|black\b|amoled\b/gmi.test(request);

			if (b1 || b2)
			{
				let x = Rate.rateAlg(request, b1);

				if (x)
				{
					interaction.reply('Yes!');
				}
				else
				{
					var e = Helpy.randomResp(seeNoEvil);
					interaction.reply("hell no \n" + e);
				}
			}
			else
			{
				interaction.reply("If it's for light mode, yes. If it's not, then no.");
			}
		}
		else
		{
			var x = Helpy.randomResp(eightWheel);
			interaction.reply(x);
		}
	}
}