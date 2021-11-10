const fs = require('fs');
const readline = require('readline');
const leScan = readline.createInterface({
	input: fs.createReadStream('./LemmaData.txt'),
	output: process.stdout,
	clrfDelay: Infinity,
	terminal: false
});

//Intializes the dictionary
//This feels really computationally expensive
basesLoaded = false;
dictionary = new Map(); //Map<Word, Lemma>

leScan.on('line', txt => {
	//Format: ie. Eat ate eaten
	var lemmas = txt.split(" ");
	for (var i = lemmas.length - 1; i > 0; i--)
	{
		if (!dictionary.get(lemmas[i].toLowerCase()))
		{
			dictionary.set(lemmas[i].toLowerCase(), lemmas[0].toLowerCase());
		}
	}
});

leScan.on('close', txt => {
	basesLoaded = true;
});

//Uses a dictionary to lemmatize something according to how we want it
//If it fails, import porter stemmer as a last resort
//I don't think? we'll need the pos tbh since we gave stemmer
module.exports.lemmatize = (word, pos) => {
	if (!basesLoaded) throw "Dictionary not fully imported yet, please wait";

	var fetched = dictionary.get(word.toLowerCase());
	//return fetched ? fetched : findSTEM(word);
	return fetched ? fetched : possibleLemmatize(word, pos);
}

//Kit to lemmatize things not in dictionary
//https://github.com/takafumir/javascript-lemmatizer/blob/master/js/lemmatizer.js
const subs = {
    NOUN: 
    [
      	[/ies$/gmi,  'y'  ],
      	[/ves$/gmi,  'f'  ],
      	[/men$/gmi,  'man']
    ],
    VERB: 
    [
      	[/ies$|ied$/gmi, 'y'],
      	[/cked$/gmi, 'ck'],
     	[/able$/gmi, 'e']
    ],
    ADJECTIVE:  
    [
	    [/ier$|iest$/gmi, 'y']
    ],
    ADVERB:  
    [
      	[/ier$|iest$/gmi, 'y']
    ]
};

const possibleLemmatize = (word, pos) => {
	//Catch complex hanging fruit
	if (subs[pos])
	{
		subs[pos].forEach(tuple => {
			if (tuple[0].test(word))
			{
				return tuple[0].replace(tuple[0], tuple[1]);
			}
		})
	}

	switch (pos)
	{
      	case 'VERB':
      		if (/es$/gmi.test(word))
      		{
      			if (/[^se]{1}s$/gmi.test(word))
      			{
      				return word.substring(0, word.length - 1);
      			}
      			return word.substring(0, word.length - 2);
      		}
      		else if (/[^i|ck]{1}ed$/gmi.test(word))
      		{
      			//d is not a duplicate
      			if (/([^aeiou])\1ed$/gmi)
      			{
      				return word.substring(0, word.length - 3);
      			}
      			else if (/[cod|erat|erad|reat|cap|rat|rad]{1}ed$/gi.test(word))
      			{
      				return word.substring(0, word.length - 1);
      			}
      			return word.substring(0, word.length - 2);
      		}
      		else if (/ing$/gmi.test(word))
      		{
      			if (/([^aeiou])\1ing$/gmi)
      			{
      				return word.substring(0, word.length - 4);
      			}
      			else if (/[cod|erat|erad|reat|cap|rat|rad]{1}ing$/gi.test(word))
      			{
      				return word.substring(0, word.length - 3) + "e";
      			}
      			return word.substring(0, word.length - 1) + "e";
      		}
        break;
      	case 'NOUN':
        	if (/es$/gmi.test(word))
        	{
        		return word.substring(0, word.length - 2);
        	}
        	else if (/[^as|u|es|os|us|s]{1}s$/gmi.test(word))
        	{
        		return word.substring(0, word.length - 1);
        	}
        break;
        case "ADVERB":
      	case 'ADJECTIVE':
        	if (/er$/gmi.test(word))
        	{
        		//Detects double consonants
        		if (/([^aeiou])\1er$/gmi.test(word))
        		{
        			return word.substring(0, 3);
        		}
        		return word.substring(0, word.length - 2);
        	}
        	else if (/est$/gmi.test(word))
        	{
        		if (/([^aeiou])\1est$/gmi)
        		{
        			return word.substring(0, 4);
        		}
        		return word.substring(0, word.length - 2);
        	}
        break;
	}
	return word;
}
//---------------------------------------------------------------------------
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