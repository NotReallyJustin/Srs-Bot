/* This is where all the pure functions and external operations regarding libraries are done so we don't
contaminate the main srs bot code. Ye snoop around in here if you want lmao
CHRISTMAS CULT RISE UP*/

const Discord = require("discord.js");
const weather = require("weather-js");
const translator = require("@danke77/google-translate-api");

//Not pure -------------------------------------------------------
module.exports.banStatus = (messageArray, messageMember, user) => {

	if (messageArray.length == 2)
	{
		return 404.1; //missing user
	}

	if (messageArray.length == 3)
	{
		return 404.2; //missing reason
	}

	if (user.hasPermission("BAN_MEMBERS"))
	{
		return 888.1;
	}

	if (!messageMember.hasPermission("BAN_MEMBERS"))
	{
		return 888.2; //No perms
	}

	return 200;
}

module.exports.fuckMath = () => {
	const mathIsEvil = [
		"We do not speak of the devil here",
		"The power of Christ compells you",
		"Honestly smh my head",
		"smh go kermit take Arjun's class",
		"I would insult your intelligence , but that would mean you had some to begin with.",
		"go commitRNGCommand();",
		"Sadly, Precalc doesn't return a 404 error",
		"In this world, there are two things that are a pain in the ass: CSS and the Math Department",
		"cheems repeat>Fuck Math",
		"oh mercy me",
		"When we say to go do the math yourself, we don't mean sentence your transcript to death",
		"Hey, if you graph tan(90 degrees), you can probably find how many people like math",
		"Hit compile. 2 errors. Take regents. Now you're whole math career is an error.",
		"What does sqrt(-1) and how much I like math have in common? They're both imaginary",
		"smh corporate needs you to find the difference between these 2 pictures: Arjun and some Indian guy on YouTube",
		"for (i=0; i < The number of people that hate math; i++) {alert('🤮');}",
		"Math? We don't do that around here",
		"Math? So you have chosen... death",
		"Doing math is alot like debugging - you solve one problem and 20 more appears"
	];

	return mathIsEvil[roll(mathIsEvil.length)];
}

const roll = (outcomes) => Math.floor(Math.random() * outcomes);

module.exports.randomResp = (list) => list[roll(list.length)];

module.exports.shame = () => {
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
		"Go kermit palpitate"
	];

	return response[roll(response.length)];
}

//-----------------------------------------------------------------
//Returns the first index in the array where the condition fits the callback query
module.exports.arrayIndexSearch = (array, callback) => {
	let item = array.filter(callback);

	return item.length == 0 ? -1 : array.indexOf(item[0]);
}

//Takes parse weather JSON to return embed
module.exports.createWeatherEmbed = (json) => {
	let embed = new Discord.MessageEmbed();
	embed.setAuthor("Srs Bot", "https://i.imgur.com/Bnn7jox.png");
	embed.setColor('AQUA');
	embed.setTitle("Advanced Forecast");
	embed.setDescription(`Current Temp: ${json.currTemp} \n` +
		`Feels like: ${json.feelsLike} \n`+
		`Humidity: ${json.humidity} \n` +
		`Sky Text: ${json.skyText} \n` +
		`Recent Weather Bloon Launch Time: ${json.observationTime}`);
	embed.setFooter("Does anyone even use this during quarantine");

	return embed;
}

const dateFrom0 = (i, month, day) => {
	//1,3,5,7,8,10,12
	switch(i)
	{
		case 1:
		case 3:
		case 5:
		case 7:
		case 8:
		case 10:
		case 12:
			day += 31;
		break;

		case 2:
			day += 29;
		break;

		case 4:
		case 6:
		case 9:
		case 11:
			day += 30;
		break;
	}

	if (month == i)
	{
		return day;
	}

	return dateFrom0(++i, month, day);
}

//Date 1 is current date, date 2 is target date
module.exports.dateDistance = (date1, date2) => dateFrom0(-1, date2.getMonth(), date2.getDate()) - dateFrom0(-1, date1.getMonth(), date1.getDate());

//All status functions are set so we can expand the number of errors in the future
module.exports.dmStatus = (messageArray, args) => {
	if (isNaN(args[1]))
	{
		return 800; //Not an ID
	}

	if (messageArray.length <= 3)
	{
		return 404; //Missing args
	}

	return 200;
}

//Compiles dm message
module.exports.dmCompile = (message, messageArray, bdayCallback, bot) => {
	let newArgs = this.returnUnbound(message.content, messageArray[2]);

	switch (message.author.id)
	{
		case "348208769941110784":
			let randomList = [
				"Egg Pudding",
				"Valdictorian", //Justin exclusive nicknames
				"Seal Team 6",
				"United States Navy Seals",
				"PlyerTheDefender",
				"Srs Bot Owner"
			];
			newArgs += ` (frum ${this.randomResp(randomList)})`;
		break;

		//bday kiddo
		case "0":
			bdayCallback(newArgs, bot, messageArray[2]);
		break;

		default:
			newArgs += ` (frum ${message.author.username})`;
		break;
	}

	return newArgs;
}

module.exports.parseWeather = (result) => {
	let nyc = JSON.parse(JSON.stringify(result, null, 2));

	let json = {
		"low" : nyc[0].forecast[1].low,
		"high" : nyc[0].forecast[1].high,
		"precipChance" : nyc[0].forecast[1].precip,
		"currTemp": nyc[0].current.temperature,
		"feelsLike": nyc[0].current.feelslike,
		"humidity": nyc[0].current.humidity,
		"skyText": nyc[0].current.skytext,
		"observationTime": nyc[0].current.observationTime
	};

	return json;
}

module.exports.returnMention = (mentionCategory, author) => {
	let mentionMsg = "";
	
	switch (mentionCategory)
	{
		case "owner":
			mentionMsg = "<@348208769941110784>";
		break;

		case "band":
			const bandList = [
				"",
				"458997270227058698", 
				"309494444925911041",
				"464229820994158615", 
				"360859374870331414",
				"348208769941110784",
				"436264683909939211",
				"363037388655820813"
			];

			if (bandList.indexOf(author.id) == -1)
			{
				mentionMsg = "smh don't be a rulerbreaker you're not in band";
			}
			else
			{
				mentionMsg = `From ${author}:`;
				let concat = (acc, curr) => acc + ` <@${curr}>`;

				mentionMsg += bandList.reduce(concat);
			}
		break;

		default:
			mentionMsg = "No matches\nIf you don't know the code word, chances are, you can't mass ping";
		break;
	}

	return mentionMsg;
}

//Returns the arguments inside the bot command that is not bounded to a specific argument index - a bounded argument is stuck to a specific array idx
//Usually happens when the user can write any message they like (ie. a message to dm to another discord user)
//Message param requires you to input message.content usually
module.exports.returnUnbound = (message, lastBoundArg) => message.substring(message.indexOf(lastBoundArg) + lastBoundArg.length);

module.exports.rateStatus = (messageArray, args) => {
	if (messageArray.length == 2)
	{
		return 404; //Missing args
	}

	if(!(/\bdiscord\b|\bdiscord's\b|\byoutube\b|\bchrome\b/ig.test(args)) && (messageArray.length > 4))
	{
		return 400; //Substring exploiter
	}

	if (/[^\w\d, .;'@#<>!:?]/ig.test(args))
	{
		return 400; //Illegal Chars
	}

	if ((/light/ig.test(args)))
	{
		return messageArray.length > 5 ? 400 : 202;
	}

	if (/dark/ig.test(args))
	{
		return messageArray.length > 5 ? 400 : 204; //Dark Mode
	}

	if (/amoled/ig.test(args))
	{
		return 203; //Amoled
	}

	return 200;
}

module.exports.slowmodeStatus = (messageArray, messageMember) => {
	if (messageArray.length == 2)
	{
		return 400.0; //Command not found
	}

	if (!messageMember.hasPermission(`BAN_MEMBERS`))
	{
		return 888; //No perms
	}

	//Status codes to start slowmode
	if (messageArray[2] == "start")
	{
		if (messageArray.length == 3) 
		{
			return 400.1; //Missing timer interval
		}

		if (messageArray.length == 4)
		{
			return 400.2; //Missing message limit
		}

		if (isNaN(messageArray[3]) || messageArray[3] < 10)
		{
			return 404.1; //Invalid timer interval
		}

		if (isNaN(messageArray[4]) || (messageArray[4] < 5))
		{
			return 404.2; //Invalid message limit
		}

		return 200.1;
	}

	if (messageArray[2] == "stop")
	{
		return 200.2;
	}

	return 404.3; //Invalid command
}

module.exports.taskDeleteStatus = (args, uColLength, num) => {

	if (args.length == 2)
	{
		return 400; // Delete index does not exist
	}

	if (isNaN(num))
	{
		return 404; //Index is not a number 
	}

	if ((num < 0) || (num > uColLength))
	{
		return 500; //Index out of bounds
	}

	return 200;
}

module.exports.taskEmbed = (taskArray) => {
	let tDisplay = new Discord.MessageEmbed(); 
	tDisplay.setAuthor("Srs Bot", "https://i.imgur.com/Bnn7jox.png");
	tDisplay.setColor('GREEN');
	tDisplay.setTitle("Your Tasks:");

	let description = "";
	taskArray.forEach((currVal, idx) => {
		description += `${idx + 1}) ${currVal}\n`;
	});

	//If it's still empty, encourage the user to write stuff
	if (description == "") 
	{
		description = "<There is nothing here right now, add a task>";
	}

	tDisplay.setDescription(description);
	return tDisplay;
}

//Fetch translateArray from running pure.translateUpdated() yes
module.exports.translate = (translateArray) => new Promise((resolve, reject) => {

	new translator({from: translateArray[0], to: translateArray[1]}).translate(translateArray[2])
		.then(response => resolve(response))
		.catch(() => reject());
});

//Fetch responseData by fetching pure.translate();
module.exports.translateEmbed = (response) => {

	//Corrects a very important chinese translation (hi Cat I know you're snooping here)
	response.text = response.text.includes("egg tart") ? "something about egg pudding" : response.text;

	let translateMessage = new Discord.MessageEmbed(); //Creates a fancy embembed to dm the stuff
	translateMessage.setAuthor("Srs Bot", "https://i.imgur.com/Bnn7jox.png");
	translateMessage.setColor('RANDOM');
	translateMessage.setTitle("Translation");
								
	var descriptionString = response.text;
	descriptionString += response.from.text.didYouMean ? `\n\nIt seems we detected a typo. Do you mean to say: ${response.from.text.value}?`:"";
	translateMessage.setDescription(descriptionString);

	return translateMessage;
}

module.exports.translateHelpEmbed = (jsonArray) => {
	let langMessage = new Discord.MessageEmbed();
	langMessage.setAuthor("Srs Bot", "https://i.imgur.com/Bnn7jox.png");
	langMessage.setColor('GREEN');
	langMessage.setTitle("Translate Syntax");

	let returnString = jsonArray.reduce((cummL, input) => cummL + `${input.lang}: '${input.shortcut}' \n`);
	langMessage.setDescription(returnString);

	return langMessage;
}

module.exports.translateStatus = (messageArray, keywordArray) => {
	const languageArray = [ //Makes sure the translation language is currently supported
		"en", "es", "de", "fr", "pt", "it", "nl", "pl", "ru", "ja", "zh", "el", "ko", "la", "sv", "auto"
	];

	if (messageArray.length < 3)
	{
		return 400.1; //Lang 1 and/or keyword not filled in
	}

	if (messageArray[2] == "help")
	{
		return 300; //Help
	}

	//Checks to see if there is a keyword
	const kwMatch = keywordArray.filter(item => item.keyword == messageArray[2]);
	if (kwMatch.length != 0)
	{
		//If there is a keyword, the rest of the checks are meaningless. This is the only time the switch statement later will default as intended
		return messageArray.length < 4 ? 400.3 : kwMatch; 
	}

	if (messageArray.length < 4)
	{
		return 400.2; //Lang 2 not filled in
	}

	if (messageArray.length < 5)
	{
		return 400.3;
	}

	if (!languageArray.includes(messageArray[2]))
	{
		return 404.1; //Language for first not found
	}

	if (!languageArray.includes(messageArray[3]))
	{
		return 404.2; //Language for second not found. Both 404 errors should not happen if we use shortcut
	}

	return 200;
}

//Returns a more efficient translate array that can be used. 
//If kwMatch doesn't exist, put a random thing in lmao it doesn't matter
module.exports.translateUpdated = (args, messageContent, kwMatch) => {
	
	//If the kwMatch exists then it'll autofill and say that here is an index shift
	let br1 = !kwMatch.kw1 ? args[1] : kwMatch.kw1;
	let br2 = !kwMatch.kw2 ? args[2] : kwMatch.kw2;
	var idxShift = !kwMatch.kw2 ? 1 : 0;

	if (idxShift == 1)
	{
		br1 = args[1] == "zh" ? "zh-CN" : args[1];
		br2 = args[2] == "zh" ? "zh-CN" : args[2];
	}

	//br1 and br2 returns the languages to translate to, index[2] returns the actual string to translate
	return [br1, br2, this.returnUnbound(messageContent, args[1 + idxShift])];
}

module.exports.uppercaseMatch = (message, queryMatch) => message.content.toLowerCase().includes(queryMatch);

module.exports.uwu = (msgContent) => {
	let uwuMsg = msgContent.replace(/[rl]/gmi, "w").substring(8); //This will get rid of srs uwu exactly
	uwuMsg = uwuMsg.replace(/om/gmi, "um");
	uwuMsg = uwuMsg.replace(/be/gmi, "bwe").replace(/de/gmi, "dwe");
	uwuMsg = uwuMsg.replace(/thi/gmi, "thwi");
	uwuMsg = uwuMsg.replace(/ha/gmi, "hwa")
	uwuMsg = uwuMsg.replace(/mo/gmi, "mwo").replace(/so/gmi, "swo").replace(/bo/gmi, "bwo").replace(/do/gmi, "dwo");
	uwuMsg = uwuMsg.replace(/ff/gmi, "fw").replace(/qu/gmi, "qw");

	return uwuMsg;
}

module.exports.warnStatus = (messageArray, messageMember) => {
	if (messageArray.length == 2)
	{
		return 404.1; //Missing warn member
	}

	if (messageArray.length == 3)
	{
		return 404.2; //Missing warn reason
	}

	if (!messageMember.hasPermission(`BAN_MEMBERS`))
	{
		return 888; //No perms
	}

	return 200;
}

module.exports.warnMsg = (messageAuthor, reason) => {
	let warnMessage = new Discord.MessageEmbed(); //Creates a fancy embembed to warn them
	warnMessage.setAuthor("Srs Bot", "https://i.imgur.com/Bnn7jox.png");
	warnMessage.setColor('GOLD');
	warnMessage.setTitle("Warn Message");
	warnMessage.setDescription(`You have been warned by ${messageAuthor.username}! Warn reason:\n${reason}`);

	return warnMessage;
}

module.exports.weatherFind = () => new Promise((resolve, yeet) => {
	weather.find({search: 'New York, NY', degreeType: 'F'}, (reject, result) => {
		if (reject)
		{
			yeet();
		}
		else
		{
			resolve(result);
		}
	});
});

module.exports.weatherRec = (highTemp) => {
	const x = [
		{"max": 0, "message": "Geez when we say to go chill, we don't mean to buy a ticket to Alaska"},
		{"max": 20, "message": "Put on some winter gear, because it's freezing"},
		{"max": 40, "message": "Smh wear that navy blue thing"},
		{"max": 50, "message": "Short sleeve and thick jacket time"},
		{"max": 60, "message": "Wtf it's actually T-Shirt Time?"},
		{"max": 75, "message": "Quick so what JoKang's doing"},
		{"max": 85, "message": "smh go buy a hat or smth"},
		{"max": 100, "message": "you want to go out? don't"},
		{"max": 120, "message": "wtf go move to Canada"},
		{"max": 10000, "message": "What planet do you live on?"},
		{
			"max": 10000000000,
			"message": "Greetings future humans. This is the Diamond Dwerp seal, speaking to you from AD 2020." +
			" Back in my days, we had a civilization called New York City, where we reached high temperatures of around 90 degrees." +
			" Farenheight, that is. Farenheight. It's an American measurement unit. If you are reading this right now, if you manage to " +
			"come across this from srs bot - there is something very, very, very wrong. You see, the temperature here should be... abnormal " +
			"... but this seems to be New York City now. It's not what it used to be - leave. NOW."
		}
	]

	//The first object in this array is the most appropriate value for the situation since it is just above the minimum num threshold
	let matches = x.filter((json) => {
		return highTemp < json.max;
	});

	return matches[0].message;
}