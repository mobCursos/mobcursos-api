const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
require('dotenv-safe').config();

// disable auth on .env only for quick tests purpose
const enable_auth = process.env.ENABLE_AUTH;

// import controller
const { verifyJWT, authRole } = require("./controller/AuthController");

// import Routes
const routeLogin = require("./routes/login");
const routeUser = require("./routes/user");
const routeCourse = require("./routes/course");
const routeCourseNoAuth = require("./routes/course-noauth");

// log file usign morgan
// create a write stream (append mode)
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "log\\access.log"),
  { flags: "a" }
);

// database connection - using mongoose
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/app_mobcursos", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false, // skip warnings on find and modify
}); //teacher uses then and catch Promises. Mongoose tutorial uses as below

// teacher uses here too to mongoose be acessible by model/User ?????
mongoose.Promise = global.Promise

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  // connected
  console.log("Connection to database estabilished");
});

// cors

app.options('*', cors());
// app.use(cors());

// middlewares
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing applications/x-www-form-urlencoded
// log middleware
app.use(morgan("combined", { stream: accessLogStream }));
app.use(morgan("combined"));

// no auth routes fos users not logged in
app.use("/api/courses-noauth", routeCourseNoAuth);


// use routes (and api paths) after middlewares

if (enable_auth === 'true') {
// login
app.use("/api", routeLogin);
// jwt auth
app.use(verifyJWT);
} else {
  // login - to use register toute
  app.use("/api", routeLogin);
  console.log("WARNING: AUTH DISABLED");
}

// // following routes use verifyJWT for authentication
app.use("/api/users", routeUser);
app.use("/api/courses", routeCourse);


let protocol = "http";
let host = process.env.HEROKU_APP_NAME || "localhost";
let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started at ${protocol}://${host}:${port}`);
});
