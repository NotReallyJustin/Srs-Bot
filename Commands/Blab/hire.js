const Helpy = require("../Helpy.js");

const americanAirlines = [
	"sorry I walk dogs for 20 hours a week",
	"smh how am I going to get there",
	"WHAT!? Did Justin opensource my token again?",
	"can't make it sorry, im at a frat party",
	"LEAKING IP ADDRESSES FROM THE SGO: 127.0.0.1:8081. SOURCES SAY YOU COULD STEAL ADDRESSES AND CREDIT CARD NUMBERS WITH THIS IP!!!",
	"no YOU (haha get it cause no u) are coordinally invited to the NSHSS! This is totally not another spam email!"
];

module.exports = {
    name: "hire",
    description: "IDK labor shortage or smth, but give Srs a job",
    execute : (interaction) => {
        let x = Helpy.randomResp(americanAirlines);
        interaction.reply(x);
    }
}