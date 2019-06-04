const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const Pusher = require("pusher");

app.use(express.static("client/build"));

const pusher = new Pusher({
  appId: "796875",
  key: "5fa9ca0824fa47b87f98",
  secret: "f5d1a3df8467353dfad4",
  cluster: "eu",
  encrypted: true
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("port", 5000);

app.get("*", function(req, res) {
  res.res.sendFile(path.resolve("build", "index.html"));
});

app.post("/prices/new", (req, res) => {
  pusher.trigger("coin-prices", "prices", {
    prices: req.body.prices
  });
  res.sendStatus(200);
});

app.listen(app.get("port"), () => {
  console.log("Node app is running on port", app.get("port"));
});
