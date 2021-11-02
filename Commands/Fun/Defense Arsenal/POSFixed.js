const fs = require('fs');
const leScan = require('readline').createInterface({
	input: fs.createReadStream('./PosInput.txt'),
	output: process.stdout,
	clrfDelay: Infinity,
	terminal: false
});

let output = "";
let lastTxt = "";

var lastLine = "";
leScan.on('line', txt => {
	//formalize(txt);
	//ridThird(txt);
	//ridSecond(txt);
	//correctAdjective(txt);

	if (lastLine.split("\t")[1] == "IS")
	{
		var splito = txt.split("\t");
		if (splito[0].indexOf("ing") == -1 && splito[1] == "VERB")
		{
			output += `$${splito[0]}\tVERBPP\n`; 
			return;
		}
	}

	output += `${txt}\n`;
});

leScan.on('close', () => {
	fs.writeFileSync('./PosTrained.txt', output);
});

const formalize = (txt) => {
	if (txt.indexOf('USR') != -1)
	{
		return;
	}
	if (txt.indexOf("URL") != -1) return;
	if (txt.indexOf("RT") != -1) return;
	if (txt.indexOf(": :") != -1) return;
	if (txt.indexOf("... :") != -1) return;
	if (txt.indexOf("HT") != -1) return;
	if (txt.indexOf("CC") != -1) return;
	if (txt.indexOf("UH") != -1) return;
	if (txt.indexOf("SYM") != -1) return;

	txt = txt.replace("'m", "am").replace("'s", "is");
	txt = txt.replace("'ll", "will");

	output += `${txt}\n`;
}

const correctAdjective = (txt) => {
	var splito = txt.split("\t");
	if (splito[0].substring(splito[0].length - 2, splito[0].length).toLowerCase() == "er" && splito[1] == "ADJECTIVE")
	{
		splito[1] = "COMPARISON";
		txt = splito.join("\t");
	}

	output += `${txt}\n`;
}

const ridThird = (txt) => {
	if (txt == "")
	{
		output += `\n`;
	}
	else
	{
		var arr = txt.split("\t");
		output += `${arr[0]}\t${arr[1]}\n`;
	}
}

const ridSecond = (txt) => {
	if (lastTxt == "")
	{
		output += '\n';
	}
	else
	{
		var arr = lastTxt.split('\t');
		output += `${arr[0]}`;
		if (txt.indexOf("PUNCTUATION") == -1) output += ' ';
	}

	lastTxt = txt;
}