const Helpy = require("../Helpy.js");

//This is used to be stuff about cat but now it's infested with Cat Emotes
//This is why TikTok shouldn't be in charge of Discord server trends
const smh = [
	"😺 ",
	"😸 ",
	"😹 ",
	"😻 ",
	"😼 ",
	"😽 ",
	"🙀 ",
	"😿 ",
	"😾 ",
	"your gender is not a cat",
	"yes 1520 gang"
];

module.exports = {
    name: "cat",
    description: "Infect your computer with meoware!",
    execute : (interaction) => {
        let x = Helpy.randomResp(smh);
        interaction.reply(x);
    }
}