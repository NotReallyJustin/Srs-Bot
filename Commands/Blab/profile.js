module.exports = {
    name: "profile",
    description: "Make profile command useful again, and returns a copy of your pfp.",
    execute : (message) => {
    	let url = message.author.defaultAvatarURL;
    	message.channel.send(url);
    }
}