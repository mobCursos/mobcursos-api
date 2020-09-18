// utilizando classe express.Router()
let express = require("express");
let router = express.Router();
const controller = require("../controller/LoginController");

router.post("/", controller.login);

module.exports = router;
