// utilizando classe express.Router()
let express = require("express");
let router = express.Router();
const controller = require("../controller/LoginController");

router.post("/", controller.login);
router.post("/register", controller.signin);


module.exports = router;
