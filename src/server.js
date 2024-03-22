var express = require("express");
const upload = require("express-fileupload");
const Papa = require('papaparse');
const fastCSV = require('@fast-csv/parse');
var cors = require("cors");
const path = require('path');
const fs = require('fs');
var app = express();
const csvParser = require("csv-parser");
//MIDDLEWARES
app.use(upload());
app.use(cors());
//ROUTE DEFINE

function validateBalance(data) {
  console.log("data", data)
  let referenceList = []
  let failedTransactions = []
  data.forEach((d) => {
    let endBalance = parseFloat(d["Start Balance"]) + parseFloat(d["Mutation"])
    if (referenceList.indexOf(d.Reference) !== -1) {
      referenceList.push(d.Reference)
      failedTransactions.push(d)
    } else if (endBalance.toFixed(2) != parseFloat(d["End Balance"])) {
      failedTransactions.push(d)
    }
  })
  return failedTransactions;
}
app.post("/postFile/csv", async function (req, res) {
  const file = req.files.file;

  if (!file || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const fileUploadPath = __dirname + '/parsed'+ file.name;

  const createStream = fs.createWriteStream(fileUploadPath);
createStream.end();

  // Use the mv() method to place the file somewhere on your server
  file.mv(fileUploadPath, (err) => {
    if (err)
      return res.status(500).send(err);
  });

  const result = [];
  
  fs.createReadStream(fileUploadPath)
    .pipe(csvParser())
    .on("data", (data) => {
      console.log(data)
      result.push(data);
    })
    .on("end", () => {
      res.status(200).send(validateBalance(result));
    });

});

app.get("/emp", async function (req, res) {
  res.send("fadfadf")
});

var PORT = 5000;
app.listen(PORT, function () {
  console.log("Server is running on PORT:", PORT);
});