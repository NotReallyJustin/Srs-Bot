const Helpy = require("../Helpy.js");

const sleeeeep = [
	"Smh how can you tell me to sleep when you're up at horny hour",
    "Smh stop staying up until 3AM and actually hit the bed",
    "i don't need sleep, I need answers"
];

module.exports = {
    name: "sleep",
    description: "If you're looking at this, you might need sleep.",
    execute : (interaction) => {
        let x = Helpy.randomResp(sleeeeep);
        interaction.reply(x);
    }
}