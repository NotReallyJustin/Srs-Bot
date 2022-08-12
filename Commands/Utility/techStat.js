const https = require("https");
const { parse } = require("node-html-parser");
const Discord = require("discord.js");
const COVID = "https://schoolcovidreportcard.health.ny.gov/data/geo/counties.json";
const TECH_COVID = "https://schoolcovidreportcard.health.ny.gov/data/public/school.300000.331300011430.json";

//Key to convert value back to name and traverse JSON
const CONVERSION = {
    p: {name: "DOE Today", query: "currentCounts"}, 
    pw: {name: "DOE Past Week", query: "lastSevenDaysCounts"},
    pa: {name: "DOE Since Forever", query: "allTimeCounts"}
};

const BOROUGHS = [
    {name: "QUEENS", area: "Queens"},
    {name: "BRONX", area: "Bronx"},
    {name: "KINGS", area: "Brooklyn"},
    {name: "RICHMOND", area: "Not-Part-Of-NYC Island"},
    {name: "NEW YORK", area: "Manhattan"}
];

module.exports = {
    name: "techstat",
    description: "DOE use SQL challenge + DOE not leak addresses of 5000 people challenge",
    options: [
		{
            name: "filter",
            description: "Which set of data do you want to see?",
            required: true,
            type: Discord.ApplicationCommandOptionType.String,
            choices: [
            	{name: "BTHS", value: "bths"},
            	{name: "DOE Today", value: "p"},
            	{name: "DOE Past Week", value: "pw"},
                {name: "DOE Running COVID Record", value: "pa"}
            ]
        },
        {
            name: "school",
            description: "If your school is irrelevant enough to be excluded from filter list maybe put the BEDS code",
            required: false,
            type: Discord.ApplicationCommandOptionType.String
        }
	],
    execute : async (interaction) => {
    	const filter = interaction.options.getString("filter");
        const school = interaction.options.getString("school");
        await interaction.deferReply();

        //Attendance data - could be used later down the line
        const attendanceDOM = parse(await fetchAttendance()); //Used later in DOE
        const schoolAttendances = Array.from(attendanceDOM.querySelectorAll("tr"));

        //If there's no <tr> inside the website, that means there's no school rn so not stats to report
        if (!schoolAttendances.length)
        {
            interaction.editReply("Sorry there is no school stats to report right now. There probably isn't school either");
            return;
        }

        schoolAttendances.shift(); //1st entry is table column desc

        //Parse attendance, handle if school, and embed magic
        if (school || filter == "bths")
        {
            var bthsAttendance = findSchool(schoolAttendances, filter == 'bths' ? "13K430" : school);
            if (bthsAttendance == -1)
            {
                interaction.editReply("Hmm the school doesn't seem to exist");
            }
            else
            {
                https.get(TECH_COVID, resp => {
                    var cumL = "";
                    resp.on("data", (data) => {
                        cumL += data;
                    });

                    resp.on("end", () => {
                        cumL = JSON.parse(cumL);

                        let embed = new Discord.EmbedBuilder();
                        embed.setTitle("BTHS Stats 📈");
                        embed.setDescription(`**Last Updated:** ${cumL.updateDate}`);
                        embed.addField("Attendance", [
                            `**Last Updated:** ${bthsAttendance[2].innerText}`,
                            `**Attendance Rate:** ${bthsAttendance[3].innerText}%`
                        ].join("\n"));
                        embed.addField("COVID", [
                            `**Current Positive Students:** ${cumL.currentCounts.positiveStudents}`,
                            `**Current Positive Teachers:** ${cumL.currentCounts.positiveTeachers}`,
                            `**Current Positivity Rate:** ${cumL.currentCounts.percentPositiveTotal}%`,
                            `**7 Day Positive People:** ${cumL.lastSevenDaysCounts.positiveTotal}`,
                            `**7 Day Positivity:** ${(cumL.lastSevenDaysCounts.positiveTotal / cumL.currentCounts.totalEnrolled * 100).toFixed(2)}%`,
                            `**Total Positives Since ${Math.floor(Math.random() * 9999)}BC:** ${cumL.allTimeCounts.positiveTotal}`
                        ].join("\n"));
                        embed.addField("Screenings", [
                            `**Screenings Today:** ${cumL.totalTests[0].totalTests}`,
                            `**Past 7 Days:** ${cumL.totalTests.reduce((acc, curr) => acc + curr.totalTests, 0)}`
                        ].join("\n"));
                        embed.setFooter({text: "Recent Update: DOE stopped sharing screening data. Feels scummy."});
                        embed.setColor("#03286b");

                        interaction.editReply({embeds: [embed]});
                    });
                });
            }
        }
        else
        {
            https.get(COVID, resp => {
                var cumL = "";

                resp.on("data", data => {
                    cumL += data;
                });

                resp.on("end", () => {
                    cumL = JSON.parse(cumL);
                    
                    let embed = new Discord.EmbedBuilder();
                    embed.setTitle(`Stats From ${CONVERSION[filter].name} 📈`);
                    embed.setDescription(`**Last Updated:** ${cumL.QUEENS.publishDate}`);

                    embed.addField("Attendance", [
                        `**Last Updated**: ${schoolAttendances[3].querySelectorAll("td")[2].innerText}`,
                        `**Attendance Rate**: ${attendanceDOM.getElementById("ctl00_ContentPlaceHolder1_lblPcnt").innerText}`
                    ].join("\n"));

                    //Uses existing constants to just loop through all boroughs and all fields we need while tracking a last cumulative array
                    let cumulative = [0, 0, 0, 0];
                    var addRet = (data, idx) => {
                        cumulative[idx] += data;
                        return data;
                    };

                    BOROUGHS.forEach(borough => {
                        var target = cumL[borough.name][CONVERSION[filter].query];
                        embed.addField(borough.area, [
                            `**Current Positive Students:** ${addRet(target.positiveStudents, 0)}`,
                            `**Current Positive Teachers:** ${addRet(target.positiveTeachers, 1)}`,
                            `**Current Positive Staff:** ${addRet(target.positiveStaff, 2)}`,
                            `**Total Positive:** ${addRet(target.positiveStudents + target.positiveStaff + target.positiveTeachers, 3)}`,
                            `**Positivity Rate:** Currently broken; DOE won't disclose borough enrollment information`
                        ].join("\n"));
                    });

                    embed.addField("Total", [
                        `**Current Positive Students:** ${cumulative[0]}`,
                        `**Current Positive Teachers:** ${cumulative[1]}`,
                        `**Current Positive Staff:** ${cumulative[2]}`,
                        `**Total Positive:** ${cumulative[3]}`,
                        `**Positivity Rate:** Currently broken; DOE won't disclose borough enrollment information`
                    ].join("\n"));

                    embed.setFooter({text: "Recent Update: DOE stopped sharing screening data. Feels scummy."});
                    interaction.editReply({embeds: [embed]});
                });
            });
        }
    }
}

const fetchAttendance = () => new Promise((resolve, reject) => {
    //Attendance will be included for all DOE Data
    let req = https.request("https://www.nycenet.edu/PublicApps/Attendance.aspx", {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "max-age=0",
            "content-type": "application/x-www-form-urlencoded",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"100\", \"Google Chrome\";v=\"100\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "cookie": "_ga=GA1.2.1229847341.1647136116; dtCookie=v_4_srv_2_sn_103725987BA1497955BCCD542BBEEDB1_perc_100000_ol_0_mul_1_app-3Aa02a80c0651cea0c_0; rxVisitor=1650044862737I640179CH1P4936RRMK46E3GJUFJV8UL; _gid=GA1.2.257781310.1650044863; _gat_gtag_UA_40262604_1=1; rxvt=1650052335515|1650048503434; dtPC=2$50535407_358h-vQVHCANNQBBNWCMHNHFPNQGMFRIUKEDPH-0e0; dtLatC=1; dtSa=true%7CC%7C-1%7C%5Bctl00%24ContentPlaceHolder1%24gvAttendance%24ctl23%24ddlPageSize%5D%20to%20value%20%5BALL%5D%7C-%7C1650050552793%7C50535407_358%7Chttps%3A%2F%2Fwww.nycenet.edu%2FPublicApps%2FAttendance.aspx%7C%7C%7C%7C",
            "Referer": "https://www.nycenet.edu/PublicApps/Attendance.aspx",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "method": "POST"
    }, response => {
        var total = "";
        response.on("data", data => {
            total += data;
        });

        response.on("end", () => {
            total = total.toString();
            resolve(total);
        });

        response.on("error", (err) => {
            reject(err);
        })
    });

    req.write("__EVENTTARGET=ctl00%24ContentPlaceHolder1%24gvAttendance%24ctl23%24ddlPageSize&__EVENTARGUMENT=&__LASTFOCUS=&__VIEWSTATE=ysMi1DI0%2B81xdY8TA7hzVWulIGlOZaF%2Bx53oUeG%2BLeZ09IJMDBQhTspaJbB0%2F%2FPTGfoTHP85CDZltAuNFeM7SPn47Lzne8FTzUU1XGLmGwrbsyQ27MAXrc1%2Fax%2FbU0lZw9PTbmlgU427SNc27wfOhuVmr0G7OykidXTixOvQ4AAf9dNR5HhidAXBN9y9cKyPbkv2datvLdzUOYTVok1e6KT%2BmJxMSrr0dk4tBrmjOQNFPvNyMEsOyPVPy3puzxm1M09wQJAtqoV2zGIRT%2BJXYn2eSN9jyXLKZ0fRzjGUf%2Bbg75CupERwSj0K4zkcRyPnBEj53Y4PAoraSR3H8vsZz0tnHjrtjY%2Bfl%2BhiY2j99IBWX0DwdmZ6NCMIy4rdJXblMII%2Be0sTvGSOJeaYICnIjEL1xCMgZGlUVOqcFe1jAPRArlDSiaSgBZKLqJKvhcyqzDS257D%2FGY3YhEvoXGx61z5v%2FUzvyqXdVL2eXoQPcBCPTJDlyOQNv6demMPygjQjHhIcYMBZJZd42pNd1X2z989i4Uyi28W4tUXdpNz7m%2Fdil5s%2Bg59zj6idsdqhPM4LeyPEWEHZuk3sV98A7vp7HiZhS32jwzOqBFqQUQdv7cEyijb7XPsG8omynQLWdVSkiklQwfmqIYjs826ftuLXqzG1czsqKVkbU0FgDxQq8qm3tFuH6EHnzS6UXDQJttrx%2BfmZFRAXlhUZirmSs9%2Bre4QkdIapcRk00ipSjpAOGuxjoZ7LkAaCEseV80mX2gHlGJsvwBDlMJ3Bo1zeba7dFUuPpnbZEbH9j6JopBqVWiR54ttvc9MgYOtrt28ScJ1kFZtwfImTn6Ao1kmirow9Ice7bpGhQDtm3oyTj2YMRpjGVFZyoh755Ez2g6fnTmo7JDNWeiiv7TmkeXMu6KDEjBWXE5R6CbEMve22MwOZ%2FtWF67SDe5BE%2BjXMnoDzqeKLnAYZB3awIIWBT0aMQRVbPtItBD1rGq6JTNfmbp9QyJa9CWZE1EyA6vH4dEZcYONF%2FJoasLjNYdalVPYRswUSVpV29dGd87zXbdwCF5hpBoBsEDouM8U79oju5H9iYmdH4CpqIEsl7kfMXGwOxNHXYtuSsSDFNvqCVDXu%2BtgJp%2BCWNhyNTJSJloOrZzmvwnXZrlYn4%2FhGUTZBnhZweTwVnzfR5sGC8LyT3Tl%2BBR8lUNKNtK9oCkgOL0aZopTu2zakGsH2nE7DAD0UrfwNHjP5ijvgxr146Gf529zEbAGvRqJLfqPO7DrGC6OolOvQLiYymDcBt%2Bk5jjgj0vLXfyqOcZMTaX84CstZOKjqMsdVEs6CCvLNVlqeONEoLoWaQmUuWMBu75yFKvdTdSKfFtyPc3Q1Yrik7IncghWgqVNSLnJ64RAw8tIWGcZOj1GCqH9ea%2Fszdkdqs4%2BkrfhBp2yWKTIch08ZyA1EKOOeAdpZm6xBxotrkege6BIMHmZKI8WIODvFl1ZHjnPldoRghmDzsTOnrxJyxh%2FBq3vFhV9Iy5Y%2BblA2GuOhBnhuYeUrRJK7MmH5%2BEdmw27Ol6oVH7nV%2BQV%2B5mawW%2FDgVIOiuEEwhudK5VyFdyZH6rdc%2BU86XjY5cBztkHyaWrM5WRN7emTqah7fVW7G1VmPmh9VMlCcQ2iR03dLOKkWPkhUZmjdOiuTsTtT1ZhXAJLIU61tM1BpiZpifzIOzCuH6R%2FuzY9IVwlyZTk9dNKfqEfZYgcGt9Orh6VOPgLfXq%2FVEGXUY0nxlCSWQSOEzLRbeMG4JG7smi9oG%2B%2FKV9V1IK4DIWfugHPE7%2FzAMPgsm7S1jDudSNrPQwH3vdF4wTjkNtrOBgB8CZrXNVIcGIuMywm9Tfvcz1EC7k2WAVgcaJnzRiEnniiOrhCXpCke3r2fkB%2Be6K1XYakGT%2BMOhC5x3IEAlzfBXBlsXLzHqGXGdEW6KYBtaWfbT%2FBptvFss9TRJyAYphYwAr9ZWlglszoxknSJ79CWZIVIIhy52Rx6fVU0JWikYhwy4Vjl%2BbgewQhy2kVmN9TU9aNO8Ye%2F7WqWDz0upinGtPwB6CxDtMuHUAhlEQ1B1LpgokEWVYCMfNAa4hZkFVB9UmY9usaxH01oLMxPOYNio%2BP22bHS8fR9Ex9e5ldFW24rG44I0i%2BbCecqx6CrKxS%2Ftc35pUCZYFt%2BOcKMkM7F5WhMlEUTbTZCMznRgwc2%2BEXH%2FJeEOvlFwzmrhQLD3Z9s93GdJ8SspchUV7M7JAJ00gGacI7LYOpc%2FR%2BHsnZUcTEJT4vKFttsH5DohAWN0cUYCJ7ghmQ8hjHkTlONBQNQ2nPpKfSpCTVralB9fqLI%2BzThJ1xtVHFP7rgiJ1AKMeRQMr3G0oJg3fccvByK8Wk7j1N2Kgc5T3UJeSAvjyaWfDtZXa1QPBT2k5OZgMzZ8g5gBqI%2FgzxBSMuIH%2FLsWJuhnJvLk%2BIlNTh7Zp%2FWL%2FHZUhCKCsQii2adZ1epUbtM%2BlK%2FTr7dD3XP2EW4W20crPqFrBihbiaFMli2mvQu8OVBf0tlhId8GrtK3Of%2BgYv5sFCakyo51LIc3mi8ykeZx36k6kJJNcQfCKQ3CyujNKHP9OdIxeqeD8wd02zzJLZQ%2BM520OPFor5AmA6GZ8CNR7MWftfL8pBCGds%2FADyxaGkxbBoHpiD%2Fi8FqUot2nHd4ZRIR5pyk%2F5tNk%2FUQx4lOQ4AvhZ8gByKkG%2B4gBsalCPNtIUUOOnleinBiIdy8mqYEKrV01AwhoyuLwz1IZi9oXdeTRk17qbv8Dp9gjR7q%2FCMxk79LS32jT4%2F9lL%2BF6gEQlQL%2FaM7eJ%2F5TIL2Qocx%2FFCPQCpGWqIv5tJvhhYa6rcUyKZE7igz1nLAmZTuoV2LVuZfUHmutq65Ner5sShfY%2FDhx00yQNmiGGd263UG5ZKD2GmLMM2ckVmHgXJwOOxgyIb%2Fkl5ZxDprVipJUDR6wx2bk6t8GPQQaS0fRVxCmTZJa92CVv%2B37K4Ex23kwnMrGjeGgvt6N7jTE7wm0oHqOyvihOR5ELiZvYABXRyVJtFam2Bcq%2F8VZyu2zYftfGlcM8b7WR3U4jTJKcfMQgBZccaCnfxW31AkaJ5qqFvMQHLZ2X7XWq8mDv2YljgNc4G0WmXlPPX39VcQVCYHD6SmNPRwBR6UsVk%2FO7O6QYuWmGUGKX8y0UwQLRM00r7pqCxVUSgvIMU0oro8GRDe2rhrrc%2BSGtiZ6mJFQ7YOco%2FE829mCeXu1IjEmFM7stpLWIHoSEGBLRaf4ZKTMe%2BIPNP5AqisrcoOM3dz%2B0lfTqB11G6AX2JcM1Zj4gbNhPrQNpnN8oeYn6xfZbXb7g8JMfe05roaYmVJ5cwhyQcCocMZWD74nGPjXCBozz5y6NSAW%2F7tRwl%2FvGoZkBI6xcBqwJYWfZEFcSAFFEg0y9YivfCp2FRIjC9glhGkuRKWsZJXfwnnFdLF10xymctTLRZuLHPq91KgZ8qOumNCf2xkdz2rQsQxiQEIB4j0Si8rL6%2F6ufkYfqkSJVYGhxqi0IlSqOqVlC7zxjkDKTUhUQAplbOS6ngR4HfQUohwxH2whtVSc73HaEavcGaDsPVqTmitDMVEnCS4Yv699cKeh8cvLFou%2FLlp8Hpcop9xohd2yrOmhYQkdVkPRZgrRiIPZY93cRGOlPAOTX%2FeoG69YEr7uUm8vCOrei4qxEvPWAbkcBM%2Ffzu02ZbLzO26on%2BmJmskKf7tM4H%2F4%2FzTIM47TIOvAGDMmKgu0Vd4M8O0EADkvoRP0fqQkwG7DkaH2EtBrybYSQ2f16oH8hyeS%2BH4XTNCIQ5FGPQOxJwZTQdVTcIiXzRtqSbU0xG4AhSIDWKGi8YLIrsSWEQzXjwsh0b7pMSUbfZcuZ988vy0s8gqAryXmyuGFUc3cuZnUFl2E5sweHSPe85hwFrTxAJIjVe5GLQ2YaE1TXkkmpvZ3vZFvE%2BIMVv8LSOYY9JHGd3y2nVmjdXNi8V9R5n58xypEWebKUTfW1hw7o6waytXituv1KlQWp75tvjiQB%2BTQHecUrkfe7po6zu0ssl5YpirN4zTWJ3YSe4CN4HVGB17Eg86MjTw25xDO1AK6rkBRTm766p82sLLK0Js578dI0GjbSQPi%2BwIS1TKcUlSfe2Kj2zndk3WYZ6uvdvMy%2FMq5FRFVEk8%2BWDa13UTL5LGKj%2Fm2ZAYh3J46VQWl9NNploDbBVmzlzstKMFipakIhOt11cqtmDzEx5WsExqGUTEw1RHSsQojicaS55PMhB6xQvvwI1gSCFcjecsPR2iZsAFMWomz6U%2By0pxNJI0y566Rb3SBJ%2BiQsmUoC40%2FYVTkVGF9J7CSCQ1l7S7kzGWAK7vq9KrZ03Vl%2B8xf5eHkvc0ljxQzvi9vCCLdqDL7SsyBjWrJeUwNR0sfvVjT3aYf05E%2FRgW0aFHhI8fmoCo6q1hloDaTISegr3nftUM83ZZvIptJsjJLn1qDidU8xlGCJUQ94XRF4xMPxS4xhB9lWNcEncdkyhNc6wpTN7LSQNSy8bmkjZHhhFe8pyDJsU3zY6n0E8cqq0Zz9WgQyhHYSd%2ByOT5huArNh8ao%2BS87KzWTv4Aby4VJT8tE90Et7eTCMzL%2FBwgzte7YS2tLKhZSwz8cLSzWVavKXEbObXvh7b4iM5kuV9jwoQsg6jUXb8x22zgK0E%2B5%2FYK1xUWcRenzlBe3d8aIuL7JrQ2puHsPfjkxgzzQbVWm5%2BCDtZdIsq24UHdMBB%2BijF8qz1UIOgRcSI%2BxSPQUOEpNQqx8Am9165E9Ag8EXirWJ43wV2s12kxewbsP6MPLMePuuI8q3iIN6R6VnWV185MH%2B2GbLiXDBqwid28Mcm51BfV4PIQSXWY94BKJrdK3onMwpFoT%2FNU91ROE86ztjGwOdVk2x6xpGAXXRAL%2BtuWLApul%2BJjIgms4nGKe6k56XfqF%2FnQ%2B1c55xI9V89Af&__VIEWSTATEGENERATOR=4C90B7CD&__EVENTVALIDATION=FIlCtdrB9cKJD2se2Odn3Rs6QsQPtqSMrxD869EClY%2FtUSjq%2BeAon6ixM5cO%2BzRs82S1zmCLXvCwgDYecrCVORQMRdaKGAz%2BKVp1ip4HMv8dgXvnUzyEeGpa2H%2FES5LIDEEfJoPBUVQc4mgaPNmUKySHHJmcuPDvijyw7gXuwza6PPBih2Niyj0SX1qN%2BYyJAKKbi9RCSYb3QbwPq%2FhR1CTAyjvTnUo9iKpccQZw3aMB0pGYH2SIi0d%2BKbdxB0%2BT3dZ55q4BvWrrt64uJ7qW9eG%2FZOnKx4D3iBZQfC56s%2F55wGmIJ%2BdhodJK%2BFlTLRPzhltlAc6ts%2Foi1DAl1ilPm01Z64Fa6VekVNWu124%2FE59S0XeoI0mbGPFK0i2JBvpK6X78ynPW9gT5IgVjR%2Fn0IXLg2oDD5Q5UvcGdryfk1a5Jt3RGINlaRIZaTxgPJo9XDxPUERNSFTS9nB11u3i61qB2x3hBQDBF41CJbzNyl%2BuCNaug7n81VJqmerTJVw6dgc2PcEc1B5SUT9ayQTjadBKgdCntus9lqilp%2BhI794w1%2BDHTwh2i66g0EfYA6aatPsmeyua1P1BjqJ0Ns40W38bc8SZhx5UiVIdwHC1oLwQ%2FuTuZQob3mRVWrCM0WLXzJ53%2BD0P%2BQ0%2F%2FgSFBKkvQH4CYhsSEoWfu4n3rMgqpRDFfThkmurLzbCJrqRvOyfH2HaCMAEcUnVwymO2JcuFlbitthwH%2Bx7JCcqh8hz3bl%2BDYO5VdmNT8iZLqG3CzXHUNY6ohTq4FFXOLdTOnshH5bW68C219Fe%2FAXreY8mASor%2BdGm0031rGbH9sTiHNLOmrTa42mfCeNyeKQ6zXZz1FA6Es0vgkGcknui6fPb0Kmqa7aVqlH5Qr7NtX7CTuxskMcGHI5vLCBVAkHOYc9Jzsn%2FUE5M7rOBW4lxurOBqkL20Pol%2B9Uua3MeaoEwrzEYdLyaShexCWQs8tg5oyh8GSMi%2BulMsBSD39xztpigvBfy7lv7vmAQFJ3szQhNLFL4NbH3xw9zwJDNaSMANUMRGPHCd1CdcArDSjb%2FsW9gm%2FDstTSRuc22PoiahPi%2BfMDU%2FAQ6NdA7aFYavAJ0wuwUXPlonbTLKlK90i%2FNNkl2DsT18cPZjWV%2BTqmp7nCMjAqCu3Hr798iySrPYVRjbHlvKzxC79Ax6jTUPHBq5TmKccC0VivnI5SdS9avjV0%2FcOtWpez62XwNAwqJs82KIbBCq3Cj8hGEAi0oxzyt0pH65P4SKSjFkrD9fz9pg9wLgUZf2W1my3n0CmdAnmchY6fBrvWsa6EorHT1vpEmFIhaXZX5Mb%2Bb1ARXJe7j1MWtJI8ixWgklShThNL4w95yj6pvGM0Wb3N0aLM0EJRrYowiR2Y5t6DxBa9tMZLvaAmvhA9axavkmb0CmDlOIk3X7OSv0lMquWVt34aMCcIfQ1t8q8p7YGMUgJmOguzoc%2FEmodImD%2FT1RrokA8esLI863BlrvxRrK4VOsOGeHDcTKufo49d7%2Byo%2FMJs3Lxe7kmlPvulJZZJhXokpXcqv9uYNF4tc4wlJFKtqeJRkSC2erMQCQxPgjNvdi7Cg6JC%2FAkZZWLMPn5ucLg0iMdDdDFQFrv3idNK3MTUOsQHBjt1s8vg6hAfXZrJC2Y%2BecpQe5xzD2zvcD%2B6HGW9s%2Fe%2BY0eVgToD2EFDOroT7PiS%2BSUtsqZ6Qts9DsHBlGpHT4ltopStTV6soAx6di3DdJAz5%2BWGkWcFD%2BhF7I5xfROPR9IGEuq6Qd4qxbW3v8ZBGS6bq464Oub2i5BBr6AixeIsCOEaUxE02fjHdFAHdCumFMuB4WeFPIwzWWKticiZcGFlp0PGW77SL64fr6iYGeR5NjU2OH04cRN8TLqAE6sI29%2Bjb9wP6vfi8EDeJsac93IExTACjXqyc2EIEtXPq9%2B%2BBo45GSgZ1XYpd%2F%2F4KGeC5Z%2FX4GCnEMb3niaijVABXEp3hyNiAgjLX722aqUdEUEk1ewnycMGKdIwooNckl3OY9htFtU4Y0n96qs1JXZNix9zdCcpsdnbYND0UV3q%2FcomhtBU7Z0pBlxzw%3D%3D&ctl00%24ContentPlaceHolder1%24gvAttendance%24ctl23%24ddlPaging=1&ctl00%24ContentPlaceHolder1%24gvAttendance%24ctl23%24ddlPageSize=ALL");
    req.end();

    req.on("error", (err) => reject(err));
});

//skAttendance should be the parsed output of AttendanceData
//Binary search kinda to return an array with all the td stats
const findSchool = (skAttendance, code) => {
    for (var left = 0, right = skAttendance.length, middle = Math.floor(skAttendance.length / 2); left <= right; middle = Math.floor((left + right) /2))
    {
        if (skAttendance[middle].querySelector("td").innerText < code)
        {
            left = middle + 1;
        }
        else if (skAttendance[middle].querySelector("td").innerText > code)
        {
            right = middle - 1;
        }
        else if (skAttendance[middle].querySelector("td").innerText == code)
        {
            return skAttendance[middle].querySelectorAll("td");
        }
    }

    return -1;
}