module.exports = {
    name: "coinflip",
    description: "Did you know that the coinflip is not a 50-50% chance because of the weight of the coin?",
    execute : (interaction) => {
    	//Autoconverts to boolean
    	//ahh I love loose typing
    	//Plus < and > are a pain to work with
        if (Math.floor(Math.random() * 2))
        {
        	interaction.reply("Heads");
        }
        else
        {
        	interaction.reply("Tails");
        }
    }
}