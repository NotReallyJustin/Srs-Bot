const Helpy = require("../Helpy.js");

const helpResp = [
	"Help me help you smh",
	"Smh does it look like I work in customer support"
];

module.exports = {
    name: "help",
    description: "Get some help with command tinkering!\n`srs help <insert command name>`",
    execute : (message, args, toolkit) => {
        let cmds = toolkit.bot.commands;

        if (cmds.has(args[0]))
        {
        	let desc = cmds.get(args[0]).description;
        	message.channel.send(desc);
        }
        else
        {
        	let x = Helpy.randomResp(helpResp);
        	message.channel.send(x);
        }
    }
}