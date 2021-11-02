const POS = require('./POS.js');
const Coreference = require('./Coreference.js');
const Sentiment = require('./SentimentAnalysis.js');
const Helpy = require('../../Helpy.js');

class Relation
{
	constructor(arr, parent, alternatePOS)
	{
		this.arr = arr;
		this.subject;
		this.object;
		this.parent = parent;
		this.children = [];
		this.isChunk = typeof arr[0] == "object";
		this.hasAlternatePOS = alternatePOS != undefined;

		//arr[0] would be string/number if it's only 1 arr, but object if it's a noun/comp/adj chunk
		if (this.hasAlternatePOS)
		{
			this.string = alternatePOS;
			this.type = alternatePOS;
			this.pos = alternatePOS;
		}
		else if (this.isChunk) //and is not alternatePOS
		{
			this.string = arr.map(x => x[0]).join(" ");
			this.type = arr[0][3];
			this.pos = arr.map(x => x[1]).join(" ") + " ";
		}
		else
		{
			this.string = arr[0]
			this.pos = arr[1];
			this.type = arr[1] + " ";
		}
	}

	findNoun()
	{
		//Chunk it by SCONJ
		if (this.type != "NOUN" || this.hasAlternatePOS) return [];
		if (this.isChunk)
		{
			var e = [];
			var chain = [];
			for (var i = 0; i < this.arr.length; i++)
			{
				//arr[i][1] == pos
				if (this.arr[i][1] == "NOUN" || this.arr[i][1] == "PNOUN")
				{
					chain.push(this.arr[i]);
					//This combats stuff like "Catherine Garcia"
					if (i + 1 >= this.arr.length || this.arr[i][1] != this.arr[i + 1][1])
					{
						e.push(chain);
					}
				}
			}
			return e;
		}
		else
		{
			return [this.arr];
		}
	}
}

const lookAhead = (relationArr, posType, wantChunk, idx) => {
	for (var i = idx; i < relationArr.length; i++)
	{
		if (relationArr[i].type == posType && relationArr[i].isChunk == wantChunk) 
		{
			return relationArr[i];
		}
	}
	return null;
}

const lookBehind = (relationArr, posType, wantChunk, idx) => {
	for (var i = idx; i >= 0; i--)
	{
		if (relationArr[i].type == posType && relationArr[i].isChunk == wantChunk)
		{
			return relationArr[i];
		}
	}
	return null;
}

/*
Takes an arr from POS.js and converts that into relGraphs.
This extraction is rule based because we're not extracting things like how relation extraction normally works;
We're just trying to have the verb + comp + adj phrases find the appropriate noun phrase and maybe trace the verbs
So maybe like dependency charts?
This function also extracts new lines and punctuations
*/
const extractRelation = (posArr) => {
	let root = new Relation([], undefined, "ROOT");
	var queue = [];

	for (var i = 0, onHold = 0; i < posArr.length; i++)
	{
		/*console.log(posArr[i]);
		console.log(posArr[i][1] == "PUNCTUATIONEND");
		console.log(/\\n|;|\./gmi.test(posArr[i][1]));*/
		//PUNCTUATIONENDS are not parsed in any POS chunks, so posArr[i][1] targets the individual pos
		if ((posArr[i][1] == "PUNCTUATIONEND" && /\\n|;|\./gmi.test(posArr[i][0])) || i == posArr.length - 1)
		{
			var rel = new Relation(posArr.slice(onHold, i + 1), root, "SENTENCE");
			queue.push(rel);
			root.children.push(rel);
			onHold = i + 1;
		}
	}

	while (queue.length)
	{
		var el = queue.shift();
		if (el.isChunk)
		{
			var relConsolidated = el.arr.map(x => new Relation(x, el));
			queue.push(...relConsolidated);
			el.children.push(...relConsolidated);
		}
	}

	let relationArr = root.children.reduce((cumL, sentence) => cumL.concat(sentence.children), []);
	relationArr.forEach((rel, idx) => {
		switch(rel.type)
		{
			case "NOUN":
				var hasIs = false;
				for (var c = idx - 1; c >= 0; c--)
				{
					if (/COMPARISON|ADJECTIVE|\bVERB\b|PUNCTUATIONEND/gmi.test(relationArr[c].type))
					{
						break;
					}

					if (relationArr[c].type == "IS" || /get|gets|got|gotten/.test(relationArr[c].type)) hasIs = true;

					if (hasIs && (relationArr[c].type == "NOUN" || relationArr[c].type == "PRONOUN"))
					{
						rel.subject = relationArr[c];
						break;
					}
				}
			break;

			case "COMPARISON":
				rel.subject = lookBehind(relationArr, "NOUN", true, idx);
				if (/SCONJ |VERB-COMP /gmi.test(rel.pos))
				{
					rel.object = lookAhead(relationArr, "NOUN", true, idx);
				}
			break;

			case "VERB":
				//Gerunds and participles should no longer classified as a verb @ this stage
				//To do: the cat hit light mode + the cat ran over light mode should be different from the cat ran and the dog followed
				var hasIs = false;
				var ing = false;
				for (var c = 0; c < rel.children.length; c++)
				{
					if (rel.children[c].pos == "IS" || /get|gets|got|gotten/.test(relationArr[c].type))
					{
						hasIs = true;
					}

					if (rel.children[c].pos == "VERB" && rel.children[c].string.endsWith('ing'))
					{
						ing = true;
					}
				}

				if (hasIs && !ing)
				{
					rel.subject = lookAhead(relationArr, "NOUN", true, idx);
					rel.object = lookBehind(relationArr, "NOUN", true, idx);
				}
				else
				{
					rel.subject = lookBehind(relationArr, "NOUN", true, idx);
					rel.object = lookAhead(relationArr, "NOUN", true, idx);
				}
			break;

			case "ADJECTIVE":
				//Adjectives that come before noun are in NP because *Light* in light mode is adj, but it's cruicial info to know the theme
				rel.subject = lookBehind(relationArr, "NOUN", true, idx);
			break;

			case "ADVERB":
				var conjleft = false;
				var conjright = false;
				var alertright = false; //Remembers to check conjright before deciding on verb

				//Find closest verb to modify (praying SAT grammar prep helps here)
				//Adverbs like very should already be classified in the adjectives
				for (var i = idx, j = idx; i >= 0 || j < relationArr.length; i++, j--)
				{
					if (i >= 0 && relationArr[i].type == "VERB")
					{
						rel.subject = relationArr[i];
						break;
					}
					else if (j < relationArr.length && relationArr[j].type == "VERB")
					{
						if (alertright && conjright || !alertright)
						{
							rel.subject = relationArr[i];
							break;
						}
						else
						{
							j = relationArr.length;
						}
					}
					else if (i >= 0 && relationArr[i].type == "CONJUNCTION")
					{
						conjleft = true;
					}
					else if (j < relationArr.length && relationArr[j].type == "CONJUNCTION")
					{
						conjright = true;
					}
					else if (i >= 0 && relationArr[i].type == "PUNCTUATION" && !conjleft)
					{
						i = -1;
					}
					else if (j < relationArr.length && relationArr[j].type == "PUNCTUATION")
					{
						alertright = true;				
					}
				}
			break;
		}
	});
	return root;
}

POS.calculate("Light mode is awesome!")
	.then(arr => {
		POS.chunk(arr)
			.then(chunkRay => {
				//console.log(chunkRay)
				let root = extractRelation(chunkRay);
				hobbsAlgorithm(root);
				Sentiment.sentimentAnalysis(root);
			});
	});

/*
Determines pronoun anaphora using Hobb's Naive Algortihm
It's Naive but it's getting better results than the supervised learning one so what can I say
*/
const hobbsAlgorithm = (root) => {
	let pronounRef;
	let queue = [...root.children];
	let matchQueue = [];

	//Look for pronoun
	while (!!queue.length)
	{
		let retShift = false;
		let exempt = false;
		let lastItem; //Controls alot of backend functions

		var latest = queue.shift();
		if (latest.pos == 'PRONOUN')
		{
			pronounRef = latest;
			if (pronounRef.parent.children.indexOf(pronounRef) == 0)
			{
				matchQueue.unshift(pronounRef);
			}
			else
			{
				//Step 3 - this is probably still NP level
				matchQueue.unshift(...pronounRef.parent.children.slice(0, pronounRef.parent.children.indexOf(pronounRef)));
			}

			while (!!matchQueue.length)
			{
				var rel = matchQueue.shift();
				//Replace true with rel.isChunk? Maybe?
				var isNounPhrase = true && !exempt && /\bNOUN\b|\bPNOUN\b/gmi.test(rel.type) && rel != pronounRef;
				var proposeSuccess;

				if (isNounPhrase)
				{
					proposeSuccess = proposeAntecedent(rel, pronounRef);
					if (proposeSuccess) break;
				}
				
				exempt || proposeSuccess || !rel.children.length || matchQueue.unshift(...rel.children);

				//Proceed to later steps from here
				if (!matchQueue.length)
				{
					if (!(lastItem && lastItem.parent.type == "SENTENCE" && !exempt)) //LastItem is only defined when we go to step 8
					{
						//if exempt, the rel would be referring to the sentence
						if (exempt && rel.type == "SENTENCE")
						{
							rel = rel.children[0];
						}

						if (exempt)
						{
							lastItem = false;
							exempt = false;
						}

						//Step 4 - remember this because we're doing some wibbly wobbly timey wimey stuff
						if (rel.parent.parent == undefined)
						{
							//console.dir(rel);
						}

						var currSentenceIdx = rel.parent.parent.children.indexOf(rel.parent);
						if (currSentenceIdx > 0 && rel.parent.type == 'SENTENCE' && rel.parent.parent.type == 'ROOT')
						{
							for (var i = currSentenceIdx - 1; i >= 0; i--)
							{
								matchQueue.push(rel.parent.parent.children[i]);
							}
						}
						else if (rel.parent.type != "ROOT" && rel.parent.type != "SENTENCE")
						{
							var newX;
							//var immediateNoun = false;
							//var init = rel;
							var rotateFunc = (item) => {
								//Due to parsing structure mechanism that we had, NOUN == NOUN_PHRASE
								if (item.parent.type == "SENTENCE" || item.parent.type == "NOUN")
								{
									newX = item.parent;
									lastItem = item;
									/*if (item == init && /\bNOUN\b|\bPRONOUN\b/.test(item))
									{
										immediateNoun = true;
									} --> Replaced */
								}
								else if (item.parent.type == "ROOT") //Should probably never get to here
								{
									newX = item.children[currSentenceIdx];
									lastItem = newX.children[newX.children.length - 1];
								}
								else
								{
									lastItem = item;
									rotateFunc(item.parent);
								}
							}
							rotateFunc(rel);

							if (newX.type == "NOUN" && !(lastItem == rel && /\bNOUN\b|\bPNOUN\b|\bPRONOUN\b/.test(lastItem.type)))
							{
								var bool = proposeAntecedent(newX, pronounRef);
								if (bool) break;
							}

							if (newX.children.indexOf(lastItem) == 0)
							{
								matchQueue.unshift(newX); //Just skip directly to newX
								exempt = true;
							}
							else
							{
								matchQueue.unshift(...newX.children.slice(0, newX.children.indexOf(lastItem)));
							}
						}
					}
					else
					{
						var nodeX = lastItem.parent;
						let customArr = nodeX.children.slice(nodeX.children.indexOf(lastItem) + 1, nodeX.children.length);
						while (!!customArr.length)
						{
							var item = customArr.shift();
							if (item.type == "NOUN")
							{
								var approved = proposeAntecedent(item, pronounRef);
								if (approved) break;
							}
							else if (item.type != "SENTENCE")
							{
								customArr.push(...item.children);
							}
						}
						lastItem = false;
						exempt = false;
					}
				}
			}
		}
		else
		{
			//When queue children runs out, this stops so prevents infinite loop
			!latest.children.length || queue.unshift(...latest.children);
		}
	}

	return root;
	//Puts all nodes in queue
	//Traverse all the nodes dfs, while simultaneously adding to queue and adding up up ups
	//If spot pronoun, HALT! Go up, up, and up...
}

const pronouns = {
	he: {plural: false, gender: "m", reflexive: false},
	him: {plural: false, gender: "m", reflexive: false},
	his: {plural: false, gender: "m", reflexive: false},
	himself: {plural: false, gender: "m", reflexive: true},
	she: {plural: false, gender: "f", reflexive: false},
	her: {plural: false, gender: "f", reflexive: false},
	hers: {plural: false, gender: "f", reflexive: false},
	herself: {plural: false, gender: "f", reflexive: true},
	it: {plural: false, gender: "n", reflexive: false},
	its: {plural: false, gender: "n", reflexive: false},
	zim: {plural: false, gender: "n", reflexive: false},
	zie: {plural: false, gender: "n", reflexive: false},
	zir: {plural: false, gender: "n", reflexive: false},
	zis: {plural: false, gender: "n", reflexive: false},
	zieself: {plural: false, gender: "n", reflexive: true},
	they: {plural: true, gender: "n", reflexive: false},
	them: {plural: true, gender: "n", reflexive: false},
	their: {plural: true, gender: "n", reflexive: false},
	theirs: {plural: true, gender: "n", reflexive: false},
	themselves: {plural: true, gender: "n", reflexive: true},
	themself: {plural: false, gender: "n", reflexive: true},
	I: {plural: false, gender: "n", reflexive: false},
	my: {plural: false, gender: "n", reflexive: false},
	mine: {plural: false, gender: "n", reflexive: false},
	mines: {plural: false, gender: "n", reflexive: false},
	myself: {plural: false, gender: "n", reflexive: true},
	you: {plural: false, gender: "n", reflexive: false},
	your: {plural: false, gender: "n", reflexive: false},
	yours: {plural: false, gender: "n", reflexive: false},
	yourself: {plural: false, gender: "n", reflexive: true},
	yourselves: {plural: true, gender: "n", reflexive: true}
};

const proposeAntecedent = (antecedent, pronoun) => {
	//Agree in number
	//console.log('---')
	//console.log(antecedent)
	var nounArr = antecedent.findNoun();
	//console.log(nounArr)
	if (nounArr.length < 1) return false;
	if (!pronouns[pronoun.string.toLowerCase()]) return false;
	//console.log('There is a noun')
	var plural = nounArr.length > 1;
	var pronounData = pronouns[pronoun.string.toLowerCase()];

	//Gender agreement
	if (nounArr[0][0].pos == "PNOUN")
	{
		var gender;
		var concat = nounArr[0][0];
		if (Coreference.scoutBoy(nounArr[0][0].string))
		{
			gender = "m";
		}
		else if (Coreference.scoutGirl(nounArr[0][0].string))
		{
			gender = "f";
		}
		else
		{
			gender = "n";
		}

		if (gender != pronounData.gender) return false;
	}

	//console.log('gender matches')

	//Number agreement
	if (plural == pronounData.plural && nounArr[0][0].pos != "NOUN")
	{
	}
	else
	{
		//console.log('Does not have multiple or POS is noun')
		if (nounArr[0][0].pos == "NOUN")
		{
			var singular = Helpy.pluralize(nounArr[0][nounArr[0].length - 1].string, true);
			if (singular != 404)
			{
				plural = singular == nounArr[0][nounArr[0].length - 1].string;
				if (plural != pronounData.plural) return false;
			}
			//console.log('The noun is plural')
		}
		else
		{
			return false;
		}
	}

	//Reflexive agreement
	var reflexive = true;
	var pdx = pronoun.parent.children.indexOf(pronoun);
	var adx = pronoun.parent.children.indexOf(antecedent);
	if (adx == -1 || pdx <= adx) //Doesn't exist in same sentence
	{
		reflexive = false;
	}
	else
	{
		//console.log('parent exists in sentence and antecedent is before pronoun')
		//If adx is > parent.length, then pdx probably wouldn't exist and be > pdx to begin with
		var splitArr = pronoun.parent.slice(adx + 1, pdx);
		splitArr.forEach(item => {
			if (item.type != "VERB" || item.type != "DETERMINER" || item.type != "TO")
			{
				reflexive = false;
			}
		});
	}

	//console.log(pronounData.reflexive)
	if (reflexive != pronounData.reflexive) return false;
	//console.log('Is reflexively matched')

	//End
	pronoun.subject = antecedent;
	//console.log('yay!')
	return true;
}

//https://www.usna.edu/Users/cs/nchamber/courses/nlp/s15/slides/set14-coreference.pdf
/*const bfsTraverse = (rel, pronounRef) => {
	if (pronounRef)
	{
		if (rel.isChunk && /\bNOUN\b|\bSENTENCE\b/gmi.test(rel.type))
		{
			//traverse all branches below x breath first propose antecedent
			proposeAntecedent();
		}
	}
	else
	{
		if (rel.pos == "PRONOUN")
		{
			bfsTraverse(rel.parent, rel);
		}
		else
		{
			rel.children.map(child => {
				bfsTraverse(child);
			});
		}
	}
}
//Hey if you're reading this, I believe in JS supremacy
const bfsTraverse = function(rel, firstPromise, pronounRef, promiseArr) return new Promise(function(resolve, reject)
{
	if (!firstPromise)
	{
		firstPromise = this;
	}

	if (pronounRef)
	{
		if (rel.isChunk && /\bNOUN\b|\bSENTENCE\b/gmi.test(rel.type))
		{
			if (promiseArr)
			{
				Promise.allSettled()
			}
			let promises = rel.children.slice(0, rel.children.indexOf(pronounRef)).map(child => {
				bfsTraverse(child, pronounRef);
				Promise.all(promises)
			});
		}
		else
		{
			bfsTraverse(rel.parent, pronounRef);
		}
	}
	else
	{
		if (rel.pos == "PRONOUN")
		{
			if (this != firstPromise)
			{
				reject("ERROR - First promise must be the root");
			}
			else
			{
				resolve(rel);
			}
		}
		else
		{
			//If !rel.isChunk then this just won't run; rel.children is defined for all relation objects
			rel.children.forEach(child => {
				bfsTraverse(child)
					.then(pronoun => {
						bfsTraverse(child.parent, pronounRef);
					}).catch(() => {
						if (!firstPromise) reject();
					});
			});
		}
	}
});*/
//console.dir(extractRelation(POS.chunk(POS.calculate("Dark Mode is better than Light Mode because it isn't complete trash"))));