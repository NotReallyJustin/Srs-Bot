//Christmas 2020
//YES WE ARE MAKING STEVEN ANGRY BY ... WEB SCRAPING OFF REDDIT!
const ytdl = require("ytdl-core");
const { JSDOM } = require("jsdom");
const Discord = require("discord.js");
const Helpy = require("../Helpy.js");

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
	"Hey, have you tried `srs christmas`?",
	"CHRISTMAS GANG UNITE!",
	"Dyker Christmas Tree Time!",
	"Light the candle! Parse the wand! Watch the fire glow!!!!!!",
	"Hell yea! Mariah Carey time!",
	"Have a holly jolly Christmas!",
	"It's Christmas Charlie Brown!",
	"Here's to 2020!",
	"smh where's my present",
	"hey what did you get your fellow college alum for christmas this year?",
	"cheers from my college!",
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
	"Dear Santa, I was good yesterday… that should count!!!",
	"I'm just a mouse at this point, but even Jerry celebrates Christmas!"
];

//Only used to upload this insane playlist to mongoDb lmao
const christmasPlaylist = [
	"https://www.youtube.com/watch?v=KC4ohcVJ7K0&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=1",
	"https://www.youtube.com/watch?v=yXQViqx6GMY&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=2",
	"https://www.youtube.com/watch?v=E8gmARGvPlI&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=3",
	"https://www.youtube.com/watch?v=5vyMuxxLsD0&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=4",
	"https://www.youtube.com/watch?v=KmddeUJJEuU&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=5",
	"https://www.youtube.com/watch?v=lD1fa8KJHdY&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=6",
	"https://www.youtube.com/watch?v=EM2Fnp_qnE8&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=7",
	"https://www.youtube.com/watch?v=BgdLdl60EMA&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=8",
	"https://www.youtube.com/watch?v=DkXIJe8CaIc&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=9",
	"https://www.youtube.com/watch?v=76WFkKp8Tjs&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=10",
	"https://www.youtube.com/watch?v=vqv0ge_5Nsw&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=11",
	"https://www.youtube.com/watch?v=CxQlwEokeuo&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=12",
	"https://www.youtube.com/watch?v=oZ5cmrz-mrU&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=13",
	"https://www.youtube.com/watch?v=sE3uRRFVsmc&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=14",
	"https://www.youtube.com/watch?v=r1uJPGRfO5Y&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=15",
	"https://www.youtube.com/watch?v=haFHrfmfHbc&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=16",
	"https://www.youtube.com/watch?v=s4J1JXnBDFk&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=17",
	"https://www.youtube.com/watch?v=cHzeTKPlbJg&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=18",
	"https://www.youtube.com/watch?v=INxgntXkXhU&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=19",
	"https://www.youtube.com/watch?v=wKj92352UAE&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=20",
	"https://www.youtube.com/watch?v=lylWDAo9hFw&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=21",
	"https://www.youtube.com/watch?v=b9XNyeeJZ2k&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=22",
	"https://www.youtube.com/watch?v=WaNwEkCeZrE&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=23",
	"https://www.youtube.com/watch?v=iCiEHrexjvg&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=24",
	"https://www.youtube.com/watch?v=qlWp9B7hr3A&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=25",
	"https://www.youtube.com/watch?v=_MzumcY3lpk&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=26",
	"https://www.youtube.com/watch?v=JlqoVScLhe8&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=27",
	"https://www.youtube.com/watch?v=oVVdNWX_5Go&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=28",
	"https://www.youtube.com/watch?v=Mk_GmhD053E&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=29",
	"https://www.youtube.com/watch?v=W_b7GRoBMMk&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=30",
	"https://www.youtube.com/watch?v=J-8VCL4uSUc&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=31",
	"https://www.youtube.com/watch?v=N-PyWfVkjZc&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=32",
	"https://www.youtube.com/watch?v=ifCWN5pJGIE&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=33",
	"https://www.youtube.com/watch?v=TLl7BtV0FJ4&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=34",
	"https://www.youtube.com/watch?v=9vu4AN2bc-M&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=35",
	"https://www.youtube.com/watch?v=AN_R4pR1hck&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=36",
	"https://www.youtube.com/watch?v=Iuewgu8z4Rc&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=37",
	"https://www.youtube.com/watch?v=dyaP_i0xFgs&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=38",
	"https://www.youtube.com/watch?v=QJ5DOWPGxwg&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=39",
	"https://www.youtube.com/watch?v=5QFKKap5V3U&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=40",
	"https://www.youtube.com/watch?v=2P8RU_dHyi4&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=41",
	"https://www.youtube.com/watch?v=CLr1AYRBS0A&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=42",
	"https://www.youtube.com/watch?v=9LVWsXau1BU&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=43",
	"https://www.youtube.com/watch?v=xvZ2pbEQkFo&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=44",
	"https://www.youtube.com/watch?v=O9N4CjQs6a4&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=45",
	"https://www.youtube.com/watch?v=CquXc3kMurg&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=46",
	"https://www.youtube.com/watch?v=E8_TvLkM-zo&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=47",
	"https://www.youtube.com/watch?v=HZNShYZjjWk&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=48",
	"https://www.youtube.com/watch?v=OjPm0o04lGE&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=49",
	"https://www.youtube.com/watch?v=w9QLn7gM-hY&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=50",
	"https://www.youtube.com/watch?v=JyVEKsNFDjw&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=51",
	"https://www.youtube.com/watch?v=j-_1-uJ6Ml4&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=52",
	"https://www.youtube.com/watch?v=XMcTQveNdnw&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=53",
	"https://www.youtube.com/watch?v=Rk-gTW_m2po&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=54",
	"https://www.youtube.com/watch?v=IhGuAJUumHk&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=55",
	"https://www.youtube.com/watch?v=Q63O54RuL-o&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=56",
	"https://www.youtube.com/watch?v=QjsjIXCrwgA&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=57",
	"https://www.youtube.com/watch?v=U_simrq_9M8&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=58",
	"https://www.youtube.com/watch?v=5fOpBMk50d8&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=59",
	"https://www.youtube.com/watch?v=eHMT89J6Pos&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=60",
	"https://www.youtube.com/watch?v=wtgGBgpNcIo&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=61",
	"https://www.youtube.com/watch?v=73-mmd7RyS0&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=62",
	"https://www.youtube.com/watch?v=J_QGZspO4gg&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=63",
	"https://www.youtube.com/watch?v=4PzetPqepXA&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=64",
	"https://www.youtube.com/watch?v=_KWFEdqTrmw&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=65",
	"https://www.youtube.com/watch?v=cB66Xn7yvec&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=66",
	"https://www.youtube.com/watch?v=BEJmP8T07JU&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=67",
	"https://www.youtube.com/watch?v=AbgxDgVmMF0&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=68",
	"https://www.youtube.com/watch?v=pFjdfjrtf1Q&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=69",
	"https://www.youtube.com/watch?v=LUjn3RpkcKY&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=70",
	"https://www.youtube.com/watch?v=BWTHptfwXjY&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=71",
	"https://www.youtube.com/watch?v=XO7Cubs4zVw&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=72",
	"https://www.youtube.com/watch?v=fppHWum93sA&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=73",
	"https://www.youtube.com/watch?v=ZCqhX89WV_0&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=74",
	"https://www.youtube.com/watch?v=SaEedtRHklg&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=75",
	"https://www.youtube.com/watch?v=amK4U4pCTB8&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=76",
	"https://www.youtube.com/watch?v=IbRtGMm96F8&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=77",
	"https://www.youtube.com/watch?v=94t-kNqOQu8&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=78",
	"https://www.youtube.com/watch?v=o10drRI3VQ0&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=79",
	"https://www.youtube.com/watch?v=CziCidR4KcY&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=80",
	"https://www.youtube.com/watch?v=-w7jyVHocTk&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=81",
	"https://www.youtube.com/watch?v=z8Vfp48laS8&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=82",
	"https://www.youtube.com/watch?v=eObZbLhbMH8&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=83",
	"https://www.youtube.com/watch?v=6KPoDbO4JV0&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=84",
	"https://www.youtube.com/watch?v=iEWFhzFWtkM&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=85",
	"https://www.youtube.com/watch?v=q6JN64KVSwk&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=86",
	"https://www.youtube.com/watch?v=HSgGWDyFZKI&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=87",
	"https://www.youtube.com/watch?v=BFOVIAMNIxM&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=88",
	"https://www.youtube.com/watch?v=pL8k7wLQ_Rc&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=89",
	"https://www.youtube.com/watch?v=IippcraBPKA&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=90",
	"https://www.youtube.com/watch?v=anuggCrmdAw&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=91",
	"https://www.youtube.com/watch?v=Mj7Pr42rliI&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=92",
	"https://www.youtube.com/watch?v=dNCTL9Gz-xw&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=93",
	"https://www.youtube.com/watch?v=S-9gxB8kY2I&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=94",
	"https://www.youtube.com/watch?v=7oTp71aY80I&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=95",
	"https://www.youtube.com/watch?v=xjLTDaCUYuQ&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=96",
	"https://www.youtube.com/watch?v=Rx8DeYDY-0A&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=97",
	"https://www.youtube.com/watch?v=L1nQpoAvTSg&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=98",
	"https://www.youtube.com/watch?v=2I0DON1eVvk&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=99",
	"https://www.youtube.com/watch?v=0bdOlkibtAw&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=100",
	"https://www.youtube.com/watch?v=RN24vMAFz3c&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=101",
	"https://www.youtube.com/watch?v=rPlYReRGEhA&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=102",
	"https://www.youtube.com/watch?v=NT8pIpzDX0g&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=103",
	"https://www.youtube.com/watch?v=_wr9_yDXxH0&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=104",
	"https://www.youtube.com/watch?v=ZkWSAgR4J24&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=105",
	"https://www.youtube.com/watch?v=jdm123WYV9k&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=106",
	"https://www.youtube.com/watch?v=Si3iXE3FUIE&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=107",
	"https://www.youtube.com/watch?v=dVtcBEjbR8g&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=108",
	"https://www.youtube.com/watch?v=eSEaBe9zqlg&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=109",
	"https://www.youtube.com/watch?v=JXVh-wwiwNg&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=110",
	"https://www.youtube.com/watch?v=IYwCdREfv88&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=111",
	"https://www.youtube.com/watch?v=nx30HzgjFOA&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=112",
	"https://www.youtube.com/watch?v=OR07r0ZMFb8&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=113",
	"https://www.youtube.com/watch?v=ogZaStZP2HU&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=114",
	"https://www.youtube.com/watch?v=y7PPB2bIu7U&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=115",
	"https://www.youtube.com/watch?v=j9jbdgZidu8&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=116",
	"https://www.youtube.com/watch?v=2HkJHApgKqw&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=117",
	"https://www.youtube.com/watch?v=r89CjMZDQpQ&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=118",
	"https://www.youtube.com/watch?v=apoFZv5J6xo&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=119",
	"https://www.youtube.com/watch?v=NJ6kJ7GWtv0&list=PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi&index=120"
];

//This module export is no longer available until 12/21/2021
//When that time comes I'll be a senior doing college apps owo
//Time passes rly fast :cri:
module.exports = {
	name: "christmas",
	description: "Merry Christmas! The hub for everything christmas!\nCheck `srs commands` for hub commands!",
	execute: (message) => {
		message.channel.send("this holiday event is locked until 12/21/2021");
	}

	/*execute: (message, args, toolkit) => {
		//Determines a nice christmas thing!
		let christmasStatus = christmasStatus(args, Math.ceil(Math.random() * 1));
		let server = toolkit.bot.database.get(message.guild.id);

		switch(christmasStatus)
		{
			case 200.1:
				var fetchDOM = await JSDOM.fromURL("https://old.reddit.com/r/christmas/");
				var fetchPage = await JSDOM.fromURL(christmasRedditLink(fetchDOM))
				let redditJSON = christmasRedditParse(fetchPage);
				let imgEmbed = christmasRedditEmbed(Discord.MessageEmbed, redditJSON, Math.round(Math.random()));

				message.channel.send(imgEmbed);
			break;

			case 200.2:
				let vc = message.member.voice.channel;
				if (vc && !server.vcConnection)
				{
					let vcConnection = await vc.join();
					server.vcConnection = vcConnection;
					playSong(vcConnection, toolkit.mangoDatabase.collection("Christmas Playlist"), server, message.channel);
				}
				else
				{
					message.channel.send("smh either you're not in a vc or I'm already in a vc");
				}
			break;

			case 200.3:
				var collection = toolkit.mangoDatabase.collection("Christmas Playlist");
				let playlistStatus = playlistStatus(messageArray);

				switch (playlistStatus)
				{
					case 200.1:
						//Send a random christmas music
						collection.aggregate([{"$sample":{size: 1}}]).next()
							.then(item => {
								message.channel.send(item.link);
							});
					break;

					case 200.2:
						collection.insertOne({
							link: args[2]
						})

						message.channel.send("Your playlist has gone through :)");
					break;

					case 400:
						message.channel.send("hmm this command does no exist. Maybe try srs christmas music upload?");
					break;

					case 404:
						message.channel.send("smh give me a youtube link to upload to the Christmas Playlist");
					break;

					default:
						message.channel.send("hmm this isn't supposed to happen... maybe call Justin?");
					break;
				}

			break;

			case 200.4:
				let currVc = serverArray[serverSearchIdx].vcConnection;

				if (currVc)
				{
					server.vcConnection.disconnect();
					server.vcConnection = null;
				}
				else
				{
					message.channel.send("smh wym I'm not even in a vc");
				}
			break;

			case 200.99:
				let merryChristmas = new Date(2020, 11, 25);

				message.channel.send(`${Helpy.dateDistance(new Date(), merryChristmas)} days until Christmas!`);
				message.channel.send("when the time comes, we'll make this place more festive 😃");
			break;

			case 300:
				message.channel.send("The srs christmas command! Without any arguments, it'll return a random Christmas surprise." + 
					"Otherwise, try srs christmas [countdown|music|photo|playSong|stopSong]! Check out `srs command` for specifics!");
			break;

			case 404:
				message.channel.send("whoops! Looks like what you want doesn't exist! Don't worry, try `srs christmas help`!");
			break;

			default:
				message.channel.send("woah it's not supposed to get here uh... @JC23#7458");
			break;
		}
	}*/
}

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
}