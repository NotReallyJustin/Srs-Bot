//Christmas 2020
//YES WE ARE MAKING STEVEN ANGRY BY ... WEB SCRAPING OFF REDDIT!
const Discord = require("discord.js");
const VC = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const Helpy = require("../Helpy.js");
const https = require("https");
const justinId = "348208769941110784";

//console.log(VC.generateDependencyReport())

//------------------------CHRISTMAS GREETINGS--------------------------
const christmasGreetings = [
	"Merry Christmas!",
	"Wishing you a Merry Christmas!",
	'Unwrap yourself a joyful Christmas!',
	'Have a holly, jolly Christmas!',
	'Merry Christmas with lots of love',
	'Have yourself a Merry little Christmas!',
	'Ho Ho Hope you’ve been good this year. Merry Christmas!',
	'It’s the most wonderful time of the year!',
	'Christmas cheers!!',
	'May the magic and thrill of the holiday season stretch on!',
	"feliz navidad!",
	"Grab your eggnog folks, because it's CHRISTMAS TIME",
	"Hey, have you tried `srs christmas`? - wait we got rid of that",
	"CHRISTMAS GANG UNITE!",
	"Dyker Christmas Tree Time!",
	"Mariah Carey is probably trending again",
	"Have a holly jolly Christmas!",
	"It's Christmas Charlie Brown!",
	"Here's to 2021!",
	"smh where's my present",
	"hey what did you get your fellow college alum for christmas this year?",
	"IT'S BEGINNING TO LOOK ALOT LIKE CHRISTMAS!!!",
	"I hope you get as lit as a tree this year",
	"Let’s enjoy the Christmas season until our credit card bills arrive",
	"Let’s be naughty and save Santa a trip",
	"Check yo’ elf before you wreck yo’ elf",
	"It’s all fun and games until Santa checks the naughty list",
	"You have resting Grinch face",
	"Don’t get your tinsel in a tangle",
	"I’m dreaming of a white Christmas… but if the white runs outs, I’ll drink red",
	"Dear Santa, just leave your credit card under the tree",
	"Christmas is magical — all my money magically disappears!",
	"Dear Santa, I was good yesterday… that should count!!!"
];

//---------------------------------Christmas Playlist - For MangoDb upload only-------------------------------------
const christmasPlaylist = [
	"https://www.youtube.com/watch?v=yXQViqx6GMY&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=E8gmARGvPlI&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=5vyMuxxLsD0&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=KmddeUJJEuU&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=lD1fa8KJHdY&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=EM2Fnp_qnE8&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=BgdLdl60EMA&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=DkXIJe8CaIc&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=76WFkKp8Tjs&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=vqv0ge_5Nsw&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=CxQlwEokeuo&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=oZ5cmrz-mrU&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=sE3uRRFVsmc&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=r1uJPGRfO5Y&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=haFHrfmfHbc&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=s4J1JXnBDFk&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=cHzeTKPlbJg&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=INxgntXkXhU&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=wKj92352UAE&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=lylWDAo9hFw&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=b9XNyeeJZ2k&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=WaNwEkCeZrE&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=iCiEHrexjvg&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=qlWp9B7hr3A&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=_MzumcY3lpk&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=JlqoVScLhe8&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=oVVdNWX_5Go&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=Mk_GmhD053E&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=W_b7GRoBMMk&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=J-8VCL4uSUc&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=N-PyWfVkjZc&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=ifCWN5pJGIE&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=TLl7BtV0FJ4&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=9vu4AN2bc-M&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=AN_R4pR1hck&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=Iuewgu8z4Rc&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=dyaP_i0xFgs&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=QJ5DOWPGxwg&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=5QFKKap5V3U&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=2P8RU_dHyi4&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=CLr1AYRBS0A&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=9LVWsXau1BU&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=xvZ2pbEQkFo&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=O9N4CjQs6a4&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=CquXc3kMurg&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=E8_TvLkM-zo&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=HZNShYZjjWk&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=OjPm0o04lGE&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=w9QLn7gM-hY&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=JyVEKsNFDjw&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=j-_1-uJ6Ml4&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=XMcTQveNdnw&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=Rk-gTW_m2po&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=IhGuAJUumHk&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=Q63O54RuL-o&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=QjsjIXCrwgA&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=U_simrq_9M8&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=5fOpBMk50d8&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=eHMT89J6Pos&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=wtgGBgpNcIo&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=73-mmd7RyS0&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=J_QGZspO4gg&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=4PzetPqepXA&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=_KWFEdqTrmw&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=cB66Xn7yvec&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=BEJmP8T07JU&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=AbgxDgVmMF0&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=pFjdfjrtf1Q&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=LUjn3RpkcKY&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=BWTHptfwXjY&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=XO7Cubs4zVw&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=fppHWum93sA&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=ZCqhX89WV_0&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=SaEedtRHklg&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=amK4U4pCTB8&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=IbRtGMm96F8&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=94t-kNqOQu8&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=o10drRI3VQ0&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=CziCidR4KcY&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=-w7jyVHocTk&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=z8Vfp48laS8&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=eObZbLhbMH8&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=6KPoDbO4JV0&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=iEWFhzFWtkM&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=q6JN64KVSwk&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=HSgGWDyFZKI&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=BFOVIAMNIxM&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=pL8k7wLQ_Rc&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=IippcraBPKA&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=anuggCrmdAw&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=Mj7Pr42rliI&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=dNCTL9Gz-xw&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=S-9gxB8kY2I&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=7oTp71aY80I&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=xjLTDaCUYuQ&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=Rx8DeYDY-0A&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=L1nQpoAvTSg&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=2I0DON1eVvk&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=0bdOlkibtAw&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=RN24vMAFz3c&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=rPlYReRGEhA&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=NT8pIpzDX0g&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=_wr9_yDXxH0&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=ZkWSAgR4J24&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=jdm123WYV9k&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=Si3iXE3FUIE&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=dVtcBEjbR8g&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=eSEaBe9zqlg&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=JXVh-wwiwNg&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=IYwCdREfv88&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=nx30HzgjFOA&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=OR07r0ZMFb8&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=ogZaStZP2HU&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=y7PPB2bIu7U&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=j9jbdgZidu8&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=2HkJHApgKqw&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=r89CjMZDQpQ&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=apoFZv5J6xo&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi",
	"https://www.youtube.com/watch?v=NJ6kJ7GWtv0&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi"
];
//--------------------Command to Upload-------------------------------------------------------------
/*const Mango = new require("mongodb").MongoClient;
const mango = new Mango('REDACTED lmao I'm not open sourcing this again');
let connectionPromise = mango.connect()
connectionPromise.then(() => {
	mangoDatabase = mango.db("BotData").collection("Christmas Playlist");
	mangoDatabase.insertMany(christmasPlaylist.map(x => {
		return {"link": x};
	}), { ordered: false });
});

return;*/
//-------------------------------CHRISTMAS CMD---------------------------------------------------
module.exports = {
	name: "christmas",
	description: "IT'S A 2021 CHRISTMAS!!! Access the go-to Christmas hub here!",
	type: "SUB_COMMAND_GROUP",
	options: [
		{
			name: "greeting",
			type: "SUB_COMMAND",
			description: "WE WISH YOU A MERRY CHRISTMAS!"
		},
		{
			name: "countdown",
			type: "SUB_COMMAND",
			description: "🎄 START THE CHRISTMAS COUNTDOWN!!! 🎄"
		},
		{
			name: "radio",
			type: "SUB_COMMAND",
			description: "Designate a Christmas radio channel where Srs Bot will play forever. Only accessible by Justin 🔔",
			options: [
				{
				    name: "snowflake",
				    description: "Channel snowflake",
				    required: true,
				    type: "STRING"
				},
				{
					name: "toggle",
					description: "Are you turning the radio on or off?",
					required: true,
					type: "BOOLEAN"
				}
			]
		},
		{
			name: "snapshot",
			type: "SUB_COMMAND",
			description: "❄️ It's the most wonderful time of the year ❄️"
		}
	],
	execute: async (interaction, toolkit) => {
		const subName = interaction.options.getSubcommand(true);
		if (!subName)
		{
			interaction.reply("smh you have an invalid subcommand");
			return;
		}

		const subCmd = interaction.options.data[0];
		switch(subName)
		{
			case "greeting":
				interaction.reply(Helpy.randomResp(christmasGreetings));
			break;

			case "countdown":
				let merryChristmas = new Date(2021, 11, 25);
				interaction.reply(`${Helpy.dateDistance(new Date(), merryChristmas)} days until Christmas! ❄️`);
			break;

			case "radio":
				var toggle = subCmd.options[1].value;
				if (interaction.user.id != justinId)
				{
					interaction.reply("smh you're not Justin");
					return;
				}

				//subCmd.options[0].value is the vc snowflake
				toolkit.bot.channels.fetch(subCmd.options[0].value).then(async (vcChannel) => {
					let dbRef = toolkit.bot.database.getServer(interaction.guildId);
					if (!vcChannel.isVoice())
					{
						interaction.reply("smh this is not a VC");
						return;
					}

					if (toggle)
					{
						if (dbRef.vcConnection || dbRef.vcSubscription)
						{
							interaction.reply("buddy there is already an active VC in this server");
							return;
						}

						await interaction.deferReply();
						dbRef.vcConnection = VC.joinVoiceChannel({
							channelId: subCmd.options[0].value,
							guildId: interaction.guildId,
							adapterCreator: interaction.guild.voiceAdapterCreator
						});

						dbRef.vcConnection.on(VC.VoiceConnectionStatus.Ready, () => {
							interaction.editReply("Logged into VC!");

							//Audio Player - radio will be exclusive to each server so people don't go crazy listening to the same song in all servers

							let christmasPlayer = VC.createAudioPlayer({
								behaviors: {
									noSubscriber: VC.NoSubscriberBehavior.Pause
								}
							});

							const recursive = () => {
								toolkit.mangoDatabase.collection("Christmas Playlist").aggregate([{"$sample":{size: 1}}]).next()
								.then(song => {
									if (ytdl.validateURL(song.link))
									{
										christmasPlayer.play(VC.createAudioResource(ytdl(song.link, {quality: 'highestaudio', filter: 'audioonly'})));
									}
									else
									{
										recursive();
									}
								});
							}

							christmasPlayer.on(VC.AudioPlayerStatus.AutoPaused, () => christmasPlayer.stop(true));
							christmasPlayer.on(VC.AudioPlayerStatus.Idle, () => {
								recursive();
							});

							christmasPlayer.on('error', error => {
								console.error(error);
							});

							dbRef.vcSubscription = dbRef.vcConnection.subscribe(christmasPlayer);
							recursive();
						});

						dbRef.vcConnection.on(VC.VoiceConnectionStatus.Disconnected, () => {
							Promise.any([
								VC.entersState(dbRef.connection, VC.VoiceConnectionStatus.Signalling, 5000),
								VC.entersState(dbRef.connection, VC.VoiceConnectionStatus.Connecting, 5000),
							]).catch(err => {
								console.error(err);
								destroyConnection(dbRef);
							});
						});

						dbRef.vcConnection.on(VC.VoiceConnectionStatus.Destroyed, () => {
							destroyConnection(dbRef);
						});	
					}
					else
					{
						if (!dbRef.vcConnection || !dbRef.vcSubscription)
						{
							interaction.reply("buddy there is no active VC");
							return;
						}
						
						destroyConnection(dbRef);
						interaction.reply("Disconnected!");
					}					
				}).catch(err => { 
					//console.error(err)
					interaction.reply("smh the channel doesn't exist");
					return;
				});
			break;

			case "snapshot":
				await interaction.deferReply();
				https.get("https://www.reddit.com/r/christmas/new.json?limit=40", response => {
					var packets = "";

					response.on("data", data => {
						packets += data;
					});

					response.on("end", () => {
						let dataJSON = JSON.parse(packets);
						let post;

						let redditImg;
						while (!redditImg)
						{
							post = Helpy.randomResp(dataJSON.data.children);
							if (post.data.url_overridden_by_dest && post.data.url_overridden_by_dest.includes("i.redd.it"))
							{
								redditImg = post.data.url_overridden_by_dest;
							}
							else if (post.data.thumbnail && /https|http/.test(post.data.thumbnail))
							{
								redditImg = post.data.thumbnail;
							}
						}

						var x = christmasRedditEmbed(post.data.title, post.data.author, redditImg);
						interaction.editReply({embeds: [x]});
					});
				});
			break;

			default:
				interaction.reply(Helpy.randomResp(christmasPlaylist));
			break;
		}
	}
}

function destroyConnection(dbRef)
{
	try
	{
		dbRef.vcSubscription.removeAllListeners();
		dbRef.vcSubscription.unsubscribe();
		dbRef.vcSubscription.stop();
		dbRef.vcSubscription = null;
		dbRef.vcConnection.destroy(); //This is a known bug documented in discord.js issues; the command will work but it just throws an error for no reason. Ignore it.
	}
	catch(err)
	{
		//console.error(err);
	}

	dbRef.vcSubscription = null;
	dbRef.vcConnection = null;
}

const christmasRedditEmbed = (text, author, image) =>
{
	let redditDisplay = new Discord.MessageEmbed();
	redditDisplay.setAuthor("u/" + author);
	redditDisplay.setDescription(text);
	redditDisplay.setImage(image);
	redditDisplay.setColor((Math.round(Math.random()) ? "GREEN" : "RED"));

	return redditDisplay;
}

/*
const christmasRedditLink = fetchDOM =>
{
	let document = fetchDOM.window.document;

	//All reddit posts would have the thing class lmao - what does thing represent .-.
	//Filters out all trashy promotions
	let array = Array.from(document.getElementsByClassName("thing"));
	let parArr = array.filter((item) => !item.classList.contains("promoted"));

	//The posts start at idx 3
	var randIdx = Math.round(Math.random() * (parArr.length - 4)) + 3;

	return parArr[randIdx].querySelector("a").href;
}

const christmasRedditParse = fetchPage =>
{

	let document = fetchPage.window.document;
	let object = document.getElementsByClassName("top-matter")[0];

	var mediaLink = document.getElementsByClassName("preview");
	mediaLink = mediaLink.length == 0 ? document.getElementsByClassName("reddit-video-player-root")[0].getAttribute("data-seek-preview-url") : mediaLink[0].src;

	let redditJSON = {
		media: mediaLink,
		text: object.children[0].textContent,
		author: object.children[2].querySelector("a").textContent
	}

	return redditJSON;
}

const christmasRedditEmbed = (redditJSON, zeroOrOne) =>
{
	let redditDisplay = new Discord.MessageEmbed();
	redditDisplay.setAuthor("u/" + redditJSON.author);

	if (zeroOrOne)
	{
		redditDisplay.setColor("GREEN");
	}
	else
	{
		redditDisplay.setColor("RED");
	}

	redditDisplay.setDescription(redditJSON.text);
	redditDisplay.setImage(redditJSON.media);

	return redditDisplay;
}

const christmasStatus = (args, randomNum) =>
{
	if (args.length == 0)
	{
		return 200 + (randomNum * 0.1);
	}

	if (args[0] == "photo")
	{
		return 200.1;
	}

	if (args[0] == "playSong")
	{
		return 200.2;
	}

	if (args[0] == "playlist")
	{
		return 200.3;
	}

	if (args[0] == "stopSong")
	{
		return 200.4;
	}

	if (args[0] == "countdown")
	{
		return 200.99;
	}

	if (args[0] == "help")
	{
		return 300;
	}

	return 404;
}

const playlistStatus = args => {
	if (args.length == 1)
	{
		return 200.1;
	}

	if (args[1] == "upload")
	{
		if (args.length == 2)
		{
			return 404;
		}
		else
		{
			return 200.2;
		}
	}

	return 400;
}

//Plays a christmasy song on loop in a VC!
const playSong = (vcConnection, csongDb, serverObj, messageChannel) => {
	csongDb.aggregate([{"$sample":{size: 1}}]).next()
		.then(item => {
			let readStreamDL = ytdl(item.link, {quality: 'highestaudio'});
			let vcPlay = vcConnection.play(readStreamDL);

			vcPlay.on("start", () => {
				messageChannel.send(`Now playing ${item.link}`);
			});

			vcPlay.on("finish", () => { //go to node.js documentation not discord API
				messageChannel.send("Music Done!");
				if (serverObj.vcConnection)
				{
					vcPlay.destroy();
					this.playSong(vcConnection, csongDb, serverObj, messageChannel);
				}
				else
				{
					vcPlay.destroy();
				}
			});

			vcPlay.on("error", (err) => {
				console.log(err);
			})
		});
}*/