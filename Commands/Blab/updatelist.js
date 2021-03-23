//The current update thing!
const currUpdate = "Reworking the srs bot code, and crying because the PSAT is canceled";

module.exports = {
    name: "updatelist",
    description: currUpdate,
    execute : (message) => {
        message.channel.send(currUpdate);
    }
}