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
					yeet = lemmatize(yeet);
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
					yeet = lemmatize(yeet);
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

	var negations = testNegation(chunk);
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

const negationWords = new SimpleMap([]);
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
			queue.unshift(...item.children);
		}
		else
		{
			officialArr.push(item);
			item.pos != "CONJUNCTION" || conjunctionIdxs.push(officialArr.length - 1);
		}
	}

	//At this step, officialArr is broken down
	//Now we rid the nots
	for (var idx in conjunctionIdxs)
	{
		var posType = "NONE";
		for (var i = idx + 1; i < officialArr.length; i++)
		{
			if (/NOUN|VERB|ADVERB|ADJECTIVE|PRONOUN|PNOUN/i.test(officialArr[i].pos))
			{
				posType = /NOUN|PRONOUN|PNOUN/i.test(officialArr[i].pos) ? "NOUN" : officialArr[i].pos;
				break;
			}

			if (negationWords[officialArr[i]])
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

			if (negationWords[officialArr[j]])
			{
				officialArr[j] = "";
			}
		}
	}

	var cumSum = officialArr.reduce((cumL, curr) => {
		if (negationWords[curr])
		{
			return cumL + 1;
		}
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