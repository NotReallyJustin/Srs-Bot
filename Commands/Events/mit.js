/* This is the BTHS Server 4/1 joke in 2021 LMAO
	This whole purpose is to make an MIT application on discord
	That being said, welcome to MIT, h sells 3D printed chizu! */
const Helpy = require("../Helpy.js");
const fs = require("fs");

//It's like a binary tree, but it's not
//this.good and this.bad may be set to null, but it's going to remain there for scalability purposes if we want to use this thing in the future
function MoveLog(execute, good, bad)
{
	this.execute = execute; 
	this.good = good; //Good response function
	this.bad = bad; //Bad response function
}

//Takes an array, and allows us to send the text one by one.
function arrayIncremental(message, arr)
{
	for (var i in arr)
	{
		message.channel.send(arr[i]);
	}
}

//First MIT process phase - apply for MIT
const application = {
	a9: new MoveLog(function (message, currentUser) {
		message.channel.send("Unfortunately, we realized that you breathe oxygen to survive.");
		message.channel.send("As a prestigious university, we cannot accept someone who underachieves that much");
		message.channel.send("Your application has henceforth been denied. Have a great day.");
		currentUser.clearLogs();
	}, null, null),
	a8: new MoveLog(function (message, currentUser) {
		if (!/\baward\b|\bresearch\b|\bpresident\b|\bfounder\b/gmi.test(message.content) || message.content.split(",").length < 20)
		{
			currentUser.acceptanceRate -= 500;
			arrayIncremental(message, [
				"I'm sorry, but at MIT, we value campus diversity. it's unfortunate you can't meet this standard.",
				"We must sadly inform you that your application has been rejected.",
				"Thank you, and please do have a nice day."
			]);

			currentUser.clearLogs();
		}
		else
		{
			currentUser.acceptanceRate += 0.002;
			
			message.channel.send("Great! Now, we're going to ask you some yes or no questions to see if you're fit for MIT culture. Please answer them truthfully.");
			message.channel.send("Does any of these apply to you?");

			let questionChain = new Promise((resolve, reject) => {
				//Credits go to YT video "how mit decides who to reject in 30s"
				let questionsArr = [
					"You have less than 5.0 GPA",
					"Your SAT score is below 1600",
					"You didn't get 800 Math 2",
					"You didn't get 800 Biology",
					"You took less than 50 AP classes",
					"You're majoring in engineering",
					"You're majoring in computer information",
					"You're majoring in statistics",
					"You're majoring in physics",
					"Your name is not Matthew (The most popular admitted name)",
					"Your name is not David (The most popular admitted name)",
					"Your name is not John (The most popular admitted name)",
					"Your name is not Anna (The most popular admitted name)",
					"You're asian",
					"You're mexicasian",
					"You're africasian",
					"Daddy tried to donate TWO buildings - but they didn't care (should have donated 3 smh)",
					"You're legacy - but MIT didn't care",
					"You do sports (Justin note: this is actually true - MIT blog says they don't care if you're an athlete)",
					"You're not the captain of the math team",
					"You're not the capatin of the science team",
					"You didn't take calculus in 7th grade",
					"You didn't get perfect score on the AMC",
					"You don't understand quantum physics",
					"You don't know the first million digits of pi",
					"And most importantly - you're applying to Caltech."
				];
				let passed = true; //Keeps track of whether or not the user has answered yes to everything so far

				/* Uses recursion to ask all the questions in the questionsArr and responds to user reply.
				When the array runs out, then just resolve it and jump out of the loop + continue to a9, hopefully
				This thing doesn't use a loop though because we want this to be executed only when we get a response and not 5000 times second spam lol
				@param i Keeps track of what iteration we are on in the questionsArr*/
				function askQChain(i)
				{
					i < questionsArr.length || resolve(passed);

					currentUser.swapLogs(new MoveLog(function (message, currentUser) {
						message.channel.send(questionsArr[i]);
						passed = !/\byes\b|\byep\b|\bye\b/gmi.test(message.content);

						i++;
						askQChain(i, passed); //Asynchronous event queueing?
					}, null, null));
				}
			});

			//Continuation of the overall larger chain. When it runs out, proceed the normal stuff.
			questionChain.then(passed => {
				if (passed)
				{
					message.channel.send("hmmmm... it seems you passed all the weedout questions!");
					currentUser.swapLogs(this.good);
				}
				else
				{
					message.channel.send("I'm sorry, but you are unfit for life in MIT. We believe you wouldn't be successful at our campus.");
					message.channel.send("We regret to tell you your application has been denied. We will shortly send you a rejection letter via mail.");
					currentUser.clearLogs();
				}
			});
		}
	}, application.a9, null),
	a8: new MoveLog(function (message, currentUser) {
		if (/\byes\b|\byep\b|\bye\b|\bI did\b/gmi.test(message.content))
		{
			currentUser.acceptanceRate = 0;
			arrayIncremental(message, [
				"I'm sorry, but as a campus that values overcoming adversity, you don't meet the qualifications we are seeking for.",
				"Your life wasn't hard enough to show that you have the capabilities of overcoming barriers.",
				"We henceforth must reject your college application.",
				"Thank you."
			]);

			currentUser.clearLogs();
		}
		else
		{
			currentUser.acceptanceRate += 0.001;
			arrayIncremental(message, [
				"Great!",
				"Here at MIT, we recognize external factors such as socioeconomic status affecting your ability to perform well.",
				"In order to create a more diverse campus from all walks of life, does any of the following apply to you?",
				"1) You come from a planet outside of the Milky Way",
				"2) You are scientifically classified as something other than a human",
				"3) You professionally speak Esperanto",
				"4) Writings 📝 not that easy ✅, but 🍑 Grammarly can help 💁. This sentence 😭👌💯 is grammatically correct 🚫✅ but 🍑 its wordy and hard 💎 to read 📖, it undermines 🚫 the writer's 📝 message 💬 and the word 📝 choice 🔞 is bland 🐢. Grammarly's cutting-edge 🗡🔪 technology 📱 helps 🆘 you 👉🙇👈 craft ⚒ compelling 💰 understandable 🤔 that makes 🖕 an impact 💣 on 🔛 your reader 📖. much 🔥 better 👍. Are you 👈 ready 😏 to give 🎁 it a try 😈? Installation is simple 😡 and free 🆓, visit 🚗 Grammary.com today 📆",
				"5) You're Mark Zuckberg, which automatically means you qualify as an alien",
				"6) Your skin color is blurple, limellow, or blorange",
				"7) Your family has a net worth of *checks US debt clock* -$26.5 trillion",
				"8) Oh right, we forgot about gender diversity thus far. You sexually identify as Kim Kardashian (in layman terms, you sexually identify as plastic)."
				"9) You're from upstate New York [Fact Check: Upstate New York doesn't actually exist and is a conspiracy theory to force NYC to concede power to Albany]",
			]);

			currentUser.swapLogs(this.good);
		}
	}, application.a9, null),
	a7: new MoveLog(function (message, currentUser) {
		if (!/\baward\b|\bresearch\b|\bpresident\b|\bfounder\b/gmi.test(message.content) || message.content.split(",").length < 20)
		{
			currentUser.acceptanceRate -= 500;
			arrayIncremental(message, [
				"We are very sad to have to tell you that your extracirriculars aren't impressive enough.",
				"Due to the increased load of applicants, we can only accept you if you are the founder or president of > 20 clubs.",
				"Thank you, and have a nice day."
			]);

			currentUser.clearLogs();
		}
		else
		{
			currentUser.acceptanceRate += 0.002;
			arrayIncremental(message, [
				"Hmm this is interesting.",
				"Your extracirriculars are quite impressive.",
				"Now, let's move on to holistic admissions and adversity.",
				"Does all of the following outstanding circumstances apply to you:"
				"1) You were born in the middle of a stranded desert island and had to swim 50 light years to leave the island?",
				"2) Are you the physical reincarnation of god?",
				"3) Did you have to trek 20 miles, climb a mountain, and fight tigers everyday on your way to school on one foot while your other foot was starting a business?",
				"4) Parents keep talking about 'when I was your age.' But have you ever lived a life without wifi, instagram, and facebook for 16+ years?",
				"5) Do you have a genetic mutation that physically prevents you from applying to MIT?",
				"6) Did you have 50 siblings, 80 pets, and 314159 goldfishes to take care of afterschool, which prevented you from applying to the required 9*10^6 clubs?",
				"7) Do you live in the middle of Antarctica, which prevented you from applying for a position as the United Nations Diplomat?"
			]);

			currentUser.swapLogs(this.good);
		}
	}, application.a8, null),
	a6: new MoveLog(function (message, currentUser) {
		if (!/\byes\b|\byep\b|\bye\b|\bI did\b/gmi.test(message.content))
		{
			currentUser.acceptanceRate -= 500;
			arrayIncremental(message, [
				"Unfortunately you are not academically impressive enough for MIT.",
				"Our administration is beyond sad that we have to reject you.",
				"We will shortly contact you regarding your application fees."
			]);

			currentUser.clearLogs();
		}
		else
		{
			currentUser.acceptanceRate += 0.001;
			arrayIncremental(message, [
				"Not bad.",
				"Now let's take a look at your extracirriculars.",
				"Please provide a list of them."
			]);

			currentUser.swapLogs(this.good);
		}
	}, application.a7, null),
	a5: new MoveLog(function (message, currentUser) {
		if (/\byes\b|\byep\b|\bye\b|\bI did\b/gmi.test(message.content))
		{
			currentUser.acceptanceRate = 0;
			arrayIncremental(message, [
				"I'm sorry, but MIT des not accept nuclear scientists",
				"Your application has henceforth be denied because we don't think it's impressive enough.",
				"We will shortly contact you regarding MIT admission fees."
			]);

			currentUser.clearLogs();
		}
		else
		{
			currentUser.acceptanceRate += 0.001;
			arrayIncremental(message, [
				"wonderful!",
				"Have you done any of the following:",
				"1) Colonized the solar system",
				"2) Invented time travel",
				"3) Discovered the elexir of immortality",
				"4) Prove the world is flat",
				"5) Get a 1610 on the SAT"
			]);

			currentUser.swapLogs(this.good);
		}
	}, application.a6, null),
	a4: new MoveLog(function (message, currentUser) {
		if (/\blas\b|\bssr\b|\blaw and society\b|\bsocial science research\b/gmi.test(message.content))
		{
			currentUser.acceptanceRate -= 99.999;
			arrayIncremental(message, [
				"Thankfully, MIT does not support your major.",
				"Your application has been denied.",
				"We will shortly contact you about paying your application fee.",
				"You might want to rob a bank for that.",
				"Have a great day."
			]);

			currentUser.clearLogs();
		}
		else
		{
			currentUser.acceptanceRate += 0.001;
			arrayIncremental(message, [
				`Great! Now, we'll get started on some preliminary questions.`,
				"Have you ever built a nuclear reactor?"
			]);

			currentUser.swapLogs(this.good);
		}
	}, application.a5, null),
	a3: new MoveLog(function (message, currentUser) {
		currentUser.school = message.content;

		arrayIncremental(message, [
			`Hmm... ${message.content}... wonderful.`,
			"What is your major?"
		]);

		currentUser.swapLogs(this.good);
	}, application.a4, null),
	a2: new MoveLog(function (message, currentUser) {
		currentUser.name = message.content;
		arrayIncremental(message, [
			"Alrighty there. What is your school?"
		]);

		currentUser.swapLogs(this.good);
	}, application.a3, null),
	a1: new MoveLog(function (message, currentUser) {
		arrayIncremental(message, [
			"Welcome to the MIT Admissions process! I am the MIT Bot, and my sole purpose today is to guide you through our MIT Portal!",
			"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1280px-MIT_logo.svg.png",
			"MIT is a prestigious school in Boston, Massachusetts, founded by David Newman the 5th in the year of 500BC.",
			"For over a century, we have remained the pinnacle of technological progress in the US - by US, we mean the NorthEast because the rest of the country is irrelavant",
			"As part of the Official MIT Discord **TM**, you have expedited access to the new 'Whitelisted' admissions program.",
			"Not only will you be able to apply after the waitlist deadline, you will also be able to apply before the summer of 2021 for EA.",
			"Now, may I ask, what is your name?"
		]);

		currentUser.swapLogs(this.good);
	}, application.a2, null)
};

//2nd phase - Pay for MIT application
const payment = {
	a5: new MoveLog(function (message, currentUser) {
		arrayIncremental(message, [
			"Great!",
			"After we hack a bank account under your identity and steal your pension funds, you will pay approximately $0 to attend MIT!",
			"Thank you, and have a splendid, debt-free day!"
		]);

		currentUser.clearLogs();
	}, null, null),
	a4: new MoveLog(function (message, currentUser) {
		arrayIncremental([
			"Alright then, do as you will.",
			"Your need-based aid application has been denied.",
			"In order to attend MIT, you will need to make a deposit of $450504539458594547598324759234752394576439756438576458734658435649856 by 4/2/2021",
			"Should you need this money, feel free to take out a student loan.",
			"Thank you, and have a splendid day!"
		]);

		currentUser.clearLogs();
	}, null, null),
	a3: new MoveLog(function (message, currentUser) {
			message.channel.send("Do you confirm?");
			if (message.attachments.length != 2 && !/\byes\b|\byep\b|\bye\b|\bI did\b/gmi.test(message.content))
			{
				currentUser.swapLogs(this.bad);	
			}
			else
			{
				currentUser.swapLogs(this.good);
			}
	}, payment.a5, payment.a4),
	a2: new MoveLog(function (message, currentUser) {
		if (+message.content)
		{
			arrayIncremental(message, [
				"Excellent! Now, please send me a photo of your birth certificate and passport.",
				"Do you also consent to us stealing your identity and commiting crimes with it?"
			]);

			currentUser.swapLogs(this.good);
		}
		else
		{
			let arr = [
				"Sorry, this is not a social security number.",
				"Please provide a social security number.",
				"This is not a social security number; I cannot steal your pension funds from this."
			];

			message.channel.send(Helpy.randomResp(arr));
			currentUser.swapLogs(this.bad);
		}
	}, payment.a3, payment.a2),
	a1: new MoveLog(function (message, currentUser) {
		arrayIncremental(message, [
			"Congratulations on getting to MIT! I am MIT bot, and today I will be guiding you through the financial aid process!",
			"Our annual tuition is around $40,000 on a good day",
			"However, due to COVID-19, we have decided to raise the cost to around $5 million in order to afford more services such as premium zoom calls,",
			"That being said, let's get started!",
			"Please type the first 31415926 digits of your social security number."
		]);
		currentUser.swapLogs(this.good);
	}, payment.a2, null);
};

//3rd phase - Get MIT announcements
const announcements = {
	a1: new MoveLog(function (message, currentUser) {
		let news = fs.readFileSync(Helpy.randomResp(fs.readdirSync("./MIT_NEWS")));

		message.channel.send(`New announcements and breaking news from MIT!\n${news}`);
	}, null, null);	
};

module.exports = {
	name: "mit",
	description: "Welcome to the oficial MIT Application Portal. Please wait until a moderator starts the MIT application process for you.",
	execute: (message, currentUser, bot) => {
		//Justin triggers react
		if (message.author.id == '348208769941110784')
		{
			///This eval is secure - only Justin can trigger this
			let uid = message.content.substring(1, message.content.indexOf(" "));
			bot.user.fetch(uid).then(user => {
				user.send(eval(message.content.substring(message.content.indexOf(" "))));
			});
		}
		else
		{
			message.channel.send(`**Your current chance of getting into MIT is: ** ${currentUser.acceptanceRate * 100}%`)
			currentUser.responseLogs(message, currentUser);
		}
	}
}