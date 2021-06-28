//Credit for finding the way of getting info from google forms goes to Becc :uwuCat:
const Discord = require("discord.js");
const https = require("https");
const Helpy = require("../Helpy.js");

module.exports = {
	name: "jobs",
	description: "Get the latest internship, programs, and volunteering listings! Credit to Ashley Ngo - ango8101@bths.edu and Alvin Xu (and becc)\nSyntax: `srs jobs <filter type> <filter query>`. If not provided, srs will default to...well.. default.",
	execute: async (message, args) => {
		const jobsJSON = await fetchData();
		let usedArr; //The array that will be used when displaying stuff
		let filter; //Le filter the data is going through

		switch (args[0])
		{
			case "name":
			case "provider":
			case "categories":
				var sorted = Helpy.mergeSort(jobsJSON, (a, b) => {
					return a[args[0]].toLowerCase() < b[args[0]].toLowerCase();
				});

				usedArr = Helpy.binArr(sorted, (job) => {
					if (!args[1]) return 2;

					var loCase = job[args[0]].toLowerCase();
					var argCase = args[1].toLowerCase();

					if (loCase.includes(argCase)) return 0;
					if (loCase < argCase) return -1;
					if (loCase > argCase) return 1;
				})

				//Capitalize 1st letter of filter query
				filter = `${Helpy.capFirst(args[0])} Filter : ${Helpy.capFirst(args[1])}`;
			break;

			//Keep in mind deadline only filters the *exact date*.
			//Must be inserted via mm/dd/yyyy, but you can also do mm/dd
			case "deadline":
				var month = ["", "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

				if (args[1] == undefined)
				{
					args[1] = "ongoing";
				}
				else if (/\bongoing\b|\brolling\b|\btbd\b/gmi.test(args[1]))
				{
					args[1] == args[1].toLowerCase();
				}
				else
				{
					var bananaSplit = args[1].split("/");
					for (var item of bananaSplit)
					{
						item.replace(/ /gmi, "");	
					}		

					var offenses = bananaSplit.length < 2 || bananaSplit.length > 3 || month[+bananaSplit[0]] == undefined || isNaN(+bananaSplit[1]) || +bananaSplit[1] < 1 || +bananaSplit[1] > 31 || +bananaSplit[1] != Math.round(+bananaSplit[1]) || (bananaSplit.length == 3 && isNaN(+bananaSplit[2]))
					if (offenses)
					{
						args[1] = "ONGOING";
					}
					else
					{
						bananaSplit[0] = month[+bananaSplit[0]];

						if (bananaSplit[2] && bananaSplit[2].length == 2)
						{
							bananaSplit[2] = "20" + bananaSplit[2];
						}

						args[1] = bananaSplit.join(" ");
					}
				}

				var sorted = Helpy.mergeSort(jobsJSON, (a, b) => {
					a = purifyDate(a.deadline);
					b = purifyDate(b.deadline);

					return a.toLowerCase() < b.toLowerCase();
				});

				usedArr = Helpy.binArr(sorted, (job) => {
					job = purifyDate(job.deadline);

					//You can also compare the numbers in the string, so this should be fine
					if (job.toUpperCase().includes(args[1].toUpperCase())) return 0;
					//if (job.includes(args[1].substring(0, args[1].length - 5))) return 0; //Try getting rid of the year and " "
					if (job.toUpperCase() < args[1].toUpperCase()) return -1;
					if (job.toUpperCase() > args[1].toUpperCase()) return 1;
				})

				filter = `Deadline Filter: ${Helpy.capFirst(args[1])}`;
			break;

			default:
				usedArr = jobsJSON;
				filter = "Filters: None";
			break;
		}

		const jobsSnapshot = await dataSnapshot(0, Math.min(2, usedArr.length - 1), usedArr);
		const embed = jobEmbed(jobsSnapshot, filter);
		message.channel.send(embed).then(sent => {
			manageReactions(0, 2, sent, message, usedArr, filter);
		});
	} 
}

//--------------------------------------JOBS CLASS---------------------------------------------------
//Constructor for job class - will probs be useful when we do data science on this after the SAT
function Job()
{
	//Info key and currKey are universal and depends on how Ashley formats the sheet/whether it changes
	//This goes by columns
	this.infoKey = ["name", "provider", "desc", "link", "location", "contact", "categories", "deadline"];
	this.currKey = 0;

	this.name = "";
	this.provider = "";
	this.desc = "";
	this.link = "";
	this.location = "";
	this.contact = "";
	this.categories = "";
	this.deadline = "ONGOING";
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
		var trimmed = txt.length > 700 ? txt.substring(0, 701) + "..." : txt;
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
		"https://docs.google.com/spreadsheets/d/1l97Q-9_HMcvcxslNsG8XfWKkC4ehBYecvE7x_cqTRPs/edit#gid=0" +
		`\n${filters}`
	);
	embed.setFooter("Job hunting :snore:");

	return embed;
}

//Toggles the start end index and does the embed swapping thingy
//Idk I don't have discord on PS4 or Switch
const prevNextToggle = async(isBackwards, currStart, currEnd, sent, message, jobsJSON, filter) => {
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
	const newEmbed = jobEmbed(snap, filter);
	sent.reactions.removeAll();
	sent.edit(newEmbed);

	manageReactions(newStart, newEnd, sent, message, jobsJSON, filter);
}

//Manages reactions
//Start + End are pointers for the data snapshot
const manageReactions = (start, end, sent, message, jobsJSON, filter) => {
    if (start - 3 >= 0) sent.react('⏮️'); // prev
    if (start + 3 < jobsJSON.length) sent.react('⏭️'); // next

   	let pwomise = sent.awaitReactions((reaction, user) => user.id == message.author.id && (['⏭️', '⏮️'].includes(reaction.emoji.name)), 
   	{max: 1, time: 60000, errors: ['time'] })
    	
    pwomise.then(async collected => {
		const reaction = collected.first();	
		//Detects whether we're moving backwards
		var isBackwards = reaction.emoji.name == '⏮️';

		prevNextToggle(isBackwards, start, end, sent, message, jobsJSON, filter);
	}).catch(collected => {
    	sent.reactions.removeAll();
    });
}

const purifyDate = (str) => {
	var arr = str.split("DEADLINE");
	var date = arr[arr.length - 1];

	if (date[0] == " ")
	{
		return date.substring(1);
	}

	if (date[0] == ":")
	{
		if (date[1] == " ")
		{
			return date.substring(2);
		}
		else
		{
			return date.substring(1);
		}
	}

	return date;
}