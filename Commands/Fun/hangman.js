const https = require("https");

module.exports = {
	name: "hangman",
	description: "Starts a hangman game with a random BTHS Discord quote!",
	options: [
		{
			name: "proto",
            description: "Are you gonna start or stop the game?",
            required: true,
            type: "STRING",
            choices: [
            	{name: "start", value: "start"},
            	{name: "stop", value: "stop"}
            ]
		}
	],
	execute: (interaction, toolkit, currentChannel) => {
		const collection = toolkit.mangoDatabase.collection("Hangman");
		const proto = interaction.options.getString("proto");

		if (proto == "start")
		{
			collection.aggregate([{"$sample":{size: 1}}]).next()
				.then(item => {
					let lives = 3;
					let alreadyGuessed = "";

					let wordDisplay = "";
					for (var letter of item.phrase)
					{
						//If not a valid letter we can guess
						if (/\W/.test(letter))
						{
							if (letter == " ")
							{
								wordDisplay += "\t";
							}
							else
							{
								wordDisplay += letter;
							}
						}
						else
						{	
							wordDisplay += "﹘ ";
						}
					}
					wordDisplay += " "; //Work around off by 1 error

					let canStartGame = !currentChannel.hasValidMoves(interaction.user.id);
					if (canStartGame)
					{
						//Sends the initial message wave
						interaction.reply({content: constructMessage(lives, wordDisplay, null, "", alreadyGuessed), fetchReply: true})
							.then(messageObj => {

								//External function call route
								const playMove = (messageContent, message) => {
									var replaced = false;
									var ended = false;
									var status = "";
									var trackIdx = 0; //Tracks the "actual" string word position

									//If it's already guessed, do nothing and tell them it's already guessed
									if (alreadyGuessed.indexOf(messageContent.toUpperCase()) == -1 && messageContent.length == 1 && /\w/.test(messageContent))
									{
										alreadyGuessed += messageContent.toUpperCase();
									}
									else
									{
										if (alreadyGuessed.indexOf(messageContent.toUpperCase()) != -1)
										{
											status = "smh you guessed this already";
										}
										else
										{
											status = "You need to insert a one letter object you haven't guessed before.";
										}

										messageObj.edit(constructMessage(lives, wordDisplay, null, status, alreadyGuessed));
										return;
									}

									for (var i = 0; i < wordDisplay.length - 1; i++)
									{
										var currLetter = item.phrase[trackIdx].toUpperCase();

										//Index++ will only trigger if word display is not a blank space.
										//Blank space between sentences have already been converted to \t
										if (wordDisplay[i] != " ")
										{
											if (currLetter == messageContent.toUpperCase())
											{
												var moveNum = wordDisplay[i+1] == " " ? 1 : 0;
												wordDisplay = wordDisplay.substring(0, i) + currLetter + wordDisplay.substring(i + 1 + moveNum);
												replaced = true;
											}

											trackIdx++;
										}
									}

									if (!replaced)
									{
										status = "Wrong guess!";
										lives--;
									}

									//If all letters are guessed
									if (wordDisplay.indexOf("﹘") == -1)
									{
										ended = true;
										status = "Ayy you won!";
									}
									else if (lives <= 0)
									{
										ended = true;
										status = `You lost! The phrase was **${item.phrase}**!`;
									}

									if (ended)
									{
										currentChannel.deleteMoves(message.author.id);
									}

									messageObj.edit(constructMessage(lives, wordDisplay, null, status, alreadyGuessed));

									message.delete();
								}

								currentChannel.addMoves(interaction.user.id, playMove);
							});
					}
					else
					{
						interaction.reply("You have another game going on. You cannot statrt a new hangman game smh");
					}
				});
		}
		else
		{
			//This will end up deleting any valid games that are running, and this is intentional.
			//There's a 102% chance I will forget which game I have running currently so this is a workaround lol
			if (currentChannel.hasValidMoves(interaction.user.id))
			{
				currentChannel.deleteMoves(interaction.user.id);
				interaction.reply("done!");
			}
			else
			{
				interaction.reply("buddy you don't have a running game going on.");
			}
		}
	}
}

const constructMessage = (lives, word, definition, status, alrGuess) => {
	var str = "__**Hangman**__";
	str += `\n**Lives**: ${lives}\n`;
	str += `**Already Guessed:** ${alrGuess}\n`;
	//str += `**Hint Definition**: ${definition}\n`;
	str += `**Status**: ${status}\n`
	str += `**Word**: ${word}`;

	return str;
}