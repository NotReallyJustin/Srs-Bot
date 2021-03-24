/* API Attribution: https://sunrise-sunset.org/api 
   Hey cat look! I'm using an api for once lmao     */
const https = require("https");
const Helpy = require("../Helpy.js")
const Discord = require("discord.js");

const desc = "Displays the sunrise and sunset time of a location! Also displays a bunch of twilights that idk the meaning of :P\n" + 
	"Syntax: `srs solarCycle [latitude] [longitude] [INTL timezone conventions]`\n" +
	"If latitude or longitude is not specified, this defaults to NYC. If timezone is not defined, this resorts to America/New_York";

module.exports = {
	name: "solarCycle",
	description: desc,
	execute: (message, args) => {
		let lat = 40.730610;
		let long = -73.935242;
		let tmz = "America/New_York";

		//Makes sure the args are defined & adjusts long and lat
		if (+args[0] && +args[1])
		{
			lat = +args[0];
			long = +args[1];
		}

		if (args[2])
		{
			tmz = args[2];
		}

		https.get(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${long}&date=today&formatted=0`, response => {
			response.on("data", data => {
				let json = JSON.parse(data).results;
				message.channel.send(solarEmbed(json, lat, long, tmz));
			})
		});
	}
}

//Precondition: data is formatted via the http request
const solarEmbed = (data, lat, long, tmz) => {
	let embed = new Discord.MessageEmbed();
	embed.setAuthor("Srs Bot", "https://i.imgur.com/Bnn7jox.png");
	embed.setColor('DARK_BLUE');
	embed.setTitle("Solar Cycle");

	embed.setDescription(`Solar data of Latitude: ${lat} - Longitude: ${long}\n` +
		`Sunrise: ${tmzHour(data.sunrise, tmz)} \n` +
		`Sunset: ${tmzHour(data.sunset, tmz)} \n` +
		`Noon: ${tmzHour(data.solar_noon, tmz)} \n` +
		`Day Length: ${data.day_length} \n` +
		`Civil Twilight Start: ${tmzHour(data.civil_twilight_begin, tmz)}\n` +
		`Civil Twilight End: ${tmzHour(data.civil_twilight_end, tmz)} \n` +
		`Nautical Twilight Start: ${tmzHour(data.nautical_twilight_begin, tmz)} \n` +
		`Nautical Twilight End: ${tmzHour(data.nautical_twilight_end, tmz)} \n` +
		`Astronomical Twilight Start: ${tmzHour(data.astronomical_twilight_begin, tmz)} \n` +
		`Astronomical Twilight End: ${tmzHour(data.astronomical_twilight_end, tmz)}`);

	return embed;
}

//Converts to timezone hour
const tmzHour = (time, tmz) => {
	//lmao first time converted is used here and not referring to light mode
	let converted = Helpy.tmzConvert(time, tmz);
	return converted.substring(converted.indexOf(", ") + 2);
}