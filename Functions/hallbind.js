const Discord = require("discord.js");
const Helpy = require("../Commands/Helpy.js");
const ClientConfig = require('../clientConfig.js');

//meta should come from the hallItems collection's meta subfield
const hallMessageSend = (meta) => {
    let embed = new Discord.EmbedBuilder();
    embed.setAuthor({
        name: meta.messageAuthor,
        iconURL: meta.messageAvatarURL
    })
    embed.setColor(meta.color || "GOLD");
    embed.setDescription(meta.messageContent);
    meta.imageURL && embed.setImage(meta.imageURL);
    embed.setFooter({text: `Message ID: ${meta.messageID}`});

    embed.addFields(
        {
            name: "Link to Message",
            value: `[Jump!](${meta.messageURL})`
        }
    )
    return {
        content: `**${meta.numReact}** ${ClientConfig.bot.emojis.resolve(meta.emoteID) || meta.emoteID} in <#${meta.hallID}>`,
        embeds: [embed]
    };
}

//IF YOU'RE NOT JUSTIN DOING SOME DEV DEBUGGING STUFF BEHIND THE SCENES, DON'T TOUCH THESE OR SOMETHING WILL EXPLODE
const deleteTimeSeries = (messageID, emoteID) => ClientConfig.mangoDatabase.collection("HallItems").deleteMany({
    "meta.messageID": messageID,
    "meta.emoteID": emoteID
});
const clearHall = () => ClientConfig.mangoDatabase.collection("HallItems").remove();

ClientConfig.bot.on("messageReactionAdd", async react => {
	//If older than 3 days, do nothing
    if (Helpy.dateDistance(new Date(react.message.createdTimestamp), new Date()) >= 3)
    {
        return;
    }

    await react.fetch();

    const hallsCollection = ClientConfig.mangoDatabase.collection("Halls");
    const hallsRef = await hallsCollection.find({"emoteID" : (react.emoji.id || react.emoji.name)});
    if (await hallsRef.count() == 0) return; //Just end it right there if no halls

    //To save time later, link all hall IDs and their messages in a JSON
    const hallItems = ClientConfig.mangoDatabase.collection("HallItems");
    let usedHalls = {};

    await hallItems.find({
        "meta.messageID": react.message.id,
        "meta.emoteID": (react.emoji.id || react.emoji.name)
    }).forEach(hallboundItem => {
        usedHalls[hallboundItem.meta.hallID] = hallboundItem.meta;
    });

    hallsRef.forEach(async (hallbind) => {
        //If hallbind message already exists, update it. Addition can't drop below hallQty
        if (usedHalls[hallbind.hallID]) 
        {
            let hallboundMeta = usedHalls[hallbind.hallID];
            hallboundMeta.numReact = react.count;

            await hallItems.updateMany(
                {
                    "meta.messageID": react.message.id,
                    "meta.emoteID": (react.emoji.id || react.emoji.name)
                },
                {
                    $set: {
                        "meta.numReact": react.count
                    }
                }
            );

            try
            {
                let hallMessage = await (await ClientConfig.bot.channels.fetch(hallboundMeta.hallID)).messages.fetch(hallboundMeta.hallMessageID);
                await hallMessage.edit(hallMessageSend(hallboundMeta, ClientConfig.bot));
            }
            catch(err)
            {
                console.error(err);
            }
        }
        else //Else if it doesn't have corresponding hallbind message that already exists, see if we can add it
        {
            let hallQty = hallbind.customQty[react.message.channelId] || hallbind.qty;
            if (react.count == hallQty && !hallbind.exclusion[react.message.channelId])
            {
                //We could use messageID to derive alot of the URLs and stuff here, but storing all of those extra info makes exec. time faster do we doing it like this
                let upload = { 
                    timestamp: new Date(),
                    meta: {
                        messageID: react.message.id,
                        messageAuthor: react.message.author.tag,
                        messageAvatarURL: react.message.author.displayAvatarURL({dynamic: true}),
                        messageURL: react.message.url,
                        emoteID: react.emoji.id || react.emoji.name,
                        messageContent: react.message.content,
                        numReact: react.count,
                        color: hallbind.color,
                        hallID: hallbind.hallID,
                        hallQty: hallQty
                    }
                };

                if (react.message.attachments.length > 0)
                {
                    upload.meta.imageURL = react.message.attachments.first().url;
                }

                var hallMessage = await (await ClientConfig.bot.channels.fetch(hallbind.hallID)).send(hallMessageSend(upload.meta, ClientConfig.bot));
                upload.meta.hallMessageID = hallMessage.id;
                await hallItems.insertOne(upload);
            }
        }
    });
});

ClientConfig.bot.on("messageReactionRemove", async react => {
	//If older than 3 days, do nothing
    if (Helpy.dateDistance(new Date(react.message.createdTimestamp), new Date()) >= 3)
    {
        return;
    }

    await react.fetch();

    const hallItems = ClientConfig.mangoDatabase.collection("HallItems");
    const bop = await hallItems.find({
        "meta.messageID": react.message.id,
        "meta.emoteID": (react.emoji.id || react.emoji.name)
    });

    /*
    Take the hallbind
    Match hallQty
    If exceed, take it down
     */
    bop.forEach(async (hallboundItem) => {
        if (+react.count < +hallboundItem.meta.hallQty)
        {
            ClientConfig.bot.channels.fetch(hallboundItem.meta.hallID)
                .then(hall => {
                    //console.log(bop.meta.hallMessageID)
                    hall.messages.fetch(hallboundItem.meta.hallMessageID)
                        .then(message => {
                            //console.log(message)
                            message.delete();
                            deleteTimeSeries(hallboundItem.meta.messageID, hallboundItem.meta.emoteID);
                        }).catch(err => {
                            console.log("Did not fetch message");
                            console.error(err);
                        })
                });    
        }
        else
        {
            hallboundItem.meta.numReact = react.count;
            //Update the QTY - addition can't drop below
            await hallItems.updateMany(
                {
                    "meta.messageID": react.message.id,
                    "meta.emoteID": (react.emoji.id || react.emoji.name)
                },
                {
                    $set: {
                        "meta.numReact": react.count
                    }
                }
            );

            try
            {
                let hallMessage = await (await ClientConfig.bot.channels.fetch(hallboundItem.meta.hallID)).messages.fetch(hallboundItem.meta.hallMessageID);
                await hallMessage.edit(hallMessageSend(hallboundItem.meta));
            }
            catch(err)
            {
                console.error(err);
            }
        }
    });
});