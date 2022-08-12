/*	
	Srs Bot's helpful toolkit that's carried around!
	All functions here are still pure, but it's a utility js file now.
	Also fun fact, did you know Helpy is a cute animatronic in FNAF 6? 
	Don't worry too much abt it lmao, we're not forcing him to jump off a plank here
	While you're here, watch this funny video:
	https://www.youtube.com/watch?v=v9M55TfKzcQ 
*/
const Discord = require("Discord.js");

/**
 * Takes a random array and yeets something from it
 * @param {Array} arr arr you ready? Aye aye captain! Who lives in a pineapple under the sea? Spongebob [Rectangular Prism] pants!(He's not a square)
 * @returns A bird? A plane? Anything probably!
 */
module.exports.randomResp = (arr) => {
	return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * @param {String} str I want a stracciatella ice cream rn
 * @returns {String} The exact same thing that went in but we just passed the SAT grammar section
 */
module.exports.capFirst = (str) => str.substring(0, 1).toUpperCase() + str.substring(1);

/**
 * Defunct function from pre-v13 days.
 * Returns the arguments inside the bot command that is not bounded to a specific argument index - a bounded argument is stuck to a specific array idx
 * Usually happens when the user can write any message they like (ie. me spamming Discord HQ with srs dm to give me free nitro)
 * @param {String} msgContent message.content
 * @param {String} lastBoundArg It *was* the last bound argument name but noone knows what that means anymore because slash commands
 * @returns {String} Unbound section of string
 */
module.exports.returnUnbound = (msgContent, lastBoundArg) => msgContent.substring(msgContent.indexOf(lastBoundArg) + lastBoundArg.length);

/**
 * Combines discord attachments and the message content to form one huge msg blob that we can just send a once o.o
 * @param {String} msgContent 
 * @param {Discord.Attachment[]} attachArray 
 * @returns https://plantsvszombies.fandom.com/wiki/Zom-Blob
 */
module.exports.messageCompile = (msgContent, attachArray) => attachArray.reduce((acc, attachment) => acc + attachment.url + "\n", msgContent).replace("@everyone", "No you can't tag everyone.");

/**
 * Date 1 is current date, date 2 is target date - 1000ms in a sec, 3600s in an hr, 24hr in a day
 * @param {Date} date1 Current Date
 * @param {Date} date2 Target Date
 * @returns {Number} How long away Date1 is from Date2 in days
 */
module.exports.dateDistance = (date1, date2) => Math.floor((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24));

/**
 * @param {(Discord.Interaction | Discord.Message)} identifier The event you're responding to
 * @param {(Discord.PermissionsBitField.Flags | Discord.PermissionsBitField.Flags[])} permission Permission(s) to check
 * @returns Whether bot has permission in said channel (also known as "day 5432252 of asking Gabe to give Srs Bot admin perms")
 */
module.exports.hasChannelPerm = (identifier, permission) => identifier.guild.members.me.permissionsIn(identifier.channel).has(...([permission].flat()));

/**
 * @param {(Discord.Interaction | Discord.Message)} identifier The event you're responding to
 * @param {(Discord.PermissionsBitField.Flags | Discord.PermissionsBitField.Flags[])} permission Permission(s) to check
 * @returns Gabe pls enable admin perms
 */
module.exports.hasGuildPerm = (identifier, permission) => identifier.guild.members.me.permissions.has(...([permission].flat()));

/**
 * Adjusts the timezones after user gives us the time
 * @param {String} time UTC formatted time. Don't worry abt this because the bot does that 
 * @param {String} tmz INTL convention timezone. If you oof up this defaults to `America/New_York` because New York #1 (hey that's our news channel!)
 * @returns New time
 */
module.exports.tmzConvert = (time, tmz) => {
	try
	{
		return new Date(time).toLocaleString("en-US", {"timeZone": tmz});
	}
	catch //if it fails just default to NY lmao
	{
		return new Date(time).toLocaleString("en-US", {"timeZone": "America/New_York"});
	}
};

/**
 * I don't think this is how you're supposed to write a merge sort but I haven't taken Data Structures & Algorithms so mald harder 🤡
 * This thing doesn't track indexes and just arr.slice over 9000 times
 * @param {Array} arr I wonder what this stands for
 * @param {Function} comparison Callback. (a, b) => {return boolean with a or b, depending on what you want to put in the front}. Oh yea Helpy has presets
 * @returns {Array} VSC won't gimme function autocomplete if I don't use JSDocs 😭
 */
module.exports.mergeSort = (arr, comparison) => {
	if (arr.length == 1)
	{
		return arr;
	}

	var left = this.mergeSort(arr.slice(0, Math.floor(arr.length / 2)), comparison);
	var right = this.mergeSort(arr.slice(Math.floor(arr.length / 2)), comparison);

	for (var l = 0, r = 0, i = 0; i < arr.length; i++)
	{
		if (l >= left.length) 
		{
			arr[i] = right[r];
			r++;
		}
		else if (r >= right.length || comparison(left[l], right[r])) //Short circuit the r >= right.length
		{
			arr[i] = left[l];
			l++;
		}
		else
		{
			arr[i] = right[r];
			r++;
		}
	}

	return arr;
}

/**
 * 
 * @param {*} arr 
 * @param {*} item 
 * @returns Index of thingy you wanna find 
 */
module.exports.binarySearch = (arr, item) => {
	var found = -1;
	for (var left = 0, right = arr.length, middle = Math.floor(arr.length / 2); left <= right; middle = Math.floor((left + right) /2))
	{
		if (arr[middle] < item)
		{
			left = middle + 1;
		}
		else if (arr[middle] > item)
		{
			right = middle - 1;
		}
		else if (arr[middle] == item)
		{
			found = middle;
			break;
		}
	}

	return found;
}

//THIS IS NOT A TRADITIONAL BINARY SEARCH!! DO NOT USE IT THAT WAY!!!
//If comparison(item) returns 0, then the function will shove that in an array. -1 is too small, 1 is too big.
//Return case 2 to stop the search
//This function will then return the array - not the index .-.
//Also pls sort arr before chugging it in thx
module.exports.binArr = (arr, comparison) => {
	let toOut = [];
	let found;

	for (var left = 0, right = arr.length, middle = Math.floor(arr.length / 2); left <= right; middle = Math.floor((left + right) / 2))
	{
		switch(comparison(arr[middle]))
		{
			case 0:
				found = middle;
				left = right + 1; //Halt the loop
			break;

			case -1:
				left = middle + 1;
			break;

			case 1:
				right = middle - 1;
			break;

			case 2:
				left = right + 1;
			break;
		}
	}

	//Linear search the top and bottom and shove the stuff that fits inside toOut
	if (found != undefined)
	{
		for (var i = found; i < arr.length && comparison(arr[i]) == 0; i++)
		{
			toOut.push(arr[i]);
		}

		for (var i = found; i >= 0 && comparison(arr[i]) == 0; i--)
		{
			if (i == found) continue;
			toOut.unshift(arr[i]);
		}
	}
	
	return toOut;
}

//Creates a button that performs a simple interaction that checks only for and userID, customID
//Will expire after like 5 minutes. Also pls provide a callback
module.exports.buttonInteract = (message, userID, customID, callback) => {
	const filter = interaction => interaction.customId == customID && interaction.user.id == userID;
	let eventListener = message.createMessageComponentCollector({
		filter,
		time: 300000
	});

	eventListener.on("collect", i => {
		callback(i);
	});
	eventListener.once("end", () => {
	});
}

//-----------------------------------------Comparison Shortcut Codes---------------------------------

//If lexico compares the english lexicon, does dexico compare decimal numbers?
//Alright I'll stop lol I'm not Becc so I won't make dn jokes
module.exports.dexico = (num) => (a) => {
	if (a < num) return -1;
	if (a > num) return 1;
	if (a == num) return 0;
}

//A lexicographic search query to put in binArr, but it's like a shortcut
//This basically just orders everything and converts it into lowercase
module.exports.lexico = (word) => {
	var lcw = word.toLowerCase();

	return (a) => {
		var acw = a.toLowerCase();
		if (acw < lcw) return -1;
		if (acw > lcw) return 1;
		if (acw == lcw) return 0;
	}
}

//Lexicographuc ordering, but make sure that we're doing it by lowercase
module.exports.lexicoComparison = (a, b) => a.toLowerCase() < b.toLowerCase();

//Adapted version of kuwamoto's pluralize algorithm
String.plural = {
    '(quiz)$'               : "$1zes",
    '^(ox)$'                : "$1en",
    '([m|l])ouse$'          : "$1ice",
    '(matr|vert|ind)ix|ex$' : "$1ices",
    '(x|ch|ss|sh)$'         : "$1es",
    '([^aeiouy]|qu)y$'      : "$1ies",
    '(hive)$'               : "$1s",
    '(?:([^f])fe|([lr])f)$' : "$1$2ves",
    '(shea|lea|loa|thie)f$' : "$1ves",
    'sis$'                  : "ses",
    '([ti])um$'             : "$1a",
    '(tomat|potat|ech|her|vet)o$': "$1oes",
    '(bu)s$'                : "$1ses",
    '(alias)$'              : "$1es",
    '(octop)us$'            : "$1i",
    '(ax|test)is$'          : "$1es",
    '(us)$'                 : "$1es",
    '([^s]+)$'              : "$1s"
};

String.singular = {
    '(quiz)zes$'             : "$1",
    '(matr)ices$'            : "$1ix",
    '(vert|ind)ices$'        : "$1ex",
    '^(ox)en$'               : "$1",
    '(alias)es$'             : "$1",
    '(octop|vir)i$'          : "$1us",
    '(cris|ax|test)es$'      : "$1is",
    '(shoe)s$'               : "$1",
    '(o)es$'                 : "$1",
    '(bus)es$'               : "$1",
    '([m|l])ice$'            : "$1ouse",
    '(x|ch|ss|sh)es$'        : "$1",
    '(m)ovies$'              : "$1ovie",
    '(s)eries$'              : "$1eries",
    '([^aeiouy]|qu)ies$'     : "$1y",
    '([lr])ves$'             : "$1f",
    '(tive)s$'               : "$1",
    '(hive)s$'               : "$1",
    '(li|wi|kni)ves$'        : "$1fe",
    '(shea|loa|lea|thie)ves$': "$1f",
    '(^analy)ses$'           : "$1sis",
    '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$': "$1$2sis",        
    '([ti])a$'               : "$1um",
    '(n)ews$'                : "$1ews",
    '(h|bl)ouses$'           : "$1ouse",
    '(corpse)s$'             : "$1",
    '(us)es$'                : "$1",
    's$'                     : ""
};

String.irregular = {
    'move'   : 'moves',
    'foot'   : 'feet',
    'goose'  : 'geese',
    'sex'    : 'sexes',
    'child'  : 'children',
    'man'    : 'men',
    'tooth'  : 'teeth',
    'person' : 'people'
};

String.uncountable = [
    'sheep', 
    'fish',
    'deer',
    'moose',
    'series',
    'species',
    'money',
    'rice',
    'information',
    'equipment'
];

module.exports.pluralize = (str, revert) => {
	if (String.uncountable.indexOf(str.toLowerCase()) >= 0)
	{
		return 404;
	}

	for (word in String.irregular)
	{
		if (revert)
		{
            var pattern = new RegExp(irregular[word]+'$', 'i');
            var replace = word;
      	} 
      	else
      	{ 
      		var pattern = new RegExp(word+'$', 'i');
            var replace = irregular[word];
      	}
      	if (pattern.test(str)) return this.replace(pattern, replace);
	}

	var array = revert ? singular : plural;
	for (reg in array)
	{
		var pattern = new RegExp(reg, 'i');

		if (pattern.test(str)) return str.replace(pattern, array[reg]);
	}

	return str;
}
//-------------------------- Easy Classes---------------------------------

//Shortcut to construct a JSON "map" with all values set to true to denote that they exist
//Has limited map functions because, well, it's made to be a shortcut tool
module.exports.SimpleMap = function(itemArr) {
	for (var item of itemArr)
	{
		this[item] = true;
	}
};