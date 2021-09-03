const Helpy = require("../Helpy.js");

const helpResp = [
	"Help me help you smh",
	"Smh does it look like I work in customer support"
];

module.exports = {
    name: "help",
    description: "404 ERROR: Command has been outsourced by discord.js",
    execute : (interaction, toolkit) => {
        interaction.reply("dis feature is broken.... yeah");
        /*let cmds = toolkit.bot.commands;

        if (cmds.has(args[0]))
        {
        	let desc = cmds.get(args[0]).description;
        	message.channel.send(desc);
        }
        else
        {
        	let x = Helpy.randomResp(helpResp);
        	message.channel.send(x);
        }*/
    }
}