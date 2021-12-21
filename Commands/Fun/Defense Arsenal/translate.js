const translateAPI = require("@vitalets/google-translate-api");
const Helpy = require("../Helpy.js");
const Discord = require("discord.js");

//Keyword array basically is just a collection of shortcuts because I'm lazy
const keywordArray = {
	english: ["auto", "es"],
	spanglish: ["en", "es"],
	help: ["help", "help"]
};

const languageArray = [ //Makes sure the translation language is currently supported
	"en", "es", "de", "fr", "pt", "it", "nl", "pl", "ru", "ja", "zh-CN", "el", "ko", "la", "sv", "auto", "help"
];

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

module.exports = {
	name: "translate",
	description: "Cheat vos modo durch Español 三. Necesitas avere preset || (from && to) pls thx",
	options: [
	    {
            name: "translatetext",
            description: "The parola che vuoi traddure 🗿 Grazie my 3 years of italian in middle school paid off",
            required: true,
            type: "STRING"
        },
		{
            name: "preset",
            description: "✨ elige un preset especial que hay from y to pre-selected para ti ✨",
            required: false,
            type: "STRING",
            choices: [
            	{name: "Help", value: "help"},
            	{name: "English", value: "english"},
            	{name: "Spanglish", value: "spanglish"}
            ]
        },
        {
            name: "from",
            description: "ℹ️ ❌️ 🗣️ 😀",
            required: false,
            type: "STRING",
            choices: [
            	{name: 'en', value: 'en'},
            	{name: 'es', value: 'es'},
            	{name: 'de', value: 'de'},
            	{name: 'fr', value: 'fr'},
            	{name: 'pt', value: 'pt'},
            	{name: 'it', value: 'it'},
            	{name: 'nl', value: 'nl'},
            	{name: 'pl', value: 'pl'},
            	{name: 'ru', value: 'ru'},
            	{name: 'ja', value: 'ja'},
            	{name: 'zh', value: 'zh-CN'},
            	{name: 'el', value: 'el'},
            	{name: 'ko', value: 'ko'},
            	{name: 'la', value: 'la'},
            	{name: 'sv', value: 'sv'},
            	{name: 'auto', value: 'auto'}
            ]
        },
        {
            name: "to",
            description: "你想翻译成哪个语言 蛋布丁 汤饺子🥟 饭蛋糕 王朋是垃圾",
            required: false,
            type: "STRING",
            choices: [
            	{name: 'en', value: 'en'},
            	{name: 'es', value: 'es'},
            	{name: 'de', value: 'de'},
            	{name: 'fr', value: 'fr'},
            	{name: 'pt', value: 'pt'},
            	{name: 'it', value: 'it'},
            	{name: 'nl', value: 'nl'},
            	{name: 'pl', value: 'pl'},
            	{name: 'ru', value: 'ru'},
            	{name: 'ja', value: 'ja'},
            	{name: 'zh', value: 'zh-CN'},
            	{name: 'el', value: 'el'},
            	{name: 'ko', value: 'ko'},
            	{name: 'la', value: 'la'},
            	{name: 'sv', value: 'sv'},
            	{name: 'auto', value: 'auto'}
            ]
        }
	],
	execute: (interaction) => {
		//Trans-statis! PLAGUEINC EVOLVED!!!
		let k1;
		let k2;
		let translateText;

		try
		{
			if ((!interaction.options.getString("from") || !interaction.options.getString("to")) && !interaction.options.getString("preset"))
			{
				throw "smh either give me a preset or give me the from and to."
			}

			//These come after because we need to make sure one of these 2 are valid before we seperate + verify it at the same time
			if (interaction.options.getString("preset"))
			{
				var pset = interaction.options.getString("preset"); //MIT pun not intended LOL - can someone do my AP Calc HW pls
				k1 = keywordArray[pset][0];
				k2 = keywordArray[pset][1];
			}
			else
			{
				k1 = interaction.options.getString("from");
				k2 = interaction.options.getString("to");
			}

			if (languageArray.indexOf(k1) == -1)
			{
				throw "smh your from argument is more undefined than my spanish vocab";
			}

			if (languageArray.indexOf(k2) == -1)
			{
				throw "Tu vai a l'hopital? Because your 'to' is undefined."
			}

			translateText = interaction.options.getString("translatetext", true);
			if (!translateText)
			{
				throw "smh give me a text to translate";
			}
		}
		catch(err)
		{
			console.error(err)
			interaction.reply(interaction);
			interaction.followUp("If you need help, fill in 'help' as the preset");
			return;
		}

		if (k1 == "help")
		{
			interaction.reply({embeds: [translateHelpEmbed(langArray)]});
		}
		else
		{
			interaction.deferReply();
			//Transtasis! Now we can grab zoonotic shift without giving 40 DNA to Genetic Drift!
			var transStatus = translate(k1, k2, translateText);

			transStatus.then(response => {
				interaction.editReply({embeds: [translateEmbed(response)]});
			});
			transStatus.catch(err => {
				console.log(err);
				interaction.editReply("hmm something went wrong... maybe ping a dwerpy seal about it .-.");
			});
		}
	}
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