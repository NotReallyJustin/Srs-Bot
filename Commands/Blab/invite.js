const Helpy = require("../Helpy.js");

const americanAirlines = [
	"smh didn't buy your broke college student a plane ticket",
	"smh how am I going to get there",
	"I better see a shellfish tower and lobster ravioli when i get there",
	"WHAT!? Did Justin opensource my token again?",
	"can't make it sorry, im at a frat party",
	"LEAKING IP ADDRESSES FROM THE SGO: 127.0.0.1:8081. SOURCES SAY YOU COULD STEAL ADDRESSES AND CREDIT CARD NUMBERS WITH THIS IP!!!",
	"You are coordinally invited to the NSHSS! This is totally not another spam email!"
];

module.exports = {
    name: "invite",
    description: "Generates an invite link for srs bot! Oh and you invite Srs on vacation",
    execute : (interaction) => {
        let x = Helpy.randomResp(americanAirlines);
        interaction.reply(x);
    }
}