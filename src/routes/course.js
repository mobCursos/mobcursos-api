let express = require("express");
let router = express.Router();
const controller = require("../controller/CourseController");
const { authRole } = require("../controller/AuthController");

router.get("/inscrever", authRole(['admin','aluno']), controller.enroll);
router.post("/criar", authRole(['admin','prof']), controller.add);
router.put("/:id", controller.alter);
router.delete("/:id", controller.remove);

module.exports = router;