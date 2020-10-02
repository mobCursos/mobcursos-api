let express = require("express");
let router = express.Router();
const controller = require("../controller/CourseController");
const { authRole } = require("../controller/AuthController");

router.get("/", controller.list);
router.post("/subscribe", authRole(['aluno']), controller.subscribe);
router.post("/unsubscribe", authRole(['aluno']), controller.unsubscribe);
router.post("/", authRole(['prof']), controller.add);

module.exports = router;