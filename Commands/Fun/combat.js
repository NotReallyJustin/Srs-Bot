const Discord = require("discord.js");
const Helpy = require("../Helpy.js");

const emotePhotos = [
	'https://nitrocdn.com/wCXLSgWIQfDrGVjVNublasIQvIqjecSu/assets/static/optimized/rev-437a808/wp-content/uploads/2019/06/Super-Bright-Flashlight-1-950x500.jpg',
	'https://www.fonehouse.co.uk/blog/wp-content/uploads/2020/03/light-mode-vs-dark-mode.jpg',
	'https://techgirl.co.za/wp-content/uploads/2017/04/Image001.jpg',
	'https://physicsworld.com/wp-content/uploads/2019/06/Twisted-light.jpg',
	'https://cdn-prod.medicalnewstoday.com/content/images/articles/323/323636/blue-light-style.jpg',
	'https://st3.depositphotos.com/16131148/18376/v/600/depositphotos_183761924-stock-video-exploding-blue-light.jpg',
	'https://i.imgur.com/UZlH3Dj.png',
	'https://i.imgur.com/uKJxqEt.png'
];

const moves = [
	{
		name: "Attack",
		faction: "Neutral",
		images: [
			"https://i2.wp.com/www.ksiglobal.org/wp-content/uploads/2019/02/light-dark-period-am-i-pregnant-vs-wallpaper-desktop-background-download-particle-windows.jpg?fit=970%2C497&ssl=1",
			"https://i.pinimg.com/originals/9b/1d/4b/9b1d4b3ebc157611a6fed84f16afc0a6.jpg",
			"https://i.pinimg.com/originals/5f/93/e4/5f93e4aacb54f06dadcb557735815781.jpg",
			"https://static8.depositphotos.com/1162190/924/i/600/depositphotos_9249865-stock-photo-heaven-and-hell.jpg"
		],
		use: (you, opponent, log, pRef) => {
			var dmg = Math.round((10 - opponent.defense) * 0.1 * you.attack * 5);
			if (Math.floor(Math.random() * 4) == 0) {
			 	dmg = dmg * 3; 
			 	log.push(`${you.name} rolled a crit!`); 
			}

			opponent.hp -= dmg;
			opponent.defense = Math.max(0, opponent.defense - 1);
			log.push(`${you.name} attacked for ${dmg} damage!`);
			if (Math.floor(Math.random() * 3) == 0)
			{
				you.attack = Math.min(10, you.attack + 1);
				log.push(`${you.name} gained +1 attack!`);
			}
		}
	},
	{
		name: "Defend",
		faction: "Neutral",
		images: [
			"https://itsecuritycentral.teramind.co/wp-content/uploads/2017/06/shutterstock_644147209.jpg",
			"https://previews.123rf.com/images/your123/your1231709/your123170900007/85859040-cyber-security-concept-shield-with-keyhole-icon-on-digital-data-background-illustrates-cyber-data-se.jpg",
			"https://iiot-world.com/wp-content/uploads/2017/04/hi-tech-shield-cyber-security-digital-data-network-protection.jpg"
		],
		use: (you, opponent, log, pRef) => {
			you.defense = Math.min(10, you.defense + 2);
			log.push(`${you.name} defended and gained +2 defense!`);
		}
	},
	{
		name: "Holy Water",
		faction: "Light",
		images: [
			"https://media2.giphy.com/media/GRvfvkx2Gvrkk/200.gif",
			"https://static.wikia.nocookie.net/buffy/images/9/98/Holy_water.jpg/revision/latest?cb=20200829203305",
			"https://publisher-publish.s3.eu-central-1.amazonaws.com/pb-ncregister/swp/hv9hms/media/20200826220832_5f46c765c2bf74d8ccd8aadbjpeg.jpeg",
			"https://i.guim.co.uk/img/media/b18b5de128ca7c955c1817fe4f055945b78edbd8/0_220_4875_2925/master/4875.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=29dc883b06925bd14c9867119e0dd0a8"
		],
		use: (you, opponent, log, pRef) => {
			you.hp += 20;
			var txt = pRef ? "Light mode goes to Church Prime and splashes holy water! It gains 30HP!" : `Holy Damn! You actually listened to Justin and went to church (or that local temple)! You splash holy water on yourself and gained 20 HP!`;
			log.push(txt);
		}
	},
	{
		name: "Seal Team 6",
		faction: "Light",
		images: [
			"https://media0.giphy.com/media/2xPSPn5uuNUbu/giphy.gif?cid=ecf05e47ol8902oc879n5matod1jb8ojp7hx8ulnrpknya5y&rid=giphy.gif",
			"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTcvH9gGNspdPpku3-ETOR0mFtr1Z25frO-A&usqp=CAU",
			"https://media4.giphy.com/media/tH9OYb35SciDzCknOb/giphy.gif?cid=ecf05e472untecud1nnp6w2019z1y2nstp3p2l9rl6rgc8dw&rid=giphy.gif",
			"https://images05.military.com/sites/default/files/2019-10/Bell-360-Invictus-rendering-2-1800.jpg",
			"https://i2-prod.mirror.co.uk/incoming/article12041428.ece/ALTERNATES/s615b/Putins-real-life-Navy-seals-Cute-mammals-could-plant-explosives-and-attack-Russias-enemies.jpg"
		],
		use: (you, opponent, log, pRef) => {
			opponent.hp = 0;

			var txt;
			if (pRef)
			{
				txt = `Dark mode is getting out of hand, so light mode decides to call Seal to help. However, the phone call accidentally redirects to the US Special Forces, and they have sent the Navy Seals.\n` +
				"Dark Mode is flashbanged and gunned down to 0 HP with AK47s and Stun Batons!"
			}
			else
			{
				txt = `Dark mode is getting out of hand, so you decide to call Seal to help. However, your phone call accidentally redirects to the US Special Forces, and they have sent the Navy Seals.\n` +
				"Dark Mode is flashbanged and gunned down to 0 HP with AK47s and Stun Batons!";
			}

			log.push(txt);
		}
	},
	{
		name: "Flashbang",
		faction: "Light",
		images: [
			"https://i.redd.it/tnhql2xos0141.jpg",
			"https://i.ytimg.com/vi/UdJJ-kxTA1o/maxresdefault.jpg",
			"https://media1.tenor.com/images/b951608e7d8a261582c81ac1f2d988ff/tenor.gif?itemid=5346750",
			"https://static.wikia.nocookie.net/harrypotter/images/7/77/Lumos_Solem.gif/revision/latest/smart/width/250/height/250?cb=20190402142857"
		],
		use: (you, opponent, log, pRef) => {
			opponent.defense = 0;
			var txt = pRef ? "Light mode takes a screenshot! Dark mode has been flashbanged and they can't defend anymore! \nDark Mode defense drops to 0!" : `You took a screenshot. Dark Mode has been flashbanged and they can't defend anymore! Dark Mode defense drops to 0!`
			log.push(txt);
		}
	},
	{
		name: "Perfect Armor",
		faction: "Light",
		images: [
			"https://i.ytimg.com/vi/HSBvu7R85pI/maxresdefault.jpg",
			"blob:https://imgur.com/4c21d2ed-6277-4c6e-8a5e-b5a432fc0e96",
			"https://i.imgur.com/uxvTJVZ.png"
		],
		use: (you, opponent, log, pRef) => {
			you.defense = 10;
			var txt = pRef ? "Light Mode reaches for their ender chest, and grabs a set ot Tier 12 absolutely perfect armor. Damage Reduction 100." : `You reached into your ender chest and grabbed a set of Tier 12 Perfect Armor. You now have 100% damage reduction. It's too dangerous to get out there alone.`;
			log.push(txt);
		}
	},
	{
		name: "Divine Bolt",
		faction: "Light",
		images: [
			"https://i.imgur.com/1tUw49p.png",
			"https://thumbs.gfycat.com/AlienatedCornyGourami-max-1mb.gif",
			"https://i.pinimg.com/originals/3f/7b/2f/3f7b2faec2cc185d2a3a89c4b51738d5.jpg",
			"https://static.wikia.nocookie.net/narutofanon/images/e/e0/Raijin-niss.jpg"
		],
		use: (you, opponent, log, pRef) => {
			opponent.hp -= Math.floor(Math.random() * 10) + 40;

			if (pRef)
			{
				opponent.attack -= 1;
			}

			var txt = pRef ? "Light Mode summons adora to strike a massive divine bolt on Dark Mode!\nDark Mode takes massive amounts of damage and has been stunned!" : `Justin has run out of ideas, so you summon Adora from BTD6 and have her use a divine bolt on Dark Mode.\nYou deal massive amounts of damage!`;
			log.push(txt);
		}				
	},
	{
		name: "Ground Zero",
		faction: "Light",
		images: [
			"https://static.wikia.nocookie.net/b__/images/f/f0/040-MonkeyAce.png/revision/latest?cb=20190522024322&path-prefix=bloons",
			"https://i.ytimg.com/vi/Y05Nl67Thi4/sddefault.jpg",
			"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWwOseLvvVu9U9X7UmWZNEYK1mzOuEi-DVyw&usqp=CAU",
			"https://static.wikia.nocookie.net/b__/images/0/04/BTD6_Monkey_Ace.png/revision/latest?cb=20180616150015&path-prefix=bloons"
		],
		use: (you, opponent, log) => {
			opponent.hp = Math.round(opponent.hp / 2);
			opponent.attack = Math.ceil(opponent.attack / 2);
			opponent.defense = Math.floor(opponent.defense / 2);
			log.push(`Rules of modern warfare: if you can't beat 'em, nuke 'em.\nAll of Dark Mode's stats have been halved!`);
		}
	},
	{
		name: "Lightsaber",
		faction: "Light",
		images: [
			"https://media1.tenor.com/images/c2a171bca3020d8c44c5a5b1cc0df573/tenor.gif?itemid=18422516",
			"https://media.giphy.com/media/l0IpYf36OQy9O7ENW/giphy.gif",
			"https://media.tenor.com/images/1819015a364b29438ec4992308975812/tenor.gif",
			"https://media.tenor.com/images/a84a7d40253dbbfee86e18504cec1ed4/tenor.gif"
		],
		use: (you, opponent, log, pRef) => {
			var dmg = you.attack * 5;
			if (Math.floor(Math.random() * 4) == 0) { dmg = dmg * 3; }
			if (pRef) {dmg = dmg * 4; }

			opponent.hp -= dmg;

			var txt = pRef ? `Light Mode weaponizes *light*sabers and sliced through Dark Mode with a laser sword. Dark Mode takes ${dmg} damge!` : `You literally just sliced Dark Mode with a laser sword. Dark Mode takes ${dmg} damage!`;
			log.push(txt);
		}
	},
	{
		name: "Sword of Revealing Light",
		faction: "Light",
		pRef: true,
		images: [
			"https://i.imgur.com/Pv38kL0.jpg",
			"https://pm1.narvii.com/6305/f55eca1758d554b1ca3e7851495105e46752a983_hq.jpg",
			"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7ygDijIde5-R-oaMcc5vyBwIAne6TL516EENVic3QwNfj22jY2XK5OuDEinEAFUvDrrc&usqp=CAU",
			"https://static1.cbrimages.com/wordpress/wp-content/uploads/2019/09/Swords-of-Revealing-Light-1.jpg?q=50&fit=crop&w=740&h=370"
		],
		use: (you, opponent, log) => {

			you.attack += 10;
			you.hp += 10;
			opponent.blocked += 1;

			var txt = "Light Mode equips the Sword of Revealing Light. Damage massively increased! Light Mode is able to perform ShockWave attacks! Light mode stands become more effective!";
			log.push(txt);
		}
	},
	{
		name: "Sun",
		faction: "Light",
		pRef: true,
		images: [
			"https://static.jojowiki.com/images/thumb/d/d8/latest/20191015220014/Sun_Desert.png/401px-Sun_Desert.png",
			"https://static.wikia.nocookie.net/jjba/images/0/0e/Sun_powa.gif/revision/latest/scale-to-width-down/220?cb=20181019181516",
			"https://static.jojowiki.com/images/thumb/5/51/latest/20191015214438/TheSunstats.png/400px-TheSunstats.png",
			"https://i.kym-cdn.com/photos/images/original/001/935/300/423.jpg",
			"https://static.jojowiki.com/images/thumb/d/d8/latest/20191015220014/Sun_Desert.png/401px-Sun_Desert.png"
		],
		use: (you, opponent, log) => {

			opponent.hp -= Math.max(10, Math.round(Math.random() * 100));
			opponent.blocked += 1;
			you.hp = Math.max(1, you.hp - 10);

			var txt = "Light Mode summons the Sun, dealing drastic electromagnetic light to both users! Huh, who knew the sun itself is a stand?";
			log.push(txt);
		}
	},
	{
		name: "Star Platinum",
		faction: "Light",
		pRef: true,
		images: [
			"https://static.jojowiki.com/images/thumb/7/76/latest/20200226080957/SPTW_time_stop.gif/250px-SPTW_time_stop.gif",
			"https://pa1.narvii.com/6599/c4e5f90fcffa592a2ed9b18116de93150b1373a8_hq.gif",
			"https://pa1.narvii.com/6819/5f2c9eb85651f68935457fb0f5376cb47ae87754_hq.gif"
		],
		use: (you, opponent, log) => {

			var txt = "Light mode summons the Star Platinum! Time is now frozen for 3 turns for Dark Mode! Now that's enough time to hide from Duck for part skipping.";
			log.push(txt);

			opponent.blocked += 3;

			if (you.attack >= 10)
			{
				opponent.blocked += 2;
				log.push("The effects of the Sword of Revealing Light kicks in. Star Platinum stops Dark Mode for an extra 2 turns!");
			}
		}
	},
	{
		name: "Ripoff Pokemon",
		faction: "Light",
		pRef: true,
		images: [
			"http://qqpublic.qpic.cn/qq_public/0/0-3160735218-8E8696C02992809377699516E4FA57B3/0?fmt=jpg&size=98&h=706&w=839&ppv=1",
			"https://img.newyx.net/news_img/201304/09/1365488156.jpg",
			"http://n.7k7kimg.cn/2015/0510/1431224356756.gif",
			"http://n.7k7kimg.cn/2015/0601/1433140350714.jpg",
			"http://n.7k7kimg.cn/2015/0601/1433140350714.jpg"
		],
		use: (you, opponent, log) => {

			var txt = "Light Mode summons this weird Dimo thing! It's literally a ripoff Pokemon from China but hey, at least it does its job.\nThe vortex of light blinds Dark Mode and significantly drops Dark Mode's attack!";
			log.push(txt);

			opponent.attack -= 5;
			switch(Math.floor(Math.random() * 3))
			{
				case 0:
					opponent.blocked += 1;
					log.push("Dark Mode's is temporarily blinded.");
				break;

				case 1:
					var dmg = 100 - (10 * opponent.defense);
					opponent.hp -= dmg;

					if (dmg > 80)
					{
						log.push("Dimo summons a vortex of light that does colossal damage!");
					}
					else if (dmg > 30)
					{
						log.push("Dimo summons a vortex of light that does enormous damage!");
					}
					else
					{
						log.push("Dimo summons a powerful vortex of light! But thankfully, you have enough defense to tank it.");
					}
				break;

				case 2:
					you.hp += 50;
					log.push("This ripoff pokemon just went rogue. Now it's performing photosynthesis");
				break;
			}
		}
	},
	{
		name: "The Force",
		faction: "Dark",
		images: [
			"https://media1.giphy.com/media/l3fZOxBdAIOiyt8CQ/giphy.gif",
			"https://static.wikia.nocookie.net/powerlisting/images/0/07/Darth_Vader_Telekinetic_Choking.gif",
			"https://media4.giphy.com/media/8SxGru3XzElqg/giphy.gif"
		],
		use: (you, opponent, log) => {
			var dmg = you.attack * 5 + Math.round(Math.random() * 10);

			opponent.hp -= dmg;
			log.push(`You summon the force of the Dark Side. Light mode takes ${dmg} damage!`);
		}
	},
	{
		name: "Sword of Concealing Light",
		faction: "Dark",
		images: [
			"https://52f4e29a8321344e30ae-0f55c9129972ac85d6b1f4e703468e6b.ssl.cf2.rackcdn.com/products/pictures/1054792.jpg",
			"https://www.picclickimg.com/d/l400/pict/324066263019_/Yugioh-Swords-of-Concealing-Light-LCYW-EN281-Ultra-Rare.jpg"
		],
		use: (you, opponent, log) => {
			opponent.attack = Math.min(0, opponent.attack - 2);
			you.tof += 1;
			log.push("You equip the sword of concealing light! Light Mode's attack has been decreased by 2! True offense increased by 1!");
		}
	},
	{
		name: "To Arms!",
		faction: "Dark",
		images: [
			"https://thumbs.gfycat.com/DistantMatureHummingbird-max-1mb.gif",
			"https://media1.tenor.com/images/3b4e9f2bbbb4774836251fd19e3bdb33/tenor.gif?itemid=5575193",
			"https://68.media.tumblr.com/3700f81d3987e7d02c3a154596fd08a2/tumblr_olzzzo4FHo1w6jsdfo2_540.gif"
		],
		use: (you, opponent, log) => {
			you.defense += 1;
			you.attack += 1;
			you.hp += 1;
			you.tdf += 1;

			log.push("You summon Darth Vader. He instantly appears, ready to battle. All your stats have been increased! True defense increased by 1!");
		}
	},
	{
		name: "Peruvian Instant Darkness Powder",
		faction: "Dark",
		images: [
			"https://i.etsystatic.com/10909014/r/il/92d1d0/1929117320/il_570xN.1929117320_r514.jpg",
			"https://i.pinimg.com/originals/ae/19/93/ae19934e7e321e48898c168a7a39c982.jpg",
			"https://static.wikia.nocookie.net/harrypotter/images/0/0c/Peruvian_Instant_Darkness_Powder_display_in_WWW_shop.JPG/revision/latest?cb=20091119004808",
			"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaVGv1Uzkj1RVxP6Ed360OlK2AsY5N2LFExw&usqp=CAU"
		],
		use: (you, opponent, log) => {
			opponent.defense = 0;

			log.push("You chucked some instant darkness powder! Light Mode is temporarily blinded! Light Mode defense drops to 0!");
		}
	},
	{
		name: "Order 66",
		faction: "Dark",
		images: [
			"https://pa1.narvii.com/7546/27bc1f364b088102dd4f4c62fbf841b4ff5c2aefr1-480-208_hq.gif",
			"https://i.makeagif.com/media/7-28-2018/gz6e0i.gif",
			"https://pa1.narvii.com/7546/27bc1f364b088102dd4f4c62fbf841b4ff5c2aefr1-480-208_hq.gif",
			"https://qph.fs.quoracdn.net/main-qimg-876d0524109bdb9343648e40616c6d5a"
		],
		use: (you, opponent, log) => {
			if (opponent.hp >= 100)
			{
				log.push("Order 66 executed. Light Mode must be baby yoda because it survived this attack.");
			}
			else
			{
				log.push("Commander Cody, the time has come. Execute Order 66.");
			}
			opponent.hp = Math.max(0, opponent.hp - 99);
		}
	}
];


module.exports = {
	name: "combat",
	description: "Light mode vs Dark Mode. I swear it's not rigged.\nSyntax: `srs combat <start | end | rules>`",
	execute: (message, args, toolkit, currentChannel) => {
		switch (args[0])
		{
			case "start":
			case "dark":
				let hasOtherGame = currentChannel.hasValidMoves(message.author.id);
				let gameTrack = [{hp: 100, defense: 0, attack: 1, name: "Light Mode", blocked: 0}, {hp: 100, defense: 0, attack: 1, name: "Dark Mode", blocked: 0, tdf: 0, tof: 0}];

				//These 4 variables determine light mode/dark mode
				let isLight = args[0] == "start";
				let botMove = isLight ? darkModeAI : lightModeAI;
				let player = isLight ? gameTrack[0] : gameTrack[1];
				let bot = isLight ? gameTrack[1] : gameTrack[0];
				let pRef = !isLight; //This is more just for QOL and for me to understand that this actually refers to pRef, which is only possible when opponent is dark mode

				if (hasOtherGame)
				{
					message.channel.send("You have other games going on. You can't start this new game.");
					return;
				}

				message.channel.send(combatEmbed(gameTrack, "N/A", Helpy.randomResp(emotePhotos), isLight))
					.then(msgObj => {
						//Do your magic!
						function playMove(messageContent, message)
						{
							var gameEnd = false;
							var botPhoto;
							var attacks = moves.filter(x => x.name.toUpperCase() == messageContent.toUpperCase() && (x.faction == "Neutral" || player.name.includes(x.faction)) && (x.pRef == undefined || x.pRef == pRef ));
							if (attacks.length)
							{
								var log = [""];
								if (player.blocked)
								{
									player.blocked -= 1;
									log.push("You tried to attack, but it fails because you're either blinded or stuck in time!");
								}
								else
								{
									attacks[0].use(player, bot, log, pRef);
								}

								if (bot.hp <= 0)
								{
									gameEnd = true;
									log.push(`${player.name} wins!`);
								}
								else if (bot.blocked)
								{
									bot.blocked -= 1;
									log.push("The bot tried to attack, but it's unable to!");
								}
								else
								{
									//AI just picks a random thing to use
									botPhoto = botMove(player, bot, log, attacks[0]);

									if (player.hp <= 0)
									{
										gameEnd = true;
										log.push(`${bot.name} wins!`);
									}
								}

								//Show the finishing move
								var boolDet;
								if (bot.hp == 0)
								{
									boolDet = false;
								}
								else if (player.hp == 0)
								{
									boolDet = true;
								}
								else
								{
									boolDet = Math.floor(Math.random() * 3) == 1 || player.blocked;
								}
								var displayImg = boolDet ? botPhoto : Helpy.randomResp(attacks[0].images);

								msgObj.edit(combatEmbed(gameTrack, log.join("\n➡  "), displayImg, isLight));

								if (gameEnd)
								{
									currentChannel.deleteMoves(message.author.id);
								}
							}
							else
							{
								msgObj.edit(combatEmbed(gameTrack, "smh that move doesn't exist", Helpy.randomResp(emotePhotos), isLight));
							}

							message.delete();
						}

						currentChannel.addMoves(message.author.id, playMove);
					});
			break;

			case "end":
				//This will end up deleting any valid games that are running, and this is intentional.
				//There's a 102% chance I will forget which game I have running currently so this is a workaround lol
				if (currentChannel.hasValidMoves(message.author.id))
				{
					currentChannel.deleteMoves(message.author.id);
					message.channel.send("done!");
				}
				else
				{
					message.channel.send("buddy you don't have a running game going on.");
				}
			break;

			case "help":
				var x = gameHelp();
				message.channel.send(x);
			break;

			default:
				message.channel.send("smh do you want to start or end combat?");
			break;
		}
	}
}

//isLightadjusts the move name based on light mode or dark mode ;)
const combatEmbed = (gameTrack, gameLog, img, isLight) => {
	let moveList;

	//If not light, it's dark
	if (isLight)
	{
		moveList = "1. Attack - Deal some damage. \n" +
				"2. Defend - Level up some defense stats by 2. \n" +
				"3. Lightsaber - Whip out that beam of light and just go full Star Wars on Dark Mode!\n" +
				"4. Flashbang - Always play CSGO with Justin, he has infinite flashbangs \n" +
				"5. Divine Bolt - Pray to the gods and send a divine bolt of light down on Dark Mode!\n" +
				"6. Perfect Armor - Equip a brand new set of the armor that grants you the most defense in all of Hypixel Skyblock!\n" +
				"7. Ground Zero - If you can't beat 'em, nuke 'em.\n" +
				"8. Holy Water - Splash yerself before you elf yourself.\n" +
				"9. Seal Team 6 - Take your emergency dial and tell Justin to do something";
	}
	else
	{
		moveList = "1. Attack - Deal some damage. \n" + 
		"2. Defend - Level up some defense stats by 2.\n" +
		"3. The Force - Use the power of the dark side to launch a gravitational attack!\n" +
		"4. Peruvian Instant Darkness Powder - Toss some dust, and try to give someone blindness!\n" + 
		"5. Sword of Concealing Light - Equip a power sword! Mitigate the effects of the sword of revealing light and get +1 true offense\n" +
		"6. To Arms! - Harnessing the power of Darth Vader and Sir Plagus the Wise, level up all stats and true defense by 1!\n " +
		"7. ??? - Commander Cody, the time has come."
	}

	let embed = new Discord.MessageEmbed();
	embed.setColor("GOLD");
	embed.setTitle("Light Mode vs Dark Mode Combat");
	embed.setDescription("Help light mode defeat dark mode! Type the move name to attack!\nIf you're unfamiliar with the rules, use `srs combat end` and then `srs combat rules`");
	embed.addFields(
		{
			name: "Light Mode HP",
			value: gameTrack[0].hp + "",
			inline: true
		},
		{
			name: "Light Mode Defense",
			value: gameTrack[0].defense + "",
			inline: true
		},
		{
			name: "Light Mode Attack",
			value: gameTrack[0].attack + "",
			inline: true
		},
		{ name: '\u200B', value: '\u200B' },
		{
			name: "Dark Mode HP",
			value: gameTrack[1].hp + "",
			inline: true
		},
		{
			name: "Dark Mode Defense",
			value: gameTrack[1].defense + "",
			inline: true
		},
		{
			name: "Dark Mode Attack",
			value: gameTrack[1].attack + "",
			inline: true
		},
		{
			name: "Log",
			value: gameLog
		},
		{
			name: "Moves:",
			value: moveList
		}
	);

	embed.setImage(img);
	return embed;
}

const gameHelp = () => {
	let embed = new Discord.MessageEmbed();
	embed.setTitle("Light Mode Combat Help");
	embed.setDescription("If dark mode wins, you're doing something wrong.");

	embed.addFields(
		{
			name: "Introduction",
			value: "Light Mode Combat is essentially a game where you play as the lord and savior light mode in order to defeat dark mode.\n" + 
				"To do this, you have various ~~rigged~~ tools at your disposal.\n" +
				"This totally isn't a ripoff of the Level 3 Project I did a year ago"
		},
		{
			name: "Stats",
			value: "Your HP represents your health bar. If it gets to 0, you lose.\n" +
				"Your defense stops you from taking damage. You lose 1 defense when you get attacked. The damage reduction is 10% per defense level.\n" +
				"Your attack allows you to deal massive damage. See more in combat. Whenever you attack, there is a 33% chance this stat goes up 1 level."
		},
		{
			name: "Combat",
			value: "The combat phase is where you get to ~~use your rigged tools~~ attack Dark Mode.\n" +
				"You can decide to attack, defend, or use a special move.\n" + 
				"If you attack, your damage is your attack stat * 5. Well... if they don't have defense. \n" + 
				"There's also a 20% chance you'll crit. If that happens, your attack damage gets multiplied by 3.\n" + 
				"Technically speaking, the only way to survive a crit is to rack up defense.\n" + 
				"Btw did you know? Overflow defense will allow you to heal HP?" 
		}
	);

	return embed;
}

function lightModeAI(playerObj, botObj, log)
{
	//The pretense is that we're guessing these moves exist, which they do
	var atk;

	if (Math.floor(Math.random() * 3) == 0)
	{
		atk = "Star Platinum";
	}
	else if (botObj.hp < 45 || Math.floor(Math.random() * 6) == 0)
	{
		//Use seal team 6 to clutch win if needed
		atk = "Seal Team 6";
	}
	else if (playerObj.defense > 4 || (Math.floor(Math.random() * 3) == 0 && playerObj.hp > 50))
	{
		if (playerObj.defense > playerObj.offense && playerObj.hp < 50)
		{
			atk = "Flashbang";
		}
		else
		{
			atk = "Ground Zero";
		}
	}
	else if (botObj.hp < 85 && botObj.hp > 65)
	{
		atk = "Holy Water";
	}
	else if (botObj.defense < 6 && Math.floor(Math.random() * 2) == 0)
	{
		atk = "Perfect Armor";
	}
	else
	{
		//Add some secret rigged moves ;)
		var possible = [
			"Divine Bolt",
			"Attack",
			"Sword of Revealing Light",
			"Sun",
			"Ripoff Pokemon"
		];

		atk = Helpy.randomResp(possible);
	}

	var move = moves.filter(x => x.name.toUpperCase() == atk.toUpperCase() && (x.faction == "Neutral" || botObj.name.includes(x.faction)));

	//Here, we trust that the AI picks a move that exists which does happen
	move[0].use(botObj, playerObj, log, true);

	return Helpy.randomResp(move[0].images);
}

//Nerf dark mode must be nerfed so they lose >:)
function darkModeAI(playerObj, botObj, log)
{
	var atk = Math.floor(Math.random() * 2) == 0 ? "Attack" : "Defend";
	var move = moves.filter(x => x.name.toUpperCase() == atk.toUpperCase() && (x.faction == "Neutral" || botObj.name.includes(x.faction)));

	//Here, we trust that the AI picks a move that exists which does happen
	move[0].use(botObj, playerObj, log, false);

	return Helpy.randomResp(move[0].images);
}