/*	Srs Bot's helpful toolkit that's carried around!
	Except this one is more dynamic than Pure.js where we just lumped all the pure functions together.
	All functions here are still pure, but it's a utility js file now. .
	Also fun fact, did you know Helpy is a cute animatronic in FNAF 6? 
	Don't worry too much abt it lmao, we're not forcing him to jump off a plank here
	While you're here, watch this funny video:
	https://www.youtube.com/watch?v=v9M55TfKzcQ */

//Damn I got sick of writing comments after being forced to write javadocs in CSA.

//Takes an array and yeets a random thing from that
module.exports.randomResp = (arr) => {
	return arr[Math.floor(Math.random() * arr.length)];
}

//Returns the arguments inside the bot command that is not bounded to a specific argument index - a bounded argument is stuck to a specific array idx
//Usually happens when the user can write any message they like (ie. a message to dm to another discord user)
//Message param requires you to input message.content usually
//Hey don't judge, it's a good way to get rid of all the srs advice etc etc.. stuff
module.exports.returnUnbound = (message, lastBoundArg) => message.substring(message.indexOf(lastBoundArg) + lastBoundArg.length);

//Combines discord attachments and the message content to form one huge msg blob that we can just send a once o.o
module.exports.messageCompile = (msgContent, attachArray) => attachArray.reduce((acc, attachment) => acc + attachment.url + "\n", msgContent);

//Date 1 is current date, date 2 is target date
module.exports.dateDistance = (date1, date2) => dateFrom0(-1, date2.getMonth(), date2.getDate()) - dateFrom0(-1, date1.getMonth(), date1.getDate());