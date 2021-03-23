/* Uploads the message in the designated txt file onto MongoDb*/

const fs = require("fs");
const MongoClient = require("mongodb").MongoClient;
const mango = new MongoClient(process.env.MANGO_CONNECTION).db("BotData").collection("Hangman");

const readFilePath = "./upload.txt";

fs.readFile(readFilePath, (err, txt) => {
	if (err) console.error(err);

	let uploads = txt.split("\n");

	for (var link of uploads)
	{
		if (mango.countDocuments({phrase: link}) == 0)
		{
			collection.insertOne({
				phrase: link
			});
		}
	}
})