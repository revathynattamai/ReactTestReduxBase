var express = require("express");
var cors = require("cors");
const bodyParser = require('body-parser')
var app = express();
app.use(cors());
app.use(bodyParser.json())

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

app.post("/validate", function (req, res) {
  res.status(200).send(validateBalance(req.body.data));
})

var PORT = 5000;
app.listen(PORT, function () {
  console.log("Server is running on PORT:", PORT);
});