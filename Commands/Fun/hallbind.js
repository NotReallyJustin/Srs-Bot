//Hallbind command! Also see /Functins/hallbind.js

const Discord = require("discord.js");
const ClientConfig = require("../../clientConfig.js");
const Helpy = require("../Helpy.js");
const MIN_EMOTE = 5;

//Credits to: https://stackoverflow.com/questions/18862256/how-to-detect-emoji-using-javascript
//const UNICODE_REGEX = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/gmiu;
const UNICODE_REGEX = /[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]/u;
const COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

module.exports = {
	name : "hallbind",
	description : "Wrapper for hallbind",
	options: [
		{
			name: "set",
            type: Discord.ApplicationCommandOptionType.Subcommand,
			description: "Justin supported light mode? Cliff posted a Tech Moment? Hallbind them onto a showcase channel!",
            options: [
                {
                    name: "hall",
                    type: Discord.ApplicationCommandOptionType.Channel,
                    description: "The hall you're yeeting them into",
                    required: true
                },
                {
                    name: "emote_id",
                    type: Discord.ApplicationCommandOptionType.String,
                    description: "The emote you're hallbinding",
                    required: true
                },
                {
                    name: "qty",
                    type: Discord.ApplicationCommandOptionType.Integer,
                    description: "How many emotes until we toss them into the showcase halls? Must be >= 5",
                    required: true
                },
                {
                    name: "color",
                    type: Discord.ApplicationCommandOptionType.String,
                    description: "Hex Color for the hall posts! This defaults to COLOR.GOLD. Make sure to add the #",
                    required: false
                }
            ]
		},
        {
            name: "check",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            description: "Check stats on a hallbind",
            options: [
                {
                    name: "hall",
                    type: Discord.ApplicationCommandOptionType.Channel,
                    description: "The hallbind hall you're checking",
                    required: true
                },
                {
                    name: "emote_id",
                    type: Discord.ApplicationCommandOptionType.String,
                    description: "The emote you're checking",
                    required: true
                }
            ]
        },
        {
			name: "remove",
            type: Discord.ApplicationCommandOptionType.Subcommand,
			description: "Removes a hallbind",
            options: [
                {
                    name: "hall",
                    type: Discord.ApplicationCommandOptionType.Channel,
                    description: "The hall you're targeting with hallbind removal",
                    required: true
                },
                {
                    name: "emote_id",
                    type: Discord.ApplicationCommandOptionType.String,
                    description: "The emote you're removing. Or if you're a linux person, use the wildcard.",
                    required: true
                }
            ]
		},
        {
			name: "qtyswap",
            type: Discord.ApplicationCommandOptionType.Subcommand,
			description: "People spamming the 🤮 emote? ⭐ getting abused again? Run qtyswap to change the requirements!",
            options: [
                {
                    name: "hall",
                    type: Discord.ApplicationCommandOptionType.Channel,
                    description: "The hall you're targeting with a hallbind qty swap",
                    required: true
                },
                {
                    name: "emote_id",
                    type: Discord.ApplicationCommandOptionType.String,
                    description: "The emote you're hallbinding",
                    required: true
                },
                {
                    name: "qty",
                    type: Discord.ApplicationCommandOptionType.Integer,
                    description: "How many emotes until we toss them into the showcase halls? Must be >= 5",
                    required: true
                },
                {
                    name: "target",
                    type: Discord.ApplicationCommandOptionType.Channel,
                    description: "Have the hallbind qty update only target ONE channel - *coughs in #bths-announcements*",
                    required: false
                }
            ]
		},
        {
            name: "exclude",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            description: "Creates a hallbind exclusion zone. Will not hallbind any channels it doesn't have view perms to btw",
            options: [
                {
                    name: "hall",
                    type: Discord.ApplicationCommandOptionType.Channel,
                    description: "The showcase hall",
                    required: true
                },
                {
                    name: "emote_id",
                    type: Discord.ApplicationCommandOptionType.String,
                    description: "The emote to exclude from target channel. Use * to exclude target channel from all emote and halls.",
                    required: true
                },
                {
                    name: "target",
                    type: Discord.ApplicationCommandOptionType.Channel,
                    description: "The channel you're establishing a hallbind exclusion zone in",
                    required: true
                }
            ]
        }
	],
	execute: async (interaction) => {
        const hallsCollection = ClientConfig.mangoDatabase.collection("Halls");
        const subName = interaction.options.getSubcommand(true);
        await interaction.deferReply();
		if (!subName)
		{
			interaction.editReply("smh what do you want me to do with hallbind?");
			return;
		}
		const subCmd = interaction.options.data[0];
        
        
        try
        {
            //----Verify hall and emote_id - hall is always option[0] and emote_id is always option[1]----
            if (subCmd.options[0].channel.guildId != interaction.guildId) throw "smh you can't hof to a channel that's not even in your server";
            if (!subCmd.options[0].channel.type == Discord.ChannelType.GuildText) throw "hallbind only works on text channels";
            var subVal = subCmd.options[1].value.trim();

            if (!(UNICODE_REGEX.test(subVal) && (subVal.length == 1 || subVal.length == 2))) 
            {
                if (subVal != "*")
                {
                    try
                    {
                        var emote = await interaction.guild.emojis.fetch(subVal);
                        if (emote == undefined) throw "smh this emote doesn't exist in the current server";
                    }
                    catch(err)
                    {
                        console.log(err)
                        throw "smh this emote doesn't exist in the current server or I have no access to the global unicode emote";
                    }
                }
                else if (!/\bexclude\b|\bremove\b/i.test(subName))
                {
                    throw "smh that is not a valid snowflake";
                }
            }
            
            //Verify staff perms
            if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages)) throw "smh you need staff perms";
        }
        catch(err)
        {
            if (typeof err == 'string')
			{
				interaction.editReply(err);
			}
			else
			{
				console.error(err);
				interaction.editReply("smh I don't have perms");
			}
			return;
        }

        const emoteEntry = await hallsCollection.findOne({"hallID": subCmd.options[0].channel.id, "emoteID": subCmd.options[1].value});

        //----Start parsing subcmds----
        switch (subName)
        {
            case "set":
                //Discord slash commands has it so this error will almost never occur - but hey, defensive programming
                if (subCmd.options[2].value < MIN_EMOTE)
                {
                    interaction.editReply("smh insert a qty more than 5");
                    return;
                }

                if (emoteEntry)
                {
                    interaction.editReply("smh this hallbind already exists");
                    return;
                }

                if (!interaction.guild.members.me.permissionsIn(subCmd.options[0].channel).has(Discord.PermissionsBitField.Flags.SendMessages, Discord.PermissionsBitField.Flags.ReadMessageHistory))
                {
                    interaction.editReply("smh give me write and view message history perms to that channel\nOr alternatively Gabe gimme admin perms");
                    return;
                }

                await hallsCollection.insertOne({
                    hallID: subCmd.options[0].channel.id,
                    guildID: subCmd.options[0].channel.guildId,
                    emoteID: subCmd.options[1].value,
                    qty: subCmd.options[2].value,
                    color: subCmd.options[3] && COLOR_REGEX.test(subCmd.options[3].value) ? subCmd.options[3].value : "Gold",
                    exclusion: {},
                    customQty: {} //JSON gets used like maps here to save mongodb storage space
                });

                interaction.editReply("Hallbind set successfully 😄! Remember hallbind entries get cleansed after 5 days.");
            break;

            case "remove":
                var query = {"hallID": subCmd.options[0].channel.id};
                if (subCmd.options[1].value != "*") query["emoteID"] = subCmd.options[1].value;

                if (await hallsCollection.countDocuments(query) <= 0)
                {
                    interaction.editReply("smh there is no matching hallbind");
                    return;
                }

                hallsCollection.remove(query, {justOne: false})
                    .then(res => {
                        interaction.editReply("Hallbind removed!");
                    }).catch(err => {
                        console.error(err);
                        interaction.editReply("Hallbind removal failed - ping Justin or smth");
                    });
            break;

            case "check":
                if (emoteEntry)
                {
                    interaction.editReply({embeds: [hallEmbed(emoteEntry)]});
                }
                else
                {
                    interaction.editReply("smh this hallbind doesn't exist");
                }
            break;

            case "qtyswap":
                //Check
                if (subCmd.options[2].value < MIN_EMOTE)
                {
                    interaction.editReply("smh insert a qty more than 5");
                    return;
                }

                if (subCmd.options[3] && (subCmd.options[3].channel.guildId != interaction.guildId))
                {
                    interaction.editReply("smh you can't target a hall that's not in your server");
                    return;
                }

                if (!emoteEntry)
                {
                    interaction.editReply("smh this hallbind doesn't exist to begin with");
                    return;
                }

                if (subCmd.options[3] && !subCmd.options[3].channel.type == Discord.ChannelType.GuildText)
                {
                    interaction.editReply("smh insert a text channel");
                    return;
                }

                if (subCmd.options[3] && !interaction.guild.members.me.permissionsIn(subCmd.options[3].channel).has(Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.ReadMessageHistory))
                {
                    interaction.editReply("smh for the target channel, make sure to enable view channel and read message history perms");
                    return;
                }

                if (subCmd.options[3] && subCmd.options[3].channel)
                {
                    var originalQty = emoteEntry.customQty;
                    originalQty[`${subCmd.options[3].channel.id}`] = subCmd.options[2].value;
                    await hallsCollection.updateMany(
                        {"hallID": subCmd.options[0].channel.id, "emoteID": subCmd.options[1].value}, 
                        {$set: {"customQty": originalQty}}
                    );

                    interaction.editReply("Done!! :)");
                }
                else
                {
                    await hallsCollection.updateMany(
                        {"hallID": subCmd.options[0].channel.id, "emoteID": subCmd.options[1].value}, 
                        {$set: {"qty": subCmd.options[2].value}}
                    );

                    interaction.editReply("Updated!");
                }
            break;

            case "exclude":
                if (subCmd.options[2].channel.guildId != interaction.guildId)
                {
                    interaction.editReply("smh you can't exclude a hall that's not in your server");
                }

                var query = {"guildID": subCmd.options[0].channel.guildId};
                if (subCmd.options[1].value != "*")
                {
                    query["hallID"] = subCmd.options[0].channel.id;
                    query["emoteID"] = subCmd.options[1].value;
                }

                if (await hallsCollection.countDocuments(query) <= 0)
                {
                    interaction.editReply("smh there is no matching hallbind");
                    return;
                }

                var construct = {};
                construct[`exclusion.${subCmd.options[2].channel.id}`] = true;
                await hallsCollection.updateMany(
                    query,
                    {$set: construct}
                );
                
               interaction.editReply("Update successful!");
            break;
        }
    }
}

const hallEmbed = (emoteEntry) => {
    let embed = new Discord.EmbedBuilder();
	embed.setTitle("Hallbind Status");
	embed.setColor("Gold");

    embed.addFields(
        {name: "Hall Channel ID", value: `<#${emoteEntry.hallID}>`},
        {name: "Emote ID", value: emoteEntry.emoteID},
        {name: "Hallbind QTY", value: emoteEntry.qty + ""},
        {name: "Hallbind Exclusions", value: Array.from(Object.keys(emoteEntry.exclusion)).map(x => `<#${x}>`).join("\t") || "None"},
        {name: "Custom QTY", value: Array.from(Object.keys(emoteEntry.customQty)).map(entry => `<#${entry}> - ${emoteEntry.customQty[entry]}`).join("\n") || "None"}
    );

	return embed;
}

