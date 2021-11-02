//Takes an input in the form of a relation extraction tree from RelationExtraction.js and then parses it
//Returns + or - depending on whether the sentence is pro or anti-light mode
//Input the root 'node'
const { SimpleMap } = require("../../Helpy.js");
const afinn = require("./Afinn.json");
const modeWords = new SimpleMap([
	"mode",
	"theme",
	"color",
	"style"
]);

const lightMode = new SimpleMap([
	"light",
	"white",
	"bright",
]);

const darkMode = new SimpleMap([
]);

const justinRelLight = {
	"justin": new SimpleMap(["use", "have", "look"])
	"seal": new SimpleMap(["use", "have", "look"])
};

const justinRelDark = {
};

module.exports.sentimentAnalysis = (root) => {
	const tracker = [...root.children].map(sentence => sentence.children).flat();
	var total = 0;
	tracker.forEach(el => {
		//Rechecking mode each time to prevent random adjectives like "ice cream is good and light mode bad"
		if (el.type == "VERB" && el.subject)
		{
			var subjectMode = testContainMode(el.subject);
			var objectMode;
			if (el.object) objectMode = testContainMode(el.object);

			if (subjectMode != "none")
			{
				isLight = subjectMode == "light";
				attackDark = objectMode && objectMode == "dark";
				el.children.forEach(yeet => {
					if (afinn[yeet.string])
					{
						if (isLight && attackDark)
						{
							total += Math.abs(afinn[yeet.string]);
						}
						else if (!isLight)
						{
							total += Math.min(afinn[yeet.string], -1 * afinn[yeet.string]);
						}
					}
				});
			}
			else if (objectMode && objectMode != "none")
			{
				el.children.forEach(yeet => {
					if (afinn[yeet.string])
					{
						if (objectMode == "dark")
						{
							total -= afinn[yeet.string];
						}
						else if (objectMode == "light")
						{
							total += afinn[yeet.string];
						}
					}
				});
			}
		}
		else if (el.type == "ADJECTIVE" && el.subject)
		{
			var subjectMode = testContainMode(el.subject);
			if (subjectMode != "none")
			{
				isLight = subjectMode == "light";
				el.children.forEach(yeet => {
					if (afinn[yeet.string])
					{
						total += isLight ? afinn[yeet.string] : afinn[yeet.string] * -1;
					}
				});
			}
		}
	});

	return total;
}

/*Tests whether a chunk is referring to a light or dark mode.
This also jots the determined result down so it won't have to calculate it in the future
code: "light", "dark", "none" 
AMOLED isn't a bad theme so it doesn't do anything with that
Precondition: Use only on NP
***JUSTIN LEMMATIZE THIS THING && Work on NOT */
const testContainMode = (chunk) => {
	if (chunk.modeType) return chunk.modeType;

	var negations = testNegation(chunk.string);
	var mentionLight = false;
	var mentionDark = false;
	var mentionMode = false;

	chunk.children.forEach(word => {
		var wordLoCase = word.string.toLowerCase();
		var subjectLoCase = word.subject ? word.subject.string.toLowerCase() : "";
		if (word.type == "NOUN")
		{
			if (modeWords[wordLoCase]) mentionMode = true;
		}
		else if (word.type == "VERB")
		{
			if (justinRelLight[subjectLoCase])
			{
				if (justinRelLight[subjectLoCase][wordLoCase])
				{
					mentionLight = true;
				}
				else if (afinn[wordLoCase])
				{
					if (afinn[wordLoCase] > 0)
					{
						mentionLight = true;
					}
					else
					{
						mentionDark = true;
					}
				}
			}
		}
		else if (word.type == "ADJECTIVE")
		{
			if (lightMode[wordLoCase]) mentionLight = true;
			if (darkMode[wordLoCase]) mentionDark = true;
		}
	});

	var res = "none";
	if (mentionMode)
	{
		if (mentionLight)
		{
			res = !negations ? "light" : "dark";
		}
		else if (mentionDark)
		{
			res = !negations ? "dark" : "light";
		}
	}

	chunk.modeType = res;
	return res;
}

const testNegations = (txt) => {
	//Test --> Not conscious and not happy --> 2 nots, but we don't count them as 2, we only count as 1 not together
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

const cleanseContractions = (sentence) => {
	const patterns = {
		"won't": "will not",
		"can't": "can not",
		"n't": " not",
		"'s": "",
		"'re": " are",
		"'d": " would",
		"'ll": " will",
		"'ve": " have",
		"'m": " am"
	};

	for (var pattern of Object.keys(patterns))
	{
		sentence = sentence.replace(new RegExp(pattern, 'gmi'), patterns[pattern]);
	}

	return sentence;
}