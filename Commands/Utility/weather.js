const weather = require("weather-js");
const Discord = require("discord.js");

module.exports = {
    name: "weather",
    description: "Tells you the weather status of NYC. If you want realtime analysis, type `srs weather advanced`!",
    execute : (message, args) => {
        let prom = weatherFind();

        //If it works properly, the weather stuff should be able to report back the status and the weather embed yes
        prom.then(nycJSON => {
        	if (args[0] == "advanced")
        	{
        		message.channel.send(weatherEmbed(nycJSON));
        	}
        	else
        	{
        		message.channel.send(`wtf it's ${nycJSON.forecast[1].low} lowest and ${nycJSON.forecast[1].high} highest with ${nycJSON.forecast[1].precip}% chance to get wet 👀`);
        		message.channel.send(weatherRec(nycJSON.forecast[1].high));
        	}
        });

        prom.catch(err => {
        	message.channel.send("hmm something went wrong");
        })
    }
}

//Hmm 👀 this wasn't supposed to be in a promise but we might as well do that since we're going to be linking more stuff to the promise chain
const weatherFind = () => new Promise((resolve, yeet) => {
	weather.find({search: 'New York, NY', degreeType: 'F'}, (reject, result) => {
		if (reject)
		{
			yeet();
		}
		else
		{
			resolve(result[0]);
		}
	});
});

const weatherEmbed = (json) => {
	let embed = new Discord.MessageEmbed();
	embed.setAuthor("Srs Bot", "https://i.imgur.com/Bnn7jox.png");
	embed.setColor('AQUA');
	embed.setTitle("Advanced Forecast");
	embed.setDescription(`Current Temp: ${json.current.temperature} \n` +
		`Feels like: ${json.current.feelslike} \n`+
		`Humidity: ${json.current.humidity} \n` +
		`Sky Text: ${json.current.skytext} \n` +
		`Wind Speed: ${json.current.winddisplay} \n` +
		`Recent Weather Bloon Launch Time: ${json.current.observationtime}`);
	embed.setFooter("Does anyone even use this during quarantine");

	return embed;
}

const weatherRec = (highTemp) => {
	const x = [
		{"max": 0, "message": "Geez when we say to go chill, we don't mean to buy a ticket to Alaska"},
		{"max": 20, "message": "Put on some winter gear, because it's freezing"},
		{"max": 40, "message": "Smh wear that navy blue thing"},
		{"max": 50, "message": "Short sleeve and thick jacket time"},
		{"max": 60, "message": "Wtf it's actually T-Shirt Time?"},
		{"max": 75, "message": "Quick so what JoKang's doing"},
		{"max": 85, "message": "smh go buy a hat or smth"},
		{"max": 100, "message": "you want to go out? don't"},
		{"max": 120, "message": "wtf go move to Canada"},
		{"max": 10000, "message": "What planet do you live on?"},
		{
			"max": 10000000000,
			"message": "Greetings future humans. This is the Diamond Dwerp seal, speaking to you from AD 2020." +
			" Back in my days, we had a civilization called New York City, where we reached high temperatures of around 90 degrees." +
			" Farenheight, that is. Farenheight. It's an American measurement unit. If you are reading this right now, if you manage to " +
			"come across this from srs bot - there is something very, very, very wrong. You see, the temperature here should be... abnormal " +
			"... but this seems to be New York City now. It's not what it used to be - leave. NOW."
		}
	];

	//The first object in this array is the most appropriate value for the situation since it is just above the minimum num threshold
	let matches = x.filter((json) => {
		return highTemp < json.max;
	});

	return matches[0].message;
}