/*
	Not sure why we call this "Sentiment Analysis" because we're technically figuring out whether it's pro or anti-light mode
	But hey half of the throwaway variables in Srs Bot don't make sense so :shrug:
*/

//Takes an input in the form of a relation extraction tree from RelationExtraction.js and then parses it
//Returns + or - depending on whether the sentence is pro or anti-light mode
//Input the root 'node'
const { SimpleMap } = require("../../Helpy.js");
const afinn = require("./Afinn.json");
const { lemmatize } = require("./Lemmatize.js");
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
	"amoled",
	"dark",
	"black",
	"default"
]);

const justinRelLight = {
	"justin": new SimpleMap(["use", "have", "look"]),
	"seal": new SimpleMap(["use", "have", "look"])
};

const justinRelDark = {
	"justin": new SimpleMap(["hate", "vomit", "dislke"]),
	"seal": new SimpleMap(["hate", "vomit", "dislke"])
};

const negationWords = new SimpleMap([
	"not",
	"no",
	"never",
	"nah",
	"naw",
	"nay",
	"opposite"
]);

//Optional @param defaultAdd +- by a default absolute value
//Light mode gets +absVal, dark mode gets -absVal
module.exports = (root, defaultAdd) => {
	const tracker = [...root.children].map(sentence => sentence.children).flat();
	var total = 0;
	tracker.forEach(el => {
		//console.log(el)
		//Rechecking mode each time to prevent random adjectives like "ice cream is good and light mode bad"
		if (el.type == "VERB" && el.subject)
		{
			//See negationChain description for adjective
			var negationChain = 1;
			var currNegation = testNegations(el);
			var subjectMode = testContainMode(el.subject);
			var objectMode = el.object ? testContainMode(el.object) : "none";

			if (subjectMode != "none")
			{
				isLight = subjectMode == "light";
				attackDark = objectMode == "dark";
				el.children.forEach(yeet => {
					if (/VERB|ADVERB/gmi.test(yeet.pos))
					{
						yeet = lemmatize(yeet.string, yeet.pos);
						if (afinn[yeet])
						{
							if (isLight && attackDark)
							{
								total += Math.abs(+afinn[yeet]) * negationChain;
							}
							else if (!isLight)
							{
								total += -1 * +afinn[yeet] * negationChain;
							}
							else if (isLight)
							{
								total += +afinn[yeet] * negationChain;
							}
						}
					}
					else if (/SCONJ|CONJUNCTION|PUNCTUATION/gmi.test(yeet.pos))
					{
						negationChain = 1;
					}
					else if (negationWords[yeet.string])
					{
						negationChain = -1;
					}
				});
			}
			else if (objectMode && objectMode != "none")
			{
				el.children.forEach(yeet => {
					if (/VERB|ADVERB/gmi.test(yeet.pos))
					{
						yeet = lemmatize(yeet.string, yeet.pos);
						if (afinn[yeet])
						{
							if (objectMode == "dark")
							{
								total -= +afinn[yeet] * negationChain;
							}
							else if (objectMode == "light")
							{
								total += +afinn[yeet] * negationChain;
							}
						}
					}
					else if (/SCONJ|CONJUNCTION|PUNCTUATION/gmi.test(yeet.pos))
					{
						negationChain = 1;
					}
					else if (negationWords[yeet.string])
					{
						negationChain = -1;
					}
				});
			}
		}
		else if (/ADJECTIVE|ADJECTIVE /gmi.test(el.type) && el.subject) //Takes into account spare adjectives like "light mode *bad*"
		{
			var subjectMode = testContainMode(el.subject);
			if (subjectMode != "none")
			{
				isLight = subjectMode == "light";
				var negationChain = 1;
				let matchingArr = el.isChunk ? el.children : [el];
				matchingArr.forEach(yeet => {
					//Wanted to put this through test negations, but it will take more computing time to split this adjective phrase
					//by el.children.split(any punctuation or conjunction)

					//negationChain is a number for ease of multiplying down the line
					//-1 == has negation, 1 = not negated
					if (yeet.pos == 'ADJECTIVE')
					{
						yeet = lemmatize(yeet.string, yeet.pos);
						if (afinn[yeet])
						{
							total += isLight ? +afinn[yeet] * negationChain : +afinn[yeet] * -1 * negationChain;
						}
					}
					else if (/SCONJ|CONJUNCTION|PUNCTUATION/gmi.test(yeet.pos))
					{
						negationChain = 1;
					}
					else if (negationWords[yeet.string])
					{
						negationChain = -1;
					}
				});
			}
		}
		else if (el.type == "NOUN")
		{
			var elmo = testContainMode(el); //el mode --> elmo, get it?
			if (el.subject)
			{
				var subjectMode = testContainMode(el.subject);
				isLight = subjectMode == "light";

				var negations = testNegations(el);
				var countTotal = 0;
				el.children.forEach(items => {
					items = lemmatize(items.string, items.pos);

					if (afinn[items])
					{
						countTotal += isLight ? +afinn[items] : +afinn[items] * -1;
					}
				});
				total += negations ? countTotal * -1 : countTotal;
			}
			else if (elmo != "none")
			{
				//The testContainMode would simultaneously negate the "not" for light mode and all subsequent adjectives
				isLight = elmo == "light";
				if (!isNaN(defaultAdd))
				{
					total += isLight ? defaultAdd : defaultAdd * -1;
				}
				el.children.forEach(items => {
					//Verbs are not taken into account because they could be interpreted as pro-light mode always
					//ie. The mode that blinded me --> Could easily be interpreted as dark mode :bigBrain: :thonk: :tapHead:
					if (items.pos == "ADJECTIVE" && items.subject)
					{
						if (modeWords[items.subject.string.toLowerCase()])
						{
							items = lemmatize(items.string, items.pos);
							{
								if (afinn[items])
								{
									total += isLight ? +afinn[items] : +afinn[items] * -1;
								}
							}
						}
					}
				});
			}
		}
		else if (el.type == "COMPARISON" && el.subject)
		{
			var netPos = 0;
			el.children.filter(item => item.pos == "COMPARISON").forEach(item => {
				var yeet = lemmatize(item.string, item.pos);
				if (afinn[yeet])
				{
					netPos += afinn[yeet];
				}
			});

			var subjectMode = testContainMode(el.subject);
			var objectMode = !!el.object ? testContainMode(el.object) : "none";

			//We could condense the ifs, but it'll take the same amount if not more lines
			if (subjectMode != "none")
			{
				total += subjectMode == "light" ? netPos * 5 : netPos * -5;
			}
			else if (/nothing/gmi.test(el.subject.string) && objectMode != "none") 
			{
				//Detects stuff like : Nothing is better than light mode
				total += objectMode == "light" ? netPos * 5 : netPos * -5;
			}
			else if (objectMode != "none")
			{
				total += objectMode == "dark" ? netPos * 3 : netPos * -3;
			}
		}
	});

	return total;
}

/*Tests whether a chunk is referring to a light or dark mode.
This also jots the determined result down so it won't have to calculate it in the future
code: "light", "dark", "none" 
AMOLED isn't a bad theme so it doesn't do anything with that
Precondition: Use only on NP */
const testContainMode = (chunk) => {
	if (chunk.modeType) return chunk.modeType;

	var negations = testNegations(chunk);
	var mentionLight = false;
	var mentionDark = false;
	var mentionMode = false;
	var overriddenLoop;

	chunk.children.forEach(word => {
		//If it's a pronoun and refers to a subject, just use the mode type
		if (word.pos == "PRONOUN" && word.subject)
		{
			var stacko = testContainMode(word.subject);
			if (stacko != "none") overriddenLoop = stacko;
			return;
		}

		var wordLoCase = lemmatize(word.string.toLowerCase(), word.pos);
		var subjectLoCase = word.subject ? word.subject.string.toLowerCase() : "";
		//console.log(wordLoCase + " " + subjectLoCase)
		if (word.pos == "NOUN" || word.pos == "PNOUN")
		{
			//console.log(wordLoCase)
			if (modeWords[wordLoCase]) mentionMode = true;
		}
		else if (word.pos == "VERB")
		{
			if (justinRelLight[subjectLoCase])
			{
				if (justinRelLight[subjectLoCase][wordLoCase])
				{
					mentionLight = true;
				}
				else if (justinRelDark[subjectLoCase][wordLoCase])
				{
					mentionDark = true;
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
		else if (word.pos == "ADJECTIVE")
		{
			//console.log(wordLoCase)
			if (lightMode[wordLoCase]) mentionLight = true;
			if (darkMode[wordLoCase]) mentionDark = true;
		}
	});

	if (overriddenLoop)
	{
		if (overriddenLoop == "light")
		{
			chunk.modeType = !negations ? "light" : "dark";
			return chunk.modeType;
		}
		else if (overriddenLoop == "dark")
		{
			chunk.modeType = !negations ? "dark" : "light";
			return chunk.modeType;
		}
		return "none"; //Just in case
	}

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
	//console.log(mentionMode + " " + negations + " " + res)
	return res;
}

/*
Tests negations inside a certain chunk
First it strips everything down to its basic chunks
Then it looks for CONJUNCTION tags and scouts for NOT
ie. The book that Justin did not rip apart and eat
										   ^^^ and detected, distribute the not
	The book that Justin did NOT rip apart and not eat --> Not is counted once here
	Targets adj, verb, and adv
Things like since and because won't trigger CONJUNCTION because we already flagged it as SCONJ
*/
const testNegations = (chunk) => {
	//Test --> Not conscious and not happy --> 2 nots, but we don't count them as 2, we only count as 1 not together
	let officialArr = [];
	let conjunctionIdxs = [];
	let queue = [chunk];

	while (queue.length)
	{
		var item = queue.shift();
		if (item.isChunk)
		{
			//DFS this
			queue.unshift(...item.children);
		}
		else
		{
			officialArr.push(item);
			item.pos == "CONJUNCTION" && conjunctionIdxs.push(officialArr.length - 1);
		}
	}

	//At this step, officialArr is broken down
	//Now we rid the nots 
	for (var idx of conjunctionIdxs)
	{
		var posType = "NONE";
		for (var i = idx + 1; i < officialArr.length; i++)
		{
			if (/NOUN|VERB|ADVERB|ADJECTIVE|PRONOUN|PNOUN/i.test(officialArr[i].pos))
			{
				posType = /NOUN|PRONOUN|PNOUN/i.test(officialArr[i].pos) ? "NOUN" : officialArr[i].pos;
				break;
			}

			if (negationWords[officialArr[i].string])
			{
				officialArr[i] = "";
			}
		}

		for (var j = idx - 1; j >= 0; j--)
		{
			if (posType == "NOUN" && /NOUN|PRONOUN|PNOUN/i.test(officialArr[j].pos))
			{
				break;
			}
			else if (officialArr[j].pos == posType)
			{
				break;
			}

			if (negationWords[officialArr[j].string])
			{
				officialArr[j] = "";
			}
		}
	}

	var cumSum = officialArr.reduce((cumL, curr) => {
		if (negationWords[curr.string])
		{
			return cumL + 1;
		}
		return cumL;
	}, 0);
	return cumSum % 2;
}

//It's a look ahead, but this returns an index
const lookAhead = (relationArr, posType, wantChunk, idx) => {
	for (var i = idx; i < relationArr.length; i++)
	{
		if (relationArr[i].type == posType && relationArr[i].isChunk == wantChunk) 
		{
			return i;
		}
	}
	return null;
}

//It's a lookbehind and basically copied and pasted from relationExtraction, but it returns an index
//Very sad I know
const lookBehind = (relationArr, posType, wantChunk, idx) => {
	for (var i = idx; i >= 0; i--)
	{
		if (relationArr[i].type == posType && relationArr[i].isChunk == wantChunk)
		{
			return i;
		}
	}
	return null;
}