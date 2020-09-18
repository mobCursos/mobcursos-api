const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
require('dotenv-safe').config();
let { verifyJWT }= require("./controller/AuthController")

//Import Routes
const routeLogin = require("./routes/login");
const routeUser = require("./routes/user");

// log file usign morgan
// create a write stream (append mode)
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "log\\access.log"),
  { flags: "a" }
);

// database connection - using mongoose
mongoose.connect("mongodb://localhost:27017/app_mobcursos", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false, // skip warnings on find and modify
}); //teacher uses then and catch Promises. Mongoose tutorial uses as below

// teacher uses here too to mongoose be acessible by model/User ?????
// mongoose.Promise = global.Promise

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  // connected
  console.log("Connection to database estabilished");
});

// middlewares
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing applications/x-www-form-urlencoded
// log middleware
app.use(morgan("combined", { stream: accessLogStream }));
app.use(morgan("combined"));

// use routes (and api paths) after middlewares
app.use("/api/login", routeLogin);

app.use(verifyJWT)
// following routes use verifyJWT for authentication
app.use("/api/users", routeUser);


let protocol = "http";
let host = "localhost";
let port = 3000;

app.listen(port, () => {
  console.log(`Server started at ${protocol}://${host}:${port}`);
});
