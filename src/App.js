export default function App() {
  function onFileChange(event) {
    console.log(event.target.files[0])
    event.preventDefault();
    let formData = new FormData();
    formData.append("file", event.target.files[0]);
    fetch(`http://localhost:5000/postFile/${event.target.files[0].type.split("/")[1]}`, {
      method: "POST",
      body: formData,
    }).then((response) => {
      response.json().then((body) => {
        console.log(body)
      })
    })
  }

  return (
    <div className="App">
      <input type="file" name="file" onChange={(e) => onFileChange(e)} />
    </div>
  );
}
