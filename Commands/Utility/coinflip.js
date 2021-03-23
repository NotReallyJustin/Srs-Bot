module.exports = {
    name: "coinflip",
    description: "Does a coinflip, in case srs advice isn't giving you that definitive answer :P\nIf you use this in a debate round, always pick 2nd",
    execute : (message) => {
    	//Autoconverts to boolean
    	//ahh I love loose typing
    	//Plus < and > are a pain to work with
        if ((Math.random() *2))
        {
        	message.channel.send("Heads");
        }
        else
        {
        	message.channel.send("Tails");
        }
    }
}