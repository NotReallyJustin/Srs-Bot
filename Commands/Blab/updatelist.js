//The current update thing!
const currUpdate = "Justin's studying for the SAT to try and make Srs proud with a 1520!";

module.exports = {
    name: "updatelist",
    description: currUpdate,
    execute : (message) => {
        message.channel.send(currUpdate);
    }
}