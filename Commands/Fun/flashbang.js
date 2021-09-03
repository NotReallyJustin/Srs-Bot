const Helpy = require("../Helpy.js");
const images = [
	"https://cdn.discordapp.com/attachments/640277076183744542/808112308525858857/image1.png",
	"https://cdn.discordapp.com/attachments/640277076183744542/808112308789837864/image2.png",
	"https://cdn.discordapp.com/attachments/640277076183744542/808112309057749032/image3.png",
	"https://cdn.discordapp.com/attachments/640277076183744542/808112308218757191/image0.png",
	"https://cdn.discordapp.com/attachments/759213166310719569/809415120966385714/image0.png",
	"https://cdn.discordapp.com/attachments/759213166310719569/809254211380183080/image0.jpg",
	"https://cdn.discordapp.com/attachments/759213166310719569/808735049671114782/unknown.png",
	"https://cdn.discordapp.com/attachments/759213166310719569/807078294028812308/image0.png",
	"https://cdn.discordapp.com/attachments/759213166310719569/802669395495092244/image0.png",
	"https://cdn.discordapp.com/attachments/759213166310719569/799418898357026876/image0.png",
	"https://cdn.discordapp.com/attachments/759213166310719569/789140262801768448/image0.png",
	"https://cdn.discordapp.com/attachments/759213166310719569/788928564074512384/image0.png",
	"https://cdn.discordapp.com/attachments/759213166310719569/788411539359006720/image0.jpg",
	"https://cdn.discordapp.com/attachments/759213166310719569/788411487026151484/image0.jpg",
	"https://cdn.discordapp.com/attachments/759213166310719569/788235240300740629/image0.png",
	"https://cdn.discordapp.com/attachments/759213166310719569/774839824778788884/image0.png",
	"https://cdn.discordapp.com/attachments/759213166310719569/770669751033921556/image0.jpg",
	"https://cdn.discordapp.com/attachments/759213166310719569/765751543265755146/image0.png",
	"https://cdn.discordapp.com/attachments/624051363583623178/790708145491410944/image0.png",
	"https://cdn.discordapp.com/attachments/624050933650817025/744344544857948260/image0.png",
	"https://cdn.discordapp.com/attachments/759224797275488306/811696106458710037/unknown.png",
	"https://cdn.discordapp.com/attachments/759224797275488306/811696425213493288/unknown.png",
	"https://cdn.discordapp.com/attachments/759224797275488306/811696485850021928/unknown.png",
	"https://cdn.discordapp.com/attachments/624050933650817025/635878643050217492/KIMG0851.JPG",
	"https://cdn.discordapp.com/attachments/624050933650817025/646670958807089152/Screenshot_2019-11-20-06-18-58.png"
];

module.exports = {
	name: "flashbang",
	description: "Blind a discord user for 5 seconds! Supereffective against people who are in the dark.",
	execute: (interaction) => {
		var x = Helpy.randomResp(images);
		interaction.reply(x);
	}
}