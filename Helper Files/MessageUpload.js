/* Uploads the message in the designated txt file onto MongoDb*/

const readFilePath = "./upload.txt";

const fs = require("fs");
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient("mongodb+srv://ComradeDiamond:MangoDb@srsbot.urizc.mongodb.net/retryWrites=true&w=majority")

client.connect().then(() => {
	const mango = client.db("BotData").collection("Hangman");

	fs.readFile(readFilePath, "utf8", (err, txt) => {
		if (err) console.error(err);

		let uploads = txt.split("\n");

		console.log("Uploading in session...");

		for (let link of uploads)
		{
			mango.countDocuments({phrase: link})
				.then(num => {
					if (num == 0)
					{
						mango.insertOne({
							phrase: link
						});

						console.log("Done!");
					}
				});
		}
	})
});