//PART == infinitive particle, SCONJ == Subordinating Conjunction
const fs = require('fs');
const readline = require('readline');
const { findSTEM, cleanseContractions } = require('../rate.js');

const leScan = readline.createInterface({
	input: fs.createReadStream('./PosData.txt'),
	output: process.stdout,
	clrfDelay: Infinity,
	terminal: false
});

//class to store info
class ProbTrack
{
	constructor()
	{
		this.total = 0;
	}

	addProb(probType)
	{
		if (!this[probType]) this[probType] = 0;
		this[probType]++;
		this.total++;
	}

	calcProb(probType)
	{
		if (!this.total) return 0;
		return this[probType] / this.total;
	}
}

class POS extends ProbTrack {}
class Word extends ProbTrack {}

//Custom made data type - this acts like everything HashMap, but it creates a hashmap slot when you try to grab something that doesn't exist
//It usually makes more sense to make a function, but Ima probs migrate this to Database.js
class AutoMap extends Map 
{
	//@param Blueprint<T> The class to create if the map returns undefined
	//The constructor will soft-lock the data type of the map though
	constructor(Blueprint){
		super();
		this.Blueprint = Blueprint;
	}

	get(item)
	{
		if (super.get(item) == undefined)
		{
			super.set(item, new this.Blueprint());
		}

		return super.get(item);
	}
}

const wordMap = new AutoMap(Word);
const posMap = new AutoMap(POS);

let previousPOS = 'SPACE';

leScan.on('line', txt => {
	if (txt == '')
	{
		previousPOS = 'SPACE';
	}
	else
	{
		let arr = txt.split('\t');
		wordMap.get(arr[0].toLowerCase()).addProb(arr[1]);
		posMap.get(previousPOS).addProb(arr[1]);
		previousPOS = arr[1];
	}
});

leScan.on('close', () => {
	/*let e = fs.readFileSync('./PosInput.txt', {encoding: 'utf8'});
	let data = "";

	for (var item of e.split(". "))
	{
		var toRet = calculate(item);
		let str = toRet.reduce((cumL, curr) => cumL + `${curr[0]}\t${curr[1]}\n`, "") + '\n';
		data += str;
	}

	fs.writeFileSync('./PosTrained.txt', data);*/

	let calc = calculate("Flashbangs have been more effective in blinding people than dark mode.");
	console.dir(chunk(calc));
});

//Use these as a temporary substitute against new words
const standardKeys = {
	NOUN: null,
	VERB: null,
	PNOUN: null,
	ADJECTIVE: null,
	ADVERB: null,
	DETERMINER: null,
	AUX: null, 
	PNOUN: null,
	NUMBER: null,
	ADPOSITION: null,
	SCONJ: null,
	CONJUNCTION: null
};

const calculate = (wordSentence) => {
	let txt = wordSentence.replace(/,/g, ' ,').replace(/:/g, ' :').replace(/\./g, ' .').replace(/!/g, ' !').replace(/"/g, '').replace(/\?/g, ' ?');
	txt = cleanseContractions(txt);
	let splitted = txt.split(" ");
	let matrix = [];

	//Staying away from recursion because JS callstack is smol
	splitted.forEach((word, i) => {
		var construct = [];
		var mapPos = wordMap.get(word.toLowerCase());
		//If word undefined, just assume it doesn't matter later down the line and give it a value of 1 to not mess with calculation
		var obfuscate = mapPos.total == 0;
		if (obfuscate) mapPos = standardKeys;

		Object.keys(mapPos).forEach(key => { //The key here is now NOUN, PNOUN, etc...
			var prob = obfuscate ? 1 : mapPos.calcProb(key);
			if (key != "total" && prob != 0)
			{
				var max = 0;
				var pastRec = [];

				//Matches current POS with the POS in matrix[i - 1] and then returns the max that we'll later DP with
				if (i - 1 < 0)
				{
					max = posMap.get('SPACE').calcProb(key);
				}
				else
				{
					matrix[i - 1].forEach(item => {
						var digit = item.probs * posMap.get(item.pos).calcProb(key);
						if (digit > max)
						{
							max = digit;
							pastRec = item.record;
						}
					});
				}

				try
				{
					[...pastRec];
				}
				catch(err)
				{
					console.log(word);
				}

				construct.push({probs: (prob * max), pos: key, record: [...pastRec, key]});
			}
		});

		matrix.push(construct);
		if (i != 0) matrix[i - 1] = null; //Carl Bot take out the trash please it's 11:59PM on the Tech Server
	});

	let maxPath;
	matrix[matrix.length - 1].forEach(obj => {
		if (!maxPath || obj.probs > maxPath.probs)
		{
			maxPath = obj;
		}
	});

	let toRet = [];
	for (var i in splitted)
	{
		toRet[i] = [splitted[i], maxPath.record[i]];
	}

	return toRet;
}

/*Chunks the already POS tagged into nouns that we could use later on for Srs Rate
This uses RegEx chunking but syntax might be a bit weird since there's like nothing out there on JS chunking
Le function uses a top-down approach where the more fancier stuff gets RegEx tagged first, and then the less fancy stuff does
The more fancy stuff takes precedence, and we chunk those words out of the equation when they do get detected.
Also adds POSWords so we can easily tell what chunk they're part of */
const chunkItem = (chunkArr, posWord, posTags) => {
	let np = [];
	let positions = new Map();
	var k = 0;
	let posStr = posTags.reduce((cumL, curr) => {
		positions.set(cumL.length, {occupied: false, k: k++});
		return `${cumL} ${curr[1]}`;
	}, "").trim() + " ";

	for (var regEx of chunkArr)
	{
		var matchArr = posStr.match(regEx);
		if (matchArr == null) continue;

		for (var matchRes of matchArr)
		{		
			for (var adjust = 0, idx = posStr.indexOf(matchRes, adjust); idx != -1 && idx < posStr.length; idx = posStr.indexOf(matchRes, adjust))
			{
				var grab = positions.get(idx);
				if (grab == undefined || grab.occupied)
				{
					adjust = idx + 1;
				}
				else
				{
					np.push([]);
					var cdx = 0;
					for (var chartDex of positions.keys())
					{
						if (+chartDex >= idx && +chartDex < idx + matchRes.length)
						{		
							//Weknow idx = 68s
							positions.get(chartDex).occupied = true;
							np[np.length - 1].push([...posTags[positions.get(chartDex).k], cdx, posWord]);
						}
						cdx++;
					}
					break;
				}
			}
		}
	}
	return np;
}

/*
Noun chunk, but we just used partial application on that
ie. The weird Miku Cult that laundered money got disbanded
This triggers both <ADJ> <PNOUN> <NOUN> <SCONJ> <VERB> <NOUN> and <ADJ> <PNOUN> <NOUN>, but the former takes precedence
@param posTags - array of stuff that went through the POS tagger chronologically. This param will not be changed

For the regEx arrays -->
0) Annoying, angry cat that has been scratching, ripping, and tearing my new couch
0) Heathenous dark mode user that shames and attacks light mode users
0) Turtle Bot that likes to meme on moderators, be annoying, and waste precious bot slots
1) Random yellow cat
1) Cat
*/
const chunkNoun = chunkItem.bind(null, [
	/(ADJECTIVE |ADJECTIVE PUNCTUATION )*(NOUN |PNOUN |PRONOUN )+SCONJ ((AUX |PRONOUN )*((PART )?VERB PUNCTUATION |(PART )?VERB CONJUNCTION |(PART )?VERB |CONJUNCTION (PART )?VERB )+(DETERMINER |PRONOUN |ADPOSITION )*(ADJECTIVE |ADJECTIVE PUNCTUATION )*(PRONOUN |NOUN |PNOUN )*(PUNCTUATION |CONJUNCTION )*)+/gmi,
	/(ADJECTIVE |ADJECTIVE PUNCTUATION )*(NOUN |PNOUN |PRONOUN )+/gmi
], "NOUN");

/*
Takes precedence over NPs in comparison phrases but not adj phrases, basically also a partial application of chunkItem
So "you look more like a dog than I do" > "dogs
@param posTags - array of things that went through POS tagger
@post param will not be changed

Chunks comparisons, but ig it also chunks adjectives later down the hierarchy line

regEx target examples --> 
0) Is nicer toward 
0) Is better than
0) Is less complicated than
0) Is way less dangerous compared to
0) Is drastically more important because
0) Is worse due to 
1) Is better for blinding
1) Is better used for eating
2) Looks really cute, extremely happy, and really energetic
2) Has been extremely friendly
*/
const chunkComp = chunkItem.bind(null, [
	/(AUX |AUX VERB )+(ADVERB )*COMPARISON (.*)SCONJ/gmi,
	/(AUX |AUX VERB )+(ADVERB )*COMPARISON (ADPOSITION VERB |VERB ADPOSITION VERB )*/gmi,
], "COMPARISON");

const chunkAdj = chunkItem.bind(null, [
	/(AUX )+((ADVERB |VERB )*ADJECTIVE |(ADVERB |VERB )*ADJECTIVE PUNCTUATION |(ADVERB |VERB )*ADJECTIVE CONJUNCTION |(ADVERB |VERB )*CONJUNCTION ADJECTIVE )+/gmi
], "ADJECTIVE");

//Chunk, then returns in form of a tree
//Since the chunkItem method works from left to right, the noun and comp chunk is already sorted by index. This makes things easier.
//In noun/compchunk, 2D array == chunk, 3D array = [word, pos, idx]
const chunk = (posSorted) => {
	let nounChunk = chunkNoun(posSorted);
	let compChunk = chunkComp(posSorted);

	//console.log(nounChunk)
	let sorted = [];
	var nounIdx = 0;
	var compIdx = 0;
	var imHungry = -1; //Tracks which idx we stopped at. If < imHungry don't add any text

	for (var i = 0; i < posSorted.length; i++)
	{
		if (compChunk[compIdx][0][2] == i)
		{
			if (imHungry < i)
			{
				sorted.push(compChunk[compIdx]);
				imHungry = compChunk[compIdx][compChunk[compIdx].length - 1][2];
			}
			if (compIdx + 1 < compChunk.length) compIdx++;
		}
		
		if (nounChunk[nounIdx][0][2] == i)
		{
			if (imHungry < i)
			{
				sorted.push(nounChunk[nounIdx]);
				imHungry = nounChunk[nounIdx][nounChunk[nounIdx].length -1][2];
			}
			if (nounIdx + 1 < nounChunk.length) nounIdx++;
		}

		if (imHungry < i)
		{
			sorted.push(posSorted[i]);
			imHungry++;
		}
	}

	return sorted;
}