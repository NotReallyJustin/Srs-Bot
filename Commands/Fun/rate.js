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
	"smh go kermit... uh... i forgot which command Justin deleted?",
	"smh go kermit substring function", 
	"smh go kermit music recs channel",
	"Go kermit palpitate",
	"smh go kermit pure.js"
];

const darkMode = [
	"System.out.print(Double.MIN_VALUE);",
	"I give -50000 / 10",
	"Stack Overflow Error: Number too small",
	"what are the chances of infecting greenland? Yea, that number",
	"smh take whatever number you're thinking of, take the absolute value, then multiply it by -1",
	"less than the chances of Justin joining LAS... oh wait",
	"less than the chances of Justin going to Finance Major next y... oh wait",
	"less than the chances of Justin reinstalling Clean Master",
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

			case 202:
				message.channel.send("I give 10/10"); //Yes this is an extremely fair coin lmao
			break;

			case 204:
				var x = Helpy.randomResp(darkMode);
				message.channel.send(x);
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

	//This will trigger if someone tries to say something like "light mode bad"
	if ((/light\b/ig.test(args)))
	{
		var notExploit = /discord\b|github\b|edge\b|fire\b|reddit\b|youtube\b|chrome\b|github\b/ig.test(args);

		return args.length > 2 && !notExploit ? 400 : 202;
	}

	if (/dark\b/ig.test(args))
	{
		var notExploit = /discord\b|github\b|edge\b|fire\b|reddit\b|youtube\b|chrome\b|github\b/ig.test(args);

		return args.length > 2 && !notExploit ? 400 : 204; //Dark Mode
	}

	return 200;
}
