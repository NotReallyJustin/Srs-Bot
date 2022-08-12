const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "ping",
    description: "pong!",
    options: [
        {
            name: "rainbow",
            description: "The Linux rainbow table you want to use to calculate the TCP network's integrand ping delay!", //Lmao gibberish
            required: false,
            type: ApplicationCommandOptionType.String
        }
    ],
    execute : (interaction) => {
    	if (interaction.options.getString("rainbow") == null)
    	{
    		interaction.reply("smh I'm not a ping pong ball");
    	}
        else if (isNaN(+interaction.options.getString("rainbow")))
        {
            interaction.reply("smh that's not a rainbow table algorithm");
        }
        else if (+interaction.options.getString("rainbow") < 100000000)
        {
            interaction.reply(`Your current ping number is ${Math.floor(Math.random() * 800)}. I hope you weren't expecting too much from AWS.`);
        }
    	else
    	{
    		interaction.reply(`<@${interaction.options.getString("rainbow")}>`);
    	}
    }
}