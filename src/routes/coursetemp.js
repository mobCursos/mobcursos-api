let express = require("express");
let router = express.Router();
const controller = require("../controller/CoursetempController");
const { authRole } = require("../controller/AuthController");

router.get("/inscrever", authRole(['admin','aluno']), controller.enroll);

module.exports = router;