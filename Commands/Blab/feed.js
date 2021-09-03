module.exports = {
    name: "feed",
    description: "smh couldn't you have invited me to boba or smth",
    options: [
        {
            name: "food",
            description: "what are you feeding srs bot",
            required: false,
            type: "STRING"
        }
    ],
    execute : (interaction) => {
        if (interaction.options.getString("food") == null)
        {
            interaction.reply("smh there's no food"); 
        }
    	else
    	{
    	   interaction.reply("smh I'm not eating on my keeb");
    	}
    }
}