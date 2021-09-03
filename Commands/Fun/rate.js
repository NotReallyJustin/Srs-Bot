const Helpy = require("../Helpy.js");

const { response } = require("./Defense Arsenal/Response.js");
const { darkMode } = require("./Defense Arsenal/Response.js");
const { negations } = require("./Defense Arsenal/Opposite.js");
const afinn = require("./Defense Arsenal/Afinn.json");

module.exports = {
	name : "rate",
	description : "Give srs bot a statement, and he'll rate it out of 10! No illegal chars btw",
	options: [
		{
			name: "item",
            description: "Glory to light mode, and its everlasting reign!",
            required: true,
            type: "STRING"
		} //Ok at this point we're not even hiding that this is light mode propaganda lmao
	],
	execute: (interaction) => {
		const item = interaction.options.getString("item", true);

		if (!item)
		{
			interaction.reply('smh what am I supposed to rate?');
			return;
		}

		if (/[^\w\d, .;'@#<>!:?]/ig.test(item)) //Illegal Chars
		{
			interaction.reply(Helpy.randomResp(response));
			return;
		}

		//Could be a good time to perform machine learning association
		if (/\btheme\b|\bmode\b|\bdiscord\b|\bthemes\b|\bmodes\b/gmi.test(item))
		{
			var b1 = /light\b|white\b|justin\b/gmi.test(item);
			var b2 = /dark\b|black\b|amoled\b/gmi.test(item);

			if (b1 || b2)
			{
				let x = rateAlg(item, b1);

				if (x)
				{
					interaction.reply("I give 10/10, if not 11/10");
				}
				else
				{
					var e = Helpy.randomResp(darkMode);
					interaction.reply(e);
				}
			}
			else
			{
				interaction.reply(`I give ${Math.round(Math.random() * 10)}/10`); //false alarm
			}

			return;
		}

		interaction.reply(`I give ${Math.round(Math.random() * 10)}/10`);
	}
}

//Returns a boolean expressing if sentiment is pro or anti light mode
const rateAlg = (txt, proLight) => {
	if (testNegation(txt)) proLight = !proLight;

	var lupical = 0;
	for (var word of txt.split(" "))
	{
		var stem = findSTEM(word);
		if (afinn[stem] != undefined)
		{
			lupical += afinn[stem];
		}
	}

	//Mathematically determines whether pro or anti light
	if (lupical < 0)
	{
		proLight = !proLight;
	}

	return proLight;
}

//Returns a boolean indicating if the text is negating anything
//Accounts for : !randomText and anything in capturing groups
const testNegation = (txt) => {
	var num = 0;

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

	return num % 2 == 1;
}

/*Porter Stemmer alg.
https://tartarus.org/martin/PorterStemmer/def.txt
This works due to the suffixes having extra 'syllables' compared to the root word*/
const findSTEM = (txt) => {
	
	//Algorithm begins here
	//Class to store the rules
	function StemmerRule(preCon, regEx, replacement, postCon)
	{
		this.preCon = preCon != undefined ? preCon : () => true;
		this.regEx = regEx;
		this.replacement = replacement;
		this.postCon = postCon != undefined ? postCon : () => {};
	}

	//Only works with an array of StemmerRule objects
	let traverse = (arr) => {
		for (var rule of arr)
		{
			if (rule.preCon() && rule.regEx.test(txt))
			{
				txt = txt.replace(rule.regEx, rule.replacement);
				rule.postCon();
				/*console.log(txt);
				console.log(rule);
				console.log('--');*/
				break;
			}
		}
	}
	
	//1a
	traverse([
		new StemmerRule(undefined, /sses+$/mi, 'ss'),
		new StemmerRule(undefined, /ies+$/mi, 'i')
	]);

	traverse([
		new StemmerRule(undefined, /ss+$/mi, 'ss'),
		new StemmerRule(undefined, /s+$/mi, '')
	]);

	//1b
	var contraverse = false;
	traverse([
		new StemmerRule(() => countM(txt, 'eed') > 0, /eed+$/mi, 'ee'),
		new StemmerRule(() => containsVowel(txt, 'ed'), /ed+$/mi, '', () => {contraverse = true}),
		new StemmerRule(() => containsVowel(txt, 'ing'), /ing+$/mi, '', () => {contraverse = true})
	]);

	if (contraverse)
	{
		traverse([
			new StemmerRule(undefined, /at+$/mi, 'ate'),
			new StemmerRule(undefined, /bl+$/mi, 'ble'),
			new StemmerRule(undefined, /iz+$/mi, 'ize'),
			new StemmerRule(() => txt.length >= 2 && txt[txt.length - 1] == txt[txt.length - 2] && /(?<![aeiou])y|[aeioulsz]/.test(txt.length[txt.length - 1]), /..$/mi, txt[txt.length - 1]),
			new StemmerRule(() => {
				var obj = endMCVC(txt);
				return obj.cvc && obj.m == 1;
			}, /$/mi, 'e')
		]);
	}

	traverse([new StemmerRule(() => containsVowel(txt, 'y'), /y+$/mi, 'i')]);

	//2

	//This matrix only requires the transformation
	//ie. If it says 'c -> e', put [e, c] in the matrix
	let ezTraverse = (matrix, m) => {
		for (var item of matrix)
		{
			var regEx = new RegExp(`${item[0]}+$`, 'mi');
			if (countM(txt, item[0]) > m && regEx.test(txt))
			{
				txt = txt.replace(new RegExp(`${item[0]}+$`, 'mi'), item[1]);
				/*console.log(txt);
				console.log(item);
				console.log('--');*/
				break;
			}
		}
	}

	ezTraverse([
		['ational', 'ate'],
		['tional', 'tion']
	], 0);

	ezTraverse([
		['enci', 'ence'],
		['anci', 'ance'],
		['izer', 'ize'],
		['abli', 'able'],
		['alli', 'al'],
		['entli', 'ent'],
		['eli', 'e'],
		['ousli', 'ous'],
		['ization', 'ize'],
		['ation', 'ate'],
		['ator', 'ate'],
		['alism', 'al'],
		['iveness', 'ive'],
		['fulness', 'ful'],
		['ousness', 'ous'],
		['aliti', 'al'],
		['iviti', 'ive'],
		['biliti', 'ble']
	], 0);

	//Step 3
	ezTraverse([
		['icate', 'ic'],
		['ative', ''],
		['alize', 'al'],
		['iciti', 'ic'],
		['ical', 'ic'],
		['ful', ''],
		['ness', '']
	], 0);

	//Step 4
	//Adjusted some stuff from research paper bc not fit
	ezTraverse([
		['al', 'e'],
		['ance', ''],
		['ence', ''],
		['er', 'e'],
		['ic', 'e'],
		['able', ''],
		['ible', ''],
		['ant', ''],
		['ement', 'e'],
		['ment', ''],
		['ent', ''],
		['ou', ''],
		['ism', ''],
		['ate', 'e'],
		['iti', ''],
		['ous', ''],
		['sive', 'd'],
		['ive', ''],
		['ize', '']
	], 1);

	//Step 5a
	traverse([new StemmerRule(() => countM(txt, 'ion') > 1 && txt.length >= 4 && /[st]/mi.test(txt[txt.length - 4]), /ion+$/mi, '')]);

	//ezTraverse(['e', ''], 1);
	ezTraverse(['ipt', 'ibe'], 0);
	traverse([new StemmerRule(() => {
		var x = endMCVC(txt, 'e');
		return x.m == 1 && !x.cvc;
	}, /e+$/mi, '')]);

	//Step 5b (final step!!!)
	traverse([new StemmerRule(() => txt.length >= 2 && countM(txt, 'll') > 1 && /ll+$/gmi.test(txt), /ll+$/mi, 'l')]);

	return txt;
}

//Stemming algorithm helper method to count M.
//toBeExcluded is optional, but if you include it, this will remove the items to be excluded before counting M
//if not, it'll function just fine with the str
const countM = (str, toBeExcluded) => {
	if (toBeExcluded) str = unSTEM(str, toBeExcluded);

	//Regex the empty space in front and behind a repeating vowel chain
	var vcFormat = str.split(/(?=(?<![aeiou])[aeiouy])|(?<=[aeiouy](?![aeiouy]))/gmi);
	var shiftDist = vcFormat.length;
	
	//Detects first and last item for c and v respectively, and then we could maths our way to finding m
	if (!containsVowel(vcFormat[0]))
	{
		shiftDist--;
	}

	if (containsVowel(vcFormat[vcFormat.length - 1]))
	{
		shiftDist--;
	}

	return Math.floor(shiftDist / 2);
}

//Helper method to remove stem from something
const unSTEM = (str, toBeExcluded) => {
	return str.replace(new RegExp(toBeExcluded + '+$', 'mi'), '');
}

//Same stuff applies from countM, it's just that it returns whether or not it has a vowel now
const containsVowel = (str, toBeExcluded) => {
	if (toBeExcluded) str = unSTEM(str, toBeExcluded);
	var vowel = /(?<![aeiou])y|[aeiou]/gmi;

	return /(?<![aeiou])y|[aeiou]/gmi.test(str);
}

//Does it end in cvc but second c is not W, X, or Y. Counts m at the same time because why not
const endMCVC = (str, toBeExcluded) => {
	if (toBeExcluded) str = unSTEM(str, toBeExcluded);
	var cvc = false;

	//Regex the empty space in front and behind a repeating vowel chain
	var vcFormat = str.split(/(?=(?<![aeiou])[aeiouy])|(?<=[aeiouy](?![aeiouy]))/gmi);
	var shiftDist = vcFormat.length;

	//Detects first and last item for c and v respectively, and then we could maths our way to finding m
	if (!containsVowel(vcFormat[0]))
	{
		shiftDist--;
	}

	if (containsVowel(vcFormat[vcFormat.length - 1]))
	{
		shiftDist--;
	}

	if (str.length >= 3)
	{
		cvc = !containsVowel(str[str.length - 3]) && containsVowel(str[str.length - 2]) && !/(?<![aeiou])y|[aeiouwxy]/mi.test(str[str.length - 1]);
	}

	return {cvc: cvc, m: Math.floor(shiftDist / 2)};
}

module.exports.rateAlg = rateAlg;
module.exports.response = require("./Defense Arsenal/Response.js");