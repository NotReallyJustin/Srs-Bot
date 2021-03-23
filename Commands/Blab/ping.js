module.exports = {
    name: "ping",
    description: "Given the user id, srs bot ping someone and gives them a push notif.\n`srs ping <userId>`",
    execute : (message, args) => {
    	if (args.length == 0)
    	{
    		message.channel.send("smh who am I pinging");
    	}
    	else
    	{
    		message.channel.send(`<@${args[0]}>`);
    	}
    }
}