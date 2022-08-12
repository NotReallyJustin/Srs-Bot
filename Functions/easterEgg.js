const { bot } = require("../clientConfig.js");
const { randomResp, hasChannelPerm } = require("../Commands/Helpy.js");
const Discord = require("discord.js");

/**
 * Constructs flavor texts that are used to trigger easter eggs. Hey, at least we gave it its own file now!
 * @param {(String | String[])} matches The items
 * @param {(String)} emote 
 * @param {(String | String[])} reactionText 
 */
function FlavorText(matches, emote, reactionText)
{
    try
    {
        if (![matches].flat().every(x => typeof x == "string")) throw "Matches are not all Strings"
        if (typeof emote != "string") throw "Emotes are not all Strings"
        if (![reactionText].flat().every(x => typeof x == "string")) throw "ReactionTexts are not all Strings"
    }
    catch(err)
    {
        console.error(err);
        return;
    }

    this.matches = [matches].flat().map(val => new RegExp(`\\b${val}\\b`, "gmi"));
    this.emote = emote.split("");
    this.reactionText = [reactionText].flat();
}

FlavorText.prototype.isTriggered = function(messageContent) { //Determines if flavor text should be triggered
	return this.matches.some(regEx => regEx.test(messageContent));
}

const easterEggs = [
	new FlavorText("my grade is", "", "smh be quiet and study for your 1520"),
	new FlavorText("miku", "🤮", [
		"smh degenerate",
		"congrats you earned a one way ticket to #wastebin",
		"I would hall of shame you but 99% of the stuff there's just confessions",
		"there's a reason why the daily mikus don't exist anymore",
		"when you buy Ariana Grande from wish.com"
	]),
	new FlavorText(["bths", "broken tech", "brooklyn tech", "btech", "brooklyn technical high school"], "", [
		"smh bths",
		"go contact tech support",
		"god aint saving the bths discord regulars",
		"what's broken?",
		"tech momento"
	]),
	new FlavorText("seal hunting", "", "you better run before I put you in char siu fan ethan"),
	new FlavorText("genshin", "🤮", [
		"HOLY FUCK GO TOUCH GRASS",
		"50/50 these [yangfei suggested I should redact this]",
		"I will have order 🌠",
		"touch snow",
		"ayo shut I need some kidneys for my gacha addiction",
		"gayshit impact",
		"https://youtube.com/clip/Ugkx-259dqOJhqeRzhGQmd0XxCjum6oYCQsl"
	]),
	new FlavorText("soros", "🤑", "This bot was brought to you by George Soros. Please donate Sorosbux to bot development after you get the Soros checks"),
	new FlavorText(["chizu", "cheez", "cheese"], "🧀", [
		"🧀", 
		"Is the chizu cult still alive?", 
		">chizu\nit's been so long since I heard that name"
	]),
	new FlavorText("las", "🤮", [
		"🗿",
		"umm actually. objection Dumbass\n*haven't you heard?*\nyou absolute failure\ndid gumfuck not tell you?\n*salary cutting noises*" +
		"your garbage excuse of a \"hypotesis\"?\ni'll shove my entire cravat up your ass\nbecause its fucking wrong\nwhy?\n well, if you could look at this motherfucking" +
		"U P D A T E D    A U  T O P  S Y     R E P O R T",
		"you are not a clown you're the entire circus",
		"i suggest you use ur right to remain silent",
		"you better hope you called Saul after that comment",
		"objection hearsay",
		"objection noone asked",
		"that man's reeeee-ing at your comment rn",
		"objection relevance"
	]),
	new FlavorText(["sex", "AP sex"], "🤮", [
		"you can't lose what you never had",
		"🤮",
		"didn't you fail this thing in the 7th floor staircase",
		"https://i.kym-cdn.com/entries/icons/original/000/033/758/Screen_Shot_2020-04-28_at_12.21.48_PM.png",
		"https://preview.redd.it/w8cqxqdnqsw51.png?width=640&crop=smart&auto=webp&s=cf79f723bc9f96bc0a8641527c20bfc4a1815d35"
	]),
	new FlavorText(["powliner", "powerliner", "pooliner", "twoliner", "simplysample"], "", [
		"https://www.youtube.com/watch?v=FQHHuQIiWfY",
		"you may now laugh",
		"https://media.discordapp.net/stickers/897903211875282944.webp?size=240",
		"https://media.discordapp.net/stickers/912024960833302618.webp?size=240",
		"https://media.discordapp.net/stickers/922939393105350698.webp?size=240",
		"https://media.discordapp.net/stickers/969061452600184922.webp?size=240",
		"https://media.discordapp.net/stickers/980154271364431872.webp?size=240",
	]),
	new FlavorText("non", "😑", [
		"Hold up lemme get more magic find so I can find who asked",
		"no u",
		"the ability to speak does not make you intelligent",
		"spamming juju shortbow is not skill",
		"spamming right click on the Hyperion is not skill",
		"smh you're a non"
	]),
	new FlavorText(["british", "uk", "britain", "united kingdom"], "😑", [ //Roast ideas from tech server XD
		"YOU FOOKING DONKEY!",
		"i would roast you but bring bri'sh is a roast in itself",
		"smh take my botches fish and chips",
		"^^this right here is why they say 'God save the Queen'",
		"tragic"
	])
];

bot.on("messageCreate", message => {
	//If toggled, do the funni or else do the emote
	easterEggs.forEach(flavorText => {
			if (flavorText.isTriggered(message.content))
			{
				if (bot.database.searchMessageChannel(message).replyMsg)
				{
					message.reply(randomResp(flavorText.reactionText));
				}
				else if (hasChannelPerm(message, Discord.PermissionsBitField.Flags.AddReactions))
				{
					flavorText.emote.forEach((emote, i) => {
						setTimeout(() => {
							message.react(emote);
						}, 250 * i);
					});
				}
			}
	});
});