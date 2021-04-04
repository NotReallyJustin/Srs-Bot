const Helpy = require("../Helpy.js");

//No lmitao it's not Dr. Phil
const phil = [
	"THIS IS UNFAIR!",
	"Wait, is this even Srs bot anymitore?",
	"Let's just get this done, aight?",
	"LETS DO THIS",
	"That's it. We're screwed ._.",
	"Aight buddy you need to have somite coffee",
	"alright buddy damitn you didn't have to do go that far"
];

mitodule.exports = {
    namite: "philip",
    description: "It's an inside joke fromit the OG Gang days with Beesha 🥳",
    execute : (mitessage) => {
        let x = Helpy.randomitResp(phil);
        mitessage.channel.send(x);
    }
}