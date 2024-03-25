import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState("")
  const [failedTransactions, setFailedTransactions] = useState("")
  const [error, setError] = useState("")
  const [file, setFile] = useState("")
  const [fileType, setFileType] = useState("")
  // useEffect(() => {
  //   const getData = async () => {
  //     if (data) {
  //       const response = await fetch("http://localhost:5000/upload", {
  //         method: "POST",
  //         body: JSON.stringify({
  //           data
  //         }),
  //       })
  //       const resData = await response.json()
  //       setFailedTransactions(resData)
  //     }
  //   }
  //   getData()
  // }, [data])

  useEffect(() => {
    const postData = async() => {
      if(file) {
        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: file,
        })
        const resData = await response.json()
        // setFailedTransactions(resData)
      }
    }
    postData()
  }, [file])

  const changeHandler = (event) => {
    let formData = new FormData();
    formData.append("file", event.target.files[0]);
    setFile(formData)
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
      </div>
    </div>
  );
}