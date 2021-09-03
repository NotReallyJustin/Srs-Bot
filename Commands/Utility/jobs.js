//Credit for finding the way of getting info from google forms goes to Becc :uwuCat:
const Discord = require("discord.js");
const https = require("https");
const Helpy = require("../Helpy.js");

// Credit to Ashley Ngo - ango8101@bths.edu and Alvin Xu (and becc)\nSyntax: `srs jobs <filter type> <filter query>`. If not provided, srs will default to...well.. default.
module.exports = {
	name: "jobs",
	description: "Teach kids how to code! Rake leaves at the park! Your one stop shop to all things jobs!",
	options: [
		{
            name: "name",
            description: "The name of the job position you're looking for",
            required: false,
            type: "STRING"
        },
        {
            name: "provider",
            description: "Who's you're employer? Gordon Ramsay? Julia Child? Bill Nye the Science Guy?",
            required: false,
            type: "STRING"
        },
        {
            name: "categories",
            description: "Jobs are split up by categories. List one to look for",
            required: false,
            type: "STRING"
        },
        {
            name: "deadline",
            description: "How long can you procrasinate that application? Use MM/DD/YY. This defaults to ongoing.",
            required: false,
            type: "STRING"
        }
	],
	execute: async (interaction) => {
		const jobsJSON = await fetchData();
		let usedArr = jobsJSON; //The array to display later
		let stepArr = "Filters: ";

		const lambSauce = {
			name: interaction.options.getString("name"),
			provider: interaction.options.getString("provider"),
			categories: interaction.options.getString("categories"),
			deadline: interaction.options.getString("deadline")
		};

		for (const key of Object.keys(lambSauce))
		{	
			let filter = lambSauce[key];
			if (filter == undefined) continue;

			switch(key)
			{
				case "name":
				case "provider":
				case "categories":
					var sorted = Helpy.mergeSort(usedArr, (a, b) => {
						return a[key].toLowerCase() < b[key].toLowerCase();
					});

					usedArr = Helpy.binArr(sorted, job => {
						if (!filter) return 2;

						var loCase = job[key].toLowerCase();
						var argCase = filter.toLowerCase();

						if (loCase.includes(argCase)) return 0;
						if (loCase < argCase) return -1;
						if (loCase > argCase) return 1;
					});
				break;

				case "deadline":
					var month = ["", "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

					if (/\bongoing\b|\brolling\b|\btbd\b/gmi.test(filter))
					{
						filter = filter.toUpperCase();
					}
					else
					{
						var bananaSplit = filter.split("/");
						for (var item of bananaSplit) //Maybe could use map
						{
							item.replace(/ /gmi, "");	
						}		

						var offenses = bananaSplit.length < 2 || bananaSplit.length > 3 || month[+bananaSplit[0]] == undefined || isNaN(+bananaSplit[1]) || +bananaSplit[1] < 1 || +bananaSplit[1] > 31 || +bananaSplit[1] != Math.round(+bananaSplit[1]) || (bananaSplit.length == 3 && isNaN(+bananaSplit[2]))
						if (offenses)
						{
							filter = "ONGOING";
						}
						else
						{
							bananaSplit[0] = month[+bananaSplit[0]];

							if (bananaSplit[2] && bananaSplit[2].length == 2)
							{
								bananaSplit[2] = "20" + bananaSplit[2];
							}

							filter = bananaSplit.join(" ");
						}
					}

					var sorted = Helpy.mergeSort(usedArr, (a, b) => {
						a = purifyDate(a.deadline);
						b = purifyDate(b.deadline);

						return a.toLowerCase() < b.toLowerCase();
					});

					usedArr = Helpy.binArr(sorted, (job) => {
						job = purifyDate(job.deadline);

						//You can also compare the numbers in the string, so this should be fine
						if (job.toUpperCase().includes(filter.toUpperCase())) return 0;
						//if (job.includes(args[1].substring(0, args[1].length - 5))) return 0; //Try getting rid of the year and " "
						if (job.toUpperCase() < filter.toUpperCase()) return -1;
						if (job.toUpperCase() > filter.toUpperCase()) return 1;
					});
				break;
			}

			stepArr += `${Helpy.capFirst(key)} = ${Helpy.capFirst(filter)}, `;
		}

		stepArr = stepArr.substring(0, stepArr.length - 2);

		const jobsSnapshot = await dataSnapshot(0, Math.min(2, usedArr.length - 1), usedArr);
		const embed = jobEmbed(jobsSnapshot, stepArr);
		interaction.reply({embeds: [embed], fetchReply: true}).then(sent => {
			manageReactions(0, 2, sent, interaction, usedArr, stepArr);
		});
	} 
}

//--------------------------------------JOBS CLASS---------------------------------------------------
//Constructor for job class - will probs be useful when we do data science on this after the SAT
function Job(name, provider, desc, link, location, contact, categories, deadline)
{
	this.name = name;
	this.provider = provider;
	this.desc = desc.replace(/(?:\\[rn]|[\r\n]+)+/g, " ").trim();
	if (desc.length > 700) this.desc = this.desc.substring(0, 695) + "...";
	this.link = link;
	this.location = location;
	this.contact = contact;
	this.categories = categories;
	this.deadline = deadline == undefined ? "ONGOING" : deadline;
}

//----------------------------------Helper Methods----------------------------------------------

//Gets data from the sheet
const fetchData = async () => new Promise((resolve, reject) => {
	let data = "";
	let jobsData = [];
	https.get("https://docs.google.com/spreadsheets/d/1l97Q-9_HMcvcxslNsG8XfWKkC4ehBYecvE7x_cqTRPs/gviz/tq?tqx=out:json", response => {
		response.on("data", pkg => {
			data += pkg;
		});

		response.on("end", () => {
			let entries = JSON.parse(data.substring(47, data.length - 2)).table.rows;
			const modify = (x => x == undefined ? "" : x.v);

			for (var r = 4; r < entries.length; r++)
			{
				let el = entries[r].c;
				jobsData.push(new Job(modify(el[0]), modify(el[1]), modify(el[2]), modify(el[3]), modify(el[4]), modify(el[5]), modify(el[6]), modify(el[7])));
			}

			resolve(jobsData);

			/* Deprecated version - google updated this JSON formayt in august 2021
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
			*/
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
const prevNextToggle = async(isBackwards, currStart, currEnd, sent, interaction, jobsJSON, filter) => {
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
	sent.edit({embeds: [newEmbed]});

	manageReactions(newStart, newEnd, sent, interaction, jobsJSON, filter);
}

//Manages reactions
//Start + End are pointers for the data snapshot
const manageReactions = (start, end, sent, interaction, jobsJSON, filter) => {
    if (start - 3 >= 0) sent.react('⏮️'); // prev
    if (start + 3 < jobsJSON.length) sent.react('⏭️'); // next

    let x = (reaction, user) => user.id == interaction.user.id && (['⏭️', '⏮️'].includes(reaction.emoji.name));
    let pwomise = sent.awaitReactions({filter: x, time: 60000, errors:['time'], max: 1});
    	
    pwomise.then(async collected => {
		const reaction = collected.first();	
		//Detects whether we're moving backwards
		var isBackwards = reaction.emoji.name == '⏮️';

		prevNextToggle(isBackwards, start, end, sent, interaction, jobsJSON, filter);
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