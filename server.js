const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "796875",
  key: "5fa9ca0824fa47b87f98",
  secret: "f5d1a3df8467353dfad4",
  cluster: "eu",
  encrypted: true
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);
  // Pass to next layer of middleware
  next();
});

app.set("port", 5000);

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.post("/prices/new", (req, res) => {
  console.log("1");

  pusher.trigger("coin-prices", "prices", {
    prices: req.body.prices
  });
  console.log("2");

  res.sendStatus(200);
});

app.listen(app.get("port"), () => {
  console.log("Node app is running on port", app.get("port"));
});
