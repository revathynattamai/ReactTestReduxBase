import Papa from "papaparse";
import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState("")
  const [failedTransactions, setFailedTransactions] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const getData = async () => {
      if (data) {
        const response = await fetch("http://localhost:5000/validate", {
          method: "POST",
          body: JSON.stringify({
            data
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        })
        const resData = await response.json()
        setFailedTransactions(resData)
      }
    }
    getData()
  }, [data])

  const changeHandler = (event) => {
    let fileType = event.target.files[0].name.split(".")[1]
    if(fileType == "csv") {
      Papa.parse(event.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          setData(results.data);
        },
      });
    } else if(fileType === "xml") {
      console.log("called sml")
    } else {
      setData("");
      setError("Unsupported fileType")
    }
  };

  return (
    <div className="App">
      <div>
        <input
          type="file"
          name="file"
          accept=".csv,.xml"
          onChange={changeHandler}
        />
        {failedTransactions && <table>
          <tbody>
            {
              failedTransactions.map((transaction) => (
                <tr key={transaction.Reference}>
                  <td>{transaction.Reference}</td>
                  <td>{transaction.Description}</td>
                </tr>
              ))
            }
          </tbody>
        </table>}
        {error ?? <p>{error}</p>}
      </div>
    </div>
  );
}