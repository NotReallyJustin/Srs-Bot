module.exports = {
    name: "joke",
    description: "Tell a joke to srs bot!",
    execute : (message, args, toolkit) => {
        message.channel.send("smh you're a joke");
    }
}