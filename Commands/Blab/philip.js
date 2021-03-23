const Helpy = require("../Helpy.js");

//No lmao it's not Dr. Phil
const phil = [
	"THIS IS UNFAIR!",
	"Wait, is this even Srs bot anymore?",
	"Let's just get this done, aight?",
	"LETS DO THIS",
	"That's it. We're screwed ._.",
	"Aight buddy you need to have some coffee",
	"alright buddy damn you didn't have to do go that far"
];

module.exports = {
    name: "philip",
    description: "It's an inside joke from the OG Gang days with Beesha 🥳",
    execute : (message) => {
        let x = Helpy.randomResp(phil);
        message.channel.send(x);
    }
}