const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
require('dotenv-safe').config();
let { verifyJWT }= require("./controller/AuthController")

// import Routes
const routeLogin = require("./routes/login");
const routeUser = require("./routes/user");

// bcrypt tests
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

// auto-gen a salt and hash
let hash1 = 0
bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    hash1 = hash
    console.log(hash1)
});

// to check a password:
// Load hash from your password DB.
bcrypt.compare(myPlaintextPassword, hash1, function(err, result) {
  // result == true
  console.log(result)
});
bcrypt.compare(someOtherPlaintextPassword, hash1, function(err, result) {
  // result == false
  console.log(result)
});

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
// comment the following line to ignore login
app.use("/api/login", routeLogin);
// comment the folowing line to ignore jwt auth
//app.use(verifyJWT)

// following routes use verifyJWT for authentication
app.use("/api/users", routeUser);


let protocol = "http";
let host = "localhost";
let port = 3000;

app.listen(port, () => {
  console.log(`Server started at ${protocol}://${host}:${port}`);
});
