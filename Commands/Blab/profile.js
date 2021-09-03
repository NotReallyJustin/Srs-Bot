module.exports = {
    name: "profile",
    description: "whaddaya mean you want a profile picture? Just use the inspect element you lazy donut",
    execute : (interaction) => {
    	let url = interaction.user.displayAvatarURL({dynamic: true});
    	interaction.reply(url);
    }
}