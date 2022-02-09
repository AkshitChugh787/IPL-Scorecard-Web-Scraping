const fs = require("fs"); // first import fs module to read file

let buffer = fs.readFileSync("./example.json"); // fs.readFileSync will fetch buffer data from example.json to 'buffer' variable
// console.log(buffer);

let data = JSON.parse(buffer); // pass the buffer part to JSON.parse to convert it into JSON Format
//console.log(data); // data is actually an array, so we can perform our array methods to the data

// // or use this instead of doing that buffer and parse methods
// let data = require("./example.json");

data.push({
  name: "Thor",
  "last name": "Odinson",
  isAvengers: true,
  age: 10000,
  friends: ["Bruce", "Tony", "Peter"],
  address: {
    city: "Asgard",
    state: "Denmark",
  },
});

//console.log(data);

let stringData = JSON.stringify(data); // JSON.stringfy will convert the JSON format data into string format

fs.writeFileSync("./example.json", stringData); // and it will write over that updated data to my example.json

const xlsx = require("xlsx");

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
  let wb = xlsx.readFile(filePath); // which excel file to read
  let excelData = wb.Sheets[sheetName]; // provide which sheet name
  let ans = xlsx.utils.sheet_to_json(excelData); // convert data from sheet to JSON into ans
  console.log(ans);
}
