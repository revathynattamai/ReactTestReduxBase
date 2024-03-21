var express = require("express");
const upload = require("express-fileupload");
const Papa = require('papaparse');
const fastCSV = require('@fast-csv/parse');
var cors = require("cors");
const path = require('path');
const fs = require('fs');
var app = express();
//MIDDLEWARES
app.use(upload());
app.use(cors());
//ROUTE DEFINE

function validateData(data) {
  let endBalance = parseFloat(data["Start Balance"]) + parseFloat(data["Mutation"])
    console.log(endBalance)
    console.log(parseFloat(data["End Balance"]))
    if(endBalance === parseFloat(data["End Balance"])) 
    return data

}
app.post("/postFile/csv", async function (req, res) {
     const file = req.files.file;

  if (!file || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const fileUploadPath = __dirname + '/csvFiles/' + file.name;

  // Use the mv() method to place the file somewhere on your server
  file.mv(fileUploadPath, (err) => {
    if (err)
      return res.status(500).send(err); 
    });

  const uploadedFileReadStream = fs.createReadStream(fileUploadPath);
  const csvRows = [];

    uploadedFileReadStream
    .pipe(fastCSV.parse({ headers: true, ignoreEmpty: true }))
    .validate((data) => validateData(data))
    .on('data', row => csvRows.push(row))
    .on('end', () => res.status(200).json({csvRows}))
});

app.get("/emp", async function (req, res) {
  res.send("fadfadf")
});

var PORT = 5000;
app.listen(PORT, function () {
  console.log("Server is running on PORT:", PORT);
});