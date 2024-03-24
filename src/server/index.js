var express = require("express");
const upload = require("express-fileupload"); //Needed to access the uploaded the files in request
const fs = require('fs');
const csvParser = require("csv-parser");
var cors = require("cors");
var app = express();
app.use(upload());
app.use(cors());


function validateBalance(data) {
  let referenceList = []
  let failedTransactions = []
  data.forEach((d) => {
    let endBalance = parseFloat(d["Start Balance"]) + parseFloat(d["Mutation"])
    if (referenceList.indexOf(d.Reference) !== -1) {
      failedTransactions.push(d)
    } else if (endBalance.toFixed(2) != parseFloat(d["End Balance"])) {
      failedTransactions.push(d)
    }
    referenceList.push(d.Reference)
  })
  return failedTransactions;
}

app.post("/validate", async function (req, res) {
  const file = req.files.file;
  const fileUploadPath = __dirname + '/parsed'+ file.name;
  file.mv(fileUploadPath, (err) => {
    if (err)
      return res.status(500).send(err);
  });

  const result = [];
  
  fs.createReadStream(fileUploadPath)
    .pipe(csvParser())
    .on("data", (data) => {
      console.log("''''data", data)
      result.push(data);
    })
    .on("end", () => {
      res.status(200).send(validateBalance(result));
    });
})

var PORT = 5000;
app.listen(PORT, function () {
  console.log("Server is running on PORT:", PORT);
});