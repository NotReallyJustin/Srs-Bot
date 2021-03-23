const translateAPI = require("@vitalets/google-translate-api");
const Helpy = require("../Helpy.js");
const Discord = require("discord.js");

//Keyword array basically is just a collection of shortcuts because I'm lazy
const keywordArray = [
	{"keyword" : "english", "kw1" : "auto", "kw2" : "en"},
	{"keyword" : "spanglish", "kw1" : "en", "kw2" : "es"}
];

const languageArray = [ //Makes sure the translation language is currently supported
	"en", "es", "de", "fr", "pt", "it", "nl", "pl", "ru", "ja", "zh", "el", "ko", "la", "sv", "auto"
];

module.exports = {
	name: "translate",
	description: "Translates a piece of text\n`srs translate <from> <to> <message to translate>",
	execute: (message, args) => {
		let transStatus = translateStatus(args);

		switch (transStatus)
		{
			case 200:

				var txt = Helpy.returnUnbound(message.content, args[1]);
				var x = translate(args[0].replace("zh", "zh-CN"), args[1].replace("zh", "zh-CN"), txt);

				x.then(response => {
					message.channel.send(translateEmbed(response));
				});

				x.catch(err => {
					console.log(err);
					message.channel.send("hmm something went wrong... maybe ping a dwerpy seal about it .-.");
				});

			break;

			case 300:
				const langArray = [
					{"lang" : "Spanish", "shortcut" : "es"},
					{"lang" : "German", "shortcut" : "de"},
					{"lang" : "French", "shortcut" : "fr"},
					{"lang" : "Portugese", "shortcut" : "pt"},
					{"lang" : "Italian", "shortcut" : "it"},
					{"lang" : "Dutch", "shortcut" : "nl"},
					{"lang" : "Polish", "shortcut" : "pl"},
					{"lang" : "Russian", "shortcut" : "ru"},
					{"lang" : "Japanese", "shortcut" : "ja"},
					{"lang" : "Chinese", "shortcut" : "zh"},
					{"lang" : "Swedish", "shortcut" : "sv"},
					{"lang" : "Latin", "shortcut" : "la"},
					{"lang" : "Greek", "shortcut" : "el"},
					{"lang" : "Korean", "shortcut" : "ko"},
					{"lang" : "English", "shortcut" : "en"}
				];

				message.channel.send(translateHelpEmbed(langArray));
			break;

			case 400.1:
				message.channel.send("smh specify the language for the 1st input language");
				message.channel.send("use `srs help` for a full guide, or check `srs translate help` for syntax");
			break;

			case 400.2:
				message.channel.send("smh specify the language for the 2nd input language");
				message.channel.send("use `srs help` for a full guide, or check `srs help translate` for syntax");
			break;

			case 400.3:
				message.channel.send("smh what am I translating?");
			break;

			case 404.1:
				message.channel.send("Looks like your 1st input language does not exist or isn't supported yet, or you just oofed up");
			break;

			case 404.2:
				message.channel.send("Looks like your 2nd input language does not exist or isn't supported yet, or you just oofed up");
			break;

			//Hey, sometimes your eyes lie to you and js does not behave like js
			//This default is controlled. The only way you get here is if keywordArray gets returned as a staus
			default:

				var txt = Helpy.returnUnbound(message.content, args[0]);
				var x = translate(transStatus[0].kw1, transStatus[0].kw2, txt);

				x.then(response => {
					message.channel.send(translateEmbed(response));
				});

				x.catch(err => {
					console.log(err);
					message.channel.send("hmm something went wrong... maybe ping a dwerpy seal about it .-.");
				});
			break;
		}
	}
}

const translateStatus = (args) => {

	if (args.length == 0)
	{
		return 400.1; //Lang 1 and/or keyword not filled in
	}

	if (args[0] == "help")
	{
		return 300; //Help
	}

	//Checks to see if there is a keyword
	const kwMatch = keywordArray.filter(item => item.keyword == args[0]);
	if (kwMatch.length != 0)
	{
		//If there is a keyword, the rest of the checks are meaningless. This is the only time the switch statement later will default as intended
		return args.length == 1 ? 400.3 : kwMatch; 
	}

	if (args.length == 1)
	{
		return 400.2; //Lang 2 not filled in
	}

	if (args.length == 2)
	{
		return 400.3; //Nothing to translate
	}

	if (!languageArray.includes(args[0]))
	{
		return 404.1; //Language for first not found
	}

	if (!languageArray.includes(args[1]))
	{
		return 404.2; //Language for second not found. Both 404 errors should not happen if we use shortcut
	}

	return 200;
}

const translateHelpEmbed = (jsonArray) => {
	let langMessage = new Discord.MessageEmbed()
		.setAuthor("Srs Bot", "https://i.imgur.com/Bnn7jox.png")
		.setColor('GREEN')
		.setTitle("Translate Syntax");

	let returnString = jsonArray.reduce((cummL, input) => cummL + `${input.lang}: '${input.shortcut}' \n`, "");
	langMessage.setDescription(returnString);

	return langMessage;
}

//Translates a msg
const translate = (from, to, message) => new Promise((resolve, reject) => {

	let worker = translateAPI(message, {from: from, to: to});
	worker.then(response => resolve(response))
	worker.catch(err => reject(err));
});

const translateEmbed = (response) => {

	//Corrects a very important chinese translation yes (hi Cat I know you're snooping here)
	response.text = response.text.includes("egg tart") ? "something about egg pudding" : response.text;

	let translateMessage = new Discord.MessageEmbed()
		.setAuthor("Srs Bot", "https://i.imgur.com/Bnn7jox.png")
		.setColor('RANDOM')
		.setTitle("Translation");
								
	var descriptionString = response.text;
	descriptionString += response.from.text.didYouMean ? `\n\nIt seems we detected a typo. Do you mean to say: ${response.from.text.value}?`:"";
	translateMessage.setDescription(descriptionString);

	return translateMessage;
}