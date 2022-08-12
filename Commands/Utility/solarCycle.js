/* API Attribution: https://sunrise-sunset.org/api 
   Hey cat look! I'm using an api for once lmao     */
const http = require("http");
const Helpy = require("../Helpy.js")
const Discord = require("discord.js");

const desc = "Displays the sunrise and sunset time of a location! Also displays a bunch of twilights that idk the meaning of :P\n" + 
	"Syntax: `srs solarCycle [latitude] [longitude] [INTL timezone conventions]`\n" +
	"If latitude or longitude is not specified, this defaults to NYC. If timezone is not defined, this resorts to America/New_York";

module.exports = {
	name: "solarcycle",
	description: "Displays the sunrise and sunset time of a location! Also a bunch of twilights idk the meaning of :P",
	options: [
		{
            name: "latitude",
            description: "I'm bad at geography, but it'll default to NYC if not specified",
            required: false,
            type: Discord.ApplicationCommandOptionType.Number
        },
        {
            name: "longitude",
            description: "This should be the vertical meridian thingy",
            required: false,
            type: Discord.ApplicationCommandOptionType.Number
        },
        {
            name: "intl",
            description: "INTL Timezone Conventions to display time in! Defaults to America/New_York if smth goes wrong",
            required: false,
            type: Discord.ApplicationCommandOptionType.String
        }
	],
	execute: async (interaction) => {
		await interaction.deferReply();

		let lat = interaction.options.getNumber('latitude');
		let long = interaction.options.getNumber('longitude');
		let tmz = interaction.options.getString('intl');

		if ((!lat && !long) || Math.abs(lat) > 180 || Math.abs(long) > 80)
		{
			lat = 40.730610;
			long = -73.935242;
		}

		if (!tmz)
		{
			tmz = 'America/New_York';
		}
		
		http.get(`http://api.sunrise-sunset.org/json?lat=${lat}&lng=${long}&date=today&formatted=0`, response => {
			var blob = "";
			response.on("data", data => {
				blob += data;
			});

			response.on("end", () => {
				let json = JSON.parse(blob).results;
				interaction.editReply({embeds: [solarEmbed(json, lat, long, tmz)]});
			});

			response.on("error", (err) => {
				console.error(err);
				interaction.editReply('hmm smth went wrong');
			});
		});
	}
}

//Precondition: data is formatted via the http request
const solarEmbed = (data, lat, long, tmz) => {
	let embed = new Discord.EmbedBuilder();
	embed.setAuthor({
		name: "Srs Bot",
		iconURL: "https://i.imgur.com/Bnn7jox.png"
	});
	embed.setColor('DarkBlue');
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