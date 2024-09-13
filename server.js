const express = require("express");
const app = express();
const port = 3100;
app.get("/memes", (req, res) => {
  var fs = require("fs"),
    path = require("path"),
    filePath = path.join(__dirname, "src/index.html");

  fs.readFile(filePath, { encoding: "utf-8" }, function (err, data) {
    if (!err) {
      console.log("received data: " + data);
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    } else {
      console.log(err);
    }
  });
});
app.get("/", (req, res) => {
  console.log(req);
  res.send(
    "<html><head><title>hello</title></head><body><h1>hello</h1></body></html>"
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
