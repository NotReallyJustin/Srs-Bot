module.exports = {
    name: "feed",
    description: "Feed the college student!",
    execute : (message, args) => {
    	if (args.length == 0)
    	{
    		message.channel.send("smh there's no food");
    	}
    	else
    	{
    		message.channel.send("smh I'm not eating on my keeb");
    	}
    }
}