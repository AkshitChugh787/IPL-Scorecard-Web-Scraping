const cheerio = require("cheerio");
const request = require("request");
const scorecardObj = require("./scorecard");

function getAllMatchLink(uri) {
  request(uri, function (error, response, html) {
    if (error) {
      console.log(error);
    } else {
      extractAllMatchLink(html);
    }
  });
}

function extractAllMatchLink(html_) {
  //a[data-hover="Summary"]
  let $ = cheerio.load(html_); // '$' variable holds cheerio methods / $.method, cheerio also suggests to use $. It's just a convention.

  // hover on "VIEW ALL RESULTS", inspect it. it is inside the anchor <a /> tag. <a /> has attribute data-hover having value "View All Results". only the unique tag, we get it and store in the anchorElement
  let scoreCardElement = $('a[data-hover="Scorecard"]');

  // in the anchor tag, we had the url link for "VIEW ALL RESULTS" page, by targeting the href value using attr. 'attr' method is used for Method for getting attributes. Gets the attribute value for only the first element in the matched set.
  for (let i = 0; i < scoreCardElement.length; i++) {
    let scoreCardLink = $(scoreCardElement[i]).attr("href");
    let fullLink = "https://www.espncricinfo.com" + scoreCardLink;
    console.log(fullLink);
    scorecardObj.ps(fullLink);
  }
}

module.exports = {
  getAllMatch: getAllMatchLink,
};
