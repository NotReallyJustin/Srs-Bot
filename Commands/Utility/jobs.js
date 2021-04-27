//Original Credit to Becc :uwuCat:
const Discord = require("discord.js");
const https = require("https");

module.exports = {
	name: "jobs",
	description: "Get the latest internship, programs, and volunteering listings! Credit to Ashley Ngo - ango8101@bths.edu and Alvin Xu (and becc)\nSyntax: `srs jobs`",
	execute: async (message, args) => {
		const jobsJSON = await fetchData();
		const jobsSnapshot = await dataSnapshot(0, 2, jobsJSON);

		const embed = jobEmbed(jobsSnapshot, "None");
		message.channel.send(embed).then(sent => {
			manageReactions(0, 2, sent, message, jobsJSON);
		});
	} 
}

//--------------------------------------JOBS CLASS---------------------------------------------------
//Constructor for job class - will probs be useful when we do data science on this after the SAT
function Job()
{
	//Info key and currKey are universal and depends on how Ashley formats the sheet/whether it changes
	//This goes by columns
	this.infoKey = ["name", "provider", "desc", "link", "location", "categories", "deadline"];
	this.currKey = 0;

	this.name;
	this.provider;
	this.desc;
	this.link;
	this.location;
	this.categories;
	this.deadline;
}

//Checks whether all categories are filled
Job.prototype.checkSet = function() {
	for (var key of this.infoKey)
	{
		if (this[key] == undefined) return false;
	}

	return true;
}

//Adds the next field data
Job.prototype.add = function(txt) {

	if (this.currKey > this.infoKey.length) //Err checking :P
	{
		//Wow more descriptive error than JS will ever give me lmao
		console.error(`JustinWare Error: At jobs.js jobs class with this.name = ${this.name} the currKey(${this.currKey}) is > than the infoKey`);
	}
	else
	{
		var trimmed = txt.length > 800 ? txt.substring(0, 801) + "..." : txt;
		this[this.infoKey[this.currKey]] = trimmed.replace(/(?:\\[rn]|[\r\n]+)+/g, " ").trim();
		this.currKey++;
	}
}

//----------------------------------Helper Methods----------------------------------------------

//Gets data from the sheet
const fetchData = async () => new Promise((resolve, reject) => {
	let data = "";
	let jobsData = [];
	https.get("https://spreadsheets.google.com/feeds/cells/1l97Q-9_HMcvcxslNsG8XfWKkC4ehBYecvE7x_cqTRPs/1/public/full?alt=json", response => {
		response.on("data", pkg => {
			data += pkg;
		});

		response.on("end", () => {
			let entries = JSON.parse(data);

			for (let currCol = 10, currRow = -1; currCol < entries.feed.entry.length; currCol++)
			{
				//incremement when new row + check rows = the first entry will also default to a new row
				if (entries.feed.entry[currCol]["gs$cell"].row != entries.feed.entry[currCol - 1]["gs$cell"].row)
				{
					currRow++;
					jobsData.push(new Job());
				}
				
				jobsData[currRow].add(entries.feed.entry[currCol].content['$t']);
			}

			resolve(jobsData);
		});
	});
});

//Parses le data and limits where to parse
//Converts the job object to something usable by the embed
//THIS FUNCTION IS INCLUSIVE!!!!!!!!!!
const dataSnapshot = async (start, end, data) => {
	var arr = [];
	for (var i = start; i <= end; i++)
	{
		//console.log(data[i].checkSet());
		if (data[i].checkSet())
		{
			var yoy = {
				name: `${data[i].name}`,
				value: `**Provider**: ${data[i].provider} \n` +
					`**Link**: ${data[i].link} \n` +
					`**Location**: ${data[i].location}\n` +
					`**Contacts**: ${data[i].contact} \n` +
					`**Deadline**: ${data[i].deadline} \n` +
					`**Categories**: ${data[i].categories} \n` +
					`${data[i].desc}`
			};

			arr.push(yoy);
		}
	}

	return arr;
}

//More efficient embeds
const jobEmbed = (fields, filters) => {
	let embed = new Discord.MessageEmbed();
	embed.fields = fields;

	embed.setTitle("Job Listings!");
	embed.setDescription(
		"https://spreadsheets.google.com/feeds/cells/1l97Q-9_HMcvcxslNsG8XfWKkC4ehBYecvE7x_cqTRPs/1/public/full?alt=json" +
		`\nFilters: ${filters}`
	);
	embed.setFooter("Job hunting :snore:");

	return embed;
}

//Toggles the start end index and does the embed swapping thingy
//Idk I don't have discord on PS4 or Switch
const prevNextToggle = async(isBackwards, currStart, currEnd, sent, message, jobsJSON) => {
	var newStart = currStart;
	var newEnd = currEnd;

	if (isBackwards)
	{
		if (currStart - 3 >= 0)
		{
			newStart = currStart - 3;
			newEnd = newEnd - 3;
		}
	}
	else
	{
		//We will never end up with overflow in --> direc
		if (currStart + 3 < jobsJSON.length)
		{
			newStart = currStart + 3;
			newEnd = Math.min(jobsJSON.length - 1, currEnd + 3);
		}
	}

	const snap = await dataSnapshot(newStart, newEnd, jobsJSON);
	const newEmbed = jobEmbed(snap, "None");
	sent.reactions.removeAll();
	sent.edit(newEmbed);

	manageReactions(newStart, newEnd, sent, message, jobsJSON);
}

//Manages reactions
//Start + End are pointers for the data snapshot
const manageReactions = (start, end, sent, message, jobsJSON) => {
    if (start - 3 >= 0) sent.react('⏮️'); // prev
    if (start + 3 < jobsJSON.length) sent.react('⏭️'); // next

   	let pwomise = sent.awaitReactions((reaction, user) => user.id == message.author.id && (['⏭️', '⏮️'].includes(reaction.emoji.name)), 
   	{max: 1, time: 60000, errors: ['time'] })
    	
    pwomise.then(async collected => {
		const reaction = collected.first();	
		//Detects whether we're moving backwards
		var isBackwards = reaction.emoji.name == '⏮️';

		prevNextToggle(isBackwards, start, end, sent, message, jobsJSON);
	}).catch(collected => {
    	sent.reactions.removeAll();
    });
}