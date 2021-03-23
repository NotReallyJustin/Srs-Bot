const Helpy = require("../Helpy.js");

const americanAirlines = [
	"smh didn't buy your broke college student a plane ticket",
	"smh how am I going to get there",
	"I better see a shellfish tower and lobster ravioli when i get there",
	"WHAT!? Did Justin opensource my token again?",
	"hol up did Justin pull a Github.opensource.IPAddress",
	"can't make it sorry, im at a frat party"
];

module.exports = {
    name: "invite",
    description: "Generates an invite link for srs bot! Well... it tries to generate an invite link.",
    execute : (message) => {
        let x = Helpy.randomResp(americanAirlines);
        message.channel.send(x);
    }
}