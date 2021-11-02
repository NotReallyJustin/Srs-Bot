const fs = require('fs');
const Helpy = require('../../Helpy.js');

//https://www.comp.nus.edu.sg/~kanmy/courses/6101_1810/w9-coref.pdf
//https://www.cs.cmu.edu/~./hovy/papers/09DAARC-coref-final.pdf
//https://towardsdatascience.com/what-the-hell-is-perceptron-626217814f53
const pronouns = {
	he: {plural: false, gender: "m"},
	him: {plural: false, gender: "m"},
	his: {plural: false, gender: "m"},
	himself: {plural: false, gender: "m", reflexive: true},
	she: {plural: false, gender: "f"},
	her: {plural: false, gender: "f"},
	hers: {plural: false, gender: "f"},
	herself: {plural: false, gender: "f", reflexive: true},
	it: {plural: false, gender: "n"},
	its: {plural: false, gender: "n"},
	zim: {plural: false, gender: "n"},
	zie: {plural: false, gender: "n"},
	zir: {plural: false, gender: "n"},
	zis: {plural: false, gender: "n"},
	zieself: {plural: false, gender: "n"},
	they: {plural: true, gender: "n"},
	them: {plural: true, gender: "n"},
	their: {plural: true, gender: "n"},
	theirs: {plural: true, gender: "n"},
	themselves: {plural: true, gender: "n"},
	themself: {plural: true, gender: "n"},
	I: {plural: false, gender: "n"},
	my: {plural: false, gender: "n"},
	mine: {plural: false, gender: "n"},
	mines: {plural: false, gender: "n"},
	you: {plural: false, gender: "n"},
	your: {plural: false, gender: "n"},
	yours: {plural: false, gender: "n"}
};

const boyNames = fs.readFileSync('./BoyNames.txt').toString().split("\n");
const girlNames = fs.readFileSync('./GirlNames.txt').toString().split("\n");

const scout = (fileName, name) => {
	for (var l = 0, r = fileName.length - 1, mid = Math.floor((l + r)/2); l <= r; mid = Math.floor((l + r)/2))
	{
		if (fileName[mid].toLowerCase() == name.toLowerCase())
		{
			return true;
		}

		if (fileName[mid].toLowerCase() < name.toLowerCase())
		{
			l = mid + 1;
		}
		else
		{
			r = mid - 1;
		}
	}

	return false;
}

module.exports.scoutBoy = (name) => scout(boyNames, name);
module.exports.scoutGirl = (name) => scout(girlNames, name);
/*const perceptron = (m1, m2) => {
	var weightedArr = [];
	var m1Noun = m1.findNoun();
	var m2Noun = m2.type == "Pronoun" ? m2 : m2.findNoun();

	//1 - Number
	var m1Plural = false;
	var m2Plural = true;
	if (m1Noun.length > 1)
	{

	}
	else
	{
		m1Noun.le
	}

	if (m2Noun)
}*/