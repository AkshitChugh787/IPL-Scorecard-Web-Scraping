const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

const request = require("request");
const cheerio = require("cheerio");

const allMatchObj = require("./allMatches");

request(url, cb);

function cb(error, response, html) {
  if (error) {
    console.log(error);
  } else {
    // function to extract meaningful data from html
    extractLink(html);
  }
}

function extractLink(html) {
  let $ = cheerio.load(html); // '$' variable holds cheerio methods / $.method, cheerio also suggests to use $. It's just a convention.

  // hover on "VIEW ALL RESULTS", inspect it. it is inside the anchor <a /> tag. <a /> has attribute data-hover having value "View All Results". only the unique tag, we get it and store in the anchorElement
  let anchorElement = $('a[data-hover="View All Results"]');

  // in the anchor tag, we had the url link for "VIEW ALL RESULTS" page, by targeting the href value using attr. 'attr' method is used for Method for getting attributes. Gets the attribute value for only the first element in the matched set.
  let link = anchorElement.attr("href");

  // however, we do not get the full URL for the next page i.e, "VIEW ALL RESULTS", so we all concate the parent url and fetch it into fullLink
  let fullLink = "https://www.espncricinfo.com" + link;

  console.log(fullLink);
  allMatchObj.getAllMatch(fullLink);
}

const path = require("path");
const fs = require("fs");

let iplPath = path.join(__dirname, "IPL"); // get the full directory name and join IPL, so iplPath consists of directory till '../IPL'

dirCreator(iplPath); // create the directory using path, if that doesn't exists in our system, else you're good

function dirCreator(filePath) {
  if (fs.existsSync(filePath) == false) {
    fs.mkdirSync(filePath);
  }
}
