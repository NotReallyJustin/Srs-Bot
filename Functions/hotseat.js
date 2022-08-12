const ClientConfig = require("../clientConfig.js");

ClientConfig.bot.on('messageCreate', async message => {

	if (message.author.bot || message.guild) return;

    var collection = ClientConfig.mangoDatabase.collection("Hot Seat");
    var regHotSeat = await collection.countDocuments({"id": message.author.id});

    //If the person is registered for hot seat, send the hot seat
    if (!!regHotSeat)
    {
        let hotseatUser = await collection.findOne({"id": message.author.id});
        ClientConfig.bot.channels.fetch(hotseatUser.channel)
            .then(channel => {
                let output = Helpy.messageCompile("Hot Seat Message: \n" + message.content + "\n", message.attachments);
                channel.send(output);
            });

        message.react("🧀");
    }
});