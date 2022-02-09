const url =
  "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
// .header-info .description
const request = require("request");
const cheerio = require("cheerio");
const xlsx = require("xlsx");

function processScoreCard(url) {
  request(url, cb);
}

function cb(error, response, html) {
  if (error) {
    console.log(error);
  } else {
    // function to extract meaningful data from html
    extractLink(html);
  }
}

function extractLink(html) {
  let $ = cheerio.load(html);
  let content = $(".header-info .description");
  let details = content.text();
  details = details.split(",");
  let venue = details[1].trim();
  let date = details[2].trim();
  // console.log("Venue ->" + details[1].trim()); // trim() removes extra space
  // console.log("Date ->" + details[2].trim());

  let result = $(
    ".match-info.match-info-MATCH.match-info-MATCH-half-width .status-text"
  );
  let outcome = result.text();
  // console.log("Result ->" + result.text());

  // content = $(".name-detail a.name-link p.name");
  // for (let i = 0; i < content.length; i++) {
  //   let teamNames = $(content[i]).text();
  //   console.log(teamNames);
  // }
  let innings = $(".card.content-block.match-scorecard-table>.Collapsible");

  let htmlString = ""; // declare empty htmlString that will store the tables of two teams in HTML format
  let teamName = "";
  let opponentName = "";
  for (let i = 0; i < innings.length; i++) {
    htmlString += $(innings[i]).html(); // we will append both tables in html format in the htmlString string

    teamName = $(innings[i]).find("h5").text(); // h5 tag holds heading of tables i.e, team names
    teamName = teamName.split("INNINGS")[0].trim();

    let opponentIndex = i == 0 ? 1 : 0;
    opponentName = $(innings[opponentIndex]).find("h5").text();
    opponentName = opponentName.split("INNINGS")[0].trim();

    let currInning = $(innings[i]); // pehle mumbai ka table, then chennai ka table currInning mein jaayega

    let allRows = currInning.find(".table.batsman tbody tr");

    for (let j = 0; j < allRows.length; j++) {
      let allCols = $(allRows[j]).find("td");
      let isWorthy = $(allCols[0]).hasClass("batsman-cell");

      if (isWorthy) {
        // Player Name runs balls fours sixes and strike rate
        let playerName = $(allCols[0]).text().trim();
        let runs = $(allCols[2]).text().trim();
        let balls = $(allCols[3]).text().trim();
        let fours = $(allCols[5]).text().trim();
        let sixes = $(allCols[6]).text().trim();
        let strikeRate = $(allCols[7]).text().trim();

        console.log(
          `${playerName} | ${runs} | ${balls} | ${fours} | ${sixes} | ${strikeRate}`
        );

        processPlayer(
          teamName,
          playerName,
          runs,
          balls,
          fours,
          sixes,
          strikeRate,
          opponentName,
          venue,
          result
        );
      }
    }
    console.log("*******************************************************");
    // console.log(teamName);
    // console.log(opponentName);
    // console.log(venue, date, teamName, opponentName, outcome);
  }
  // now we will print htmlString and copy its contents into the new .html file i.e, innings.html. now open live server and inspect innings.html and do the further tasks.
  // console.log(htmlString);
}
const path = require("path");
const fs = require("fs");

function processPlayer(
  teamName,
  playerName,
  runs,
  balls,
  fours,
  sixes,
  strikeRate,
  opponentName,
  venue,
  result,
  date
) {
  let teamPath = path.join(__dirname, "IPL", teamName);
  dirCreator(teamPath);

  let filePath = path.join(teamPath, playerName + ".xlsx");
  let content = excelReader(filePath, playerName);

  let playerObj = {
    teamName,
    playerName,
    runs,
    balls,
    fours,
    sixes,
    strikeRate,
    opponentName,
    venue,
    result,
    date,
  };
  content.push(playerObj);
  excelWriter(filePath, content, playerName);
}

function dirCreator(filePath) {
  if (fs.existsSync(filePath) == false) {
    fs.mkdirSync(filePath);
  }
}

function excelWriter(filePath, data, sheetName) {
  // JSON to excel
  let newWB = xlsx.utils.book_new();
  // add new workbook using xlsx.utils.book_new() method
  let newWS = xlsx.utils.json_to_sheet(data); // pass JSON data to json_to_sheet method that will convert it into sheet format to new worksheet
  xlsx.utils.book_append_sheet(newWB, newWS, sheetName); // append workbook, worksheet and sheetName - "Avengers" to book_append_sheet
  xlsx.writeFile(newWB, filePath); // pass the workbook and filename to write over marvel.xlsx file
}

function excelReader(filePath, sheetName) {
  // excel to JSON

  if (fs.existsSync(filePath) == false) {
    // if file is empty, then simply return
    return [];
  }
  let wb = xlsx.readFile(filePath); // which excel file to read
  let excelData = wb.Sheets[sheetName]; // provide which sheet name
  let ans = xlsx.utils.sheet_to_json(excelData); // convert data from sheet to JSON into ans
  return ans;
}

module.exports = {
  ps: processScoreCard,
};
