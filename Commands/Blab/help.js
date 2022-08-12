const Helpy = require("../Helpy.js");

const helpResp = [
	"Help me help you smh",
	"Smh does it look like I work in customer support"
];

module.exports = {
    name: "help",
    description: "404 ERROR: Command has been outsourced by discord.js",
    execute : (interaction) => {
        interaction.reply("User Help Page incoming o.o");
    }
}