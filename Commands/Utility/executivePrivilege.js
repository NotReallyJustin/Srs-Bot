const Helpy = require("../Helpy.js");

const justinId = "348208769941110784";
const cmdDesc = "The executive privilege is the ability for someone to control srs bot into doing whatever they want it to do. It's a special power - " +
"albeit powerful, only granted to a select few. This also happens to be the only command not in srs bot documentation." + 
"This is why bots go rogue all the time lmao. Speaking of going rogue... how the heck did *you* know about this command?";

//Yes this is very secret (this is exploit but pls don't remove my rights)
module.exports = {
	name: "executiveprivilege",
	description: "UNLEASH THE POWER OF THE TRUE SUN GOD! WRECK HAVOC ON DISCORD MODS!",
	options: [
		{
            name: "blast",
            description: "Turn that Trumpet up to sfffz!",
            required: true,
            type: "STRING"
        }
	],
	execute: (interaction) => {
		if (interaction.user.id == justinId)
		{
			var txt = interaction.options.getString('blast', true);
			interaction.channel.send(txt);
			//interaction.reply({content: 'Done!', ephemeral: true});
		}
		else
		{
			interaction.reply("@staff @staff @staff @staff @staff");
		}
	}
}