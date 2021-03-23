module.exports = {
	name: "uwu",
	description: "uwuify something uwu\n`srs uwu <message to uwu>",
	execute: (message, args) => {

		if (args.length == 0)
		{
			message.channel.send("uwu you need to provide a message to uwu");
		}
		else
		{
			let str = uwuify(message.content);
			message.channel.send(str);
		}
	}
}

const uwuify = msgContent => {
	let uwuMsg = msgContent.replace(/[rl]/gmi, "w").substring(8); //This will get rid of srs uwu exactly
	uwuMsg = uwuMsg.replace(/om/gmi, "um")
		.replace(/be/gmi, "bwe").replace(/de/gmi, "dwe")
		.replace(/thi/gmi, "thwi")
		.replace(/ha/gmi, "hwa")
		.replace(/mo/gmi, "mwo")
		.replace(/so/gmi, "swo")
		.replace(/bo/gmi, "bwo")
		.replace(/do/gmi, "dwo")
		.replace(/ff/gmi, "fw")
		.replace(/qu/gmi, "qw");

	return uwuMsg;
}

/*const uwuify = function(str) {
	return {
		efhufhiueywuifywfuiewyfiuweyfiuweyfueiwyfewiufye
	}
}*/