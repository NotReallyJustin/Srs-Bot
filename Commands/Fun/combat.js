const Discord = require("discord.js");
const Helpy = require("../Helpy.js");

const emotePhotos = [
	'https://nitrocdn.com/wCXLSgWIQfDrGVjVNublasIQvIqjecSu/assets/static/optimized/rev-437a808/wp-content/uploads/2019/06/Super-Bright-Flashlight-1-950x500.jpg',
	'https://www.fonehouse.co.uk/blog/wp-content/uploads/2020/03/light-mode-vs-dark-mode.jpg',
	'https://techgirl.co.za/wp-content/uploads/2017/04/Image001.jpg',
	'https://physicsworld.com/wp-content/uploads/2019/06/Twisted-light.jpg',
	'https://cdn-prod.medicalnewstoday.com/content/images/articles/323/323636/blue-light-style.jpg',
	'https://st3.depositphotos.com/16131148/18376/v/600/depositphotos_183761924-stock-video-exploding-blue-light.jpg',
	'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDya-v_kUpJ0U99KFAVG1m_gI1op7YQy8bLw&usqp=CAU',
	'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_Df4g8uz5s_e5rLVJJ9n7QOgAMiHym0GdNw&usqp=CAU'
];

const moves = [
	{
		name: "Attack",
		use: (you, opponent, log, username) => {
			var dmg = Math.round((10 - opponent.defense) * .1 * you.attack * 5);
			if (Math.floor(Math.random() * 4) == 0) { dmg = dmg * 3, log.push(`${username} rolled a crit!`) };

			opponent.hp -= dmg;
			opponent.defense = Math.max(0, opponent.defense - 1);
			log.push(`${username} attacked for ${dmg} damage!`);

			if (Math.floor(Math.random() * 3) == 0)
			{
				you.attack = Math.min(10, you.attack + 1);
				log.push(`${username} gained +1 attack!`);
			}
		}
	},
	{
		name: "Defend",
		use: (you, opponent, log, username) => {
			you.defense = Math.min(10, you.defense + 2);
			log.push(`${username} defended and gained +2 defense!`);
		}
	},
	{
		name: "Holy Water",
		use: (you, opponent, log, username) => {
			you.hp += 20;
			log.push(`Holy Damn! You actually listened to Justin and went to church (or your local temple)! You splash holy water on yourself and gained 20 HP!`);
		}
	},
	{
		name: "Seal Team 6",
		use: (you, opponent, log, username) => {
			opponent.hp = 0;
			log.push(`Dark mode is getting out of hand, so you decide to call Seal to help. However, your phone call accidentally redirects to the US Special Forces, and they have sent the Navy Seals.\n` +
				"Dark Mode's is flashbanged and gunned down to 0 HP with AK47s and Stun Batons!");
		}
	},
	{
		name: "Flashbang",
		use: (you, opponent, log, username) => {
			opponent.defense = 0;
			log.push(`You took a screenshot. Dark Mode has been flashbanged and they can't defend anymore! Dark Mode defense drops to 0!`);
		}
	},
	{
		name: "Perfect Armor",
		use: (you, opponent, log, username) => {
			you.defense = 10;
			log.push(`You reached into your ender chest and grabbed a set of Tier 12 Perfect Armor. You now have 100% damage reduction. It's too dangerous to get out there alone.`);
		}
	},
	{
		name: "Divine Bolt",
		use: (you, opponent, log, username) => {
			opponent.hp -= Math.floor(Math.random() * 10) + 40;
			log.push(`Justin has run out of ideas, so you summon Adora from BTD6 and have her use a divine bolt on Dark Mode.\nYou deal massive amounts of damage!`);
		}				
	},
	{
		name: "Ground Zero",
		use: (you, opponent, log, username) => {
			opponent.hp = Math.round(opponent.hp / 2);
			opponent.attack = Math.ceil(opponent.attack / 2);
			opponent.defense = Math.floor(opponent.defense / 2);
			log.push(`Rules of modern warfare: if you can't beat 'em, nuke 'em.\nAll of Dark Mode's stats have been halved!`);
		}
	},
	{
		name: "Lightsaber",
		use: (you, opponent, log, username) => {
			var dmg = you.attack * 5;
			if (Math.floor(Math.random() * 4) == 0) { dmg = dmg * 3 };

			opponent.hp -= dmg;
			log.push(`You literally just sliced Dark Mode with a laser sword. Dark Mode takes ${dmg} damage!`);
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
				let hasOtherGame = currentChannel.hasValidMoves(message.author.id);
				let gameTrack = [{hp: 100, defense: 0, attack: 1}, {hp: 100, defense: 0, attack: 1}];
				let img = Helpy.randomResp(emotePhotos);

				if (hasOtherGame)
				{
					message.channel.send("You have other games going on. You can't start this new game.");
					return;
				}

				message.channel.send(combatEmbed(gameTrack, "N/A", img))
					.then(msgObj => {
						//Do your magic!
						function playMove(messageContent, message)
						{
							var gameEnd = false;
							var attacks = moves.filter(x => x.name.toUpperCase() == messageContent.toUpperCase());
							if (attacks.length)
							{
								var log = [""];
								attacks[0].use(gameTrack[0], gameTrack[1], log, "Light Mode");

								if (gameTrack[1].hp <= 0)
								{
									gameEnd = true;
									log.push("Light mode wins!");
								}
								else
								{
									//AI just picks a random thing to use
									var aiMove = Math.floor(Math.random() * 2) == 0 ? "Attack" : "Defend";
									moves.filter(x => x.name == aiMove)[0].use(gameTrack[1], gameTrack[0], log, "Dark Mode");

									if (gameTrack[0].hp <= 0)
									{
										gameEnd = true;
										log.push("Dark mode wins!");
									}
								}

								msgObj.edit(combatEmbed(gameTrack, log.join("\n➡ "), img));

								if (gameEnd)
								{
									currentChannel.deleteMoves(message.author.id);
								}
							}
							else
							{
								msgObj.edit(combatEmbed(gameTrack, "smh that move doesn't exist", img));
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

const combatEmbed = (gameTrack, gameLog, img) => {
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
			value: `1. Attack - Deal some damage. \n` +
				"2. Defend - Level up some defense stats by 2. \n" +
				"3. Lightsaber - Whip out that beam of light and just go full Star Wars on Dark Mode!\n" +
				"4. Flashbang - Always play CSGO with Justin, he has infinite flashbangs \n" +
				"5. Divine Bolt - Pray to the gods and send a divine bolt of light down on Dark Mode!\n" +
				"6. Perfect Armor - Equip a brand new set of the armor that grants you the most defense in all of Hypixel Skyblock!\n" +
				"7. Ground Zero - If you can't beat 'em, nuke 'em.\n" +
				"8. Holy Water - Splash yerself before you elf yourself.\n" +
				"9. Seal Team 6 - Take your emergency dial and tell Justin to do something"
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